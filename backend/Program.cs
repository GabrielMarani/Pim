using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using CafeteriaAPI.Data;
using CafeteriaAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// ============================================================
// SERVIÇOS
// ============================================================

// Controllers com respostas JSON camelCase
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy =
            System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Swagger com suporte a JWT (cadeado no swagger UI)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title       = "Café Artesanal API",
        Version     = "v1",
        Description = "API REST para o sistema de pedidos da cafeteria"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT — informe: Bearer {seu_token}",
        Name        = "Authorization",
        In          = ParameterLocation.Header,
        Type        = SecuritySchemeType.ApiKey,
        Scheme      = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// Banco de dados — MariaDB/MySQL via Pomelo
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Connection string 'DefaultConnection' não encontrada.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString),
        mysqlOptions =>
        {
            mysqlOptions.EnableRetryOnFailure(
                maxRetryCount: 3,
                maxRetryDelay: TimeSpan.FromSeconds(5),
                errorNumbersToAdd: null);
        }));

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("Jwt:Key não configurado.");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer              = builder.Configuration["Jwt:Issuer"],
            ValidAudience            = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey         = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// CORS — permite qualquer origem para desenvolvimento (incluindo XAMPP)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// ============================================================
// PIPELINE
// ============================================================

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Café Artesanal API v1");
    c.RoutePrefix = "swagger";
    c.DocumentTitle = "Café Artesanal - API Docs";
});

app.UseCors("AllowFrontend");

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ============================================================
// INICIALIZAÇÃO — verificar banco + seed do admin
// ============================================================
using (var scope = app.Services.CreateScope())
{
    var db  = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var log = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    try
    {
        await db.Database.CanConnectAsync();
        log.LogInformation("✅ Conexão com o banco de dados estabelecida.");

        // Criar admin padrão se não existir
        if (!db.Usuarios.Any(u => u.Tipo == "admin"))
        {
            const string adminCpf   = "000.000.000-00";
            const string adminSenha = "admin123";

            var cpfLimpo = adminCpf.Replace(".", "").Replace("-", "");
            var hash     = Convert.ToHexString(
                SHA256.HashData(Encoding.UTF8.GetBytes(adminSenha + cpfLimpo))
            ).ToLower();

            db.Usuarios.Add(new Usuario
            {
                Nome      = "Administrador",
                Cpf       = adminCpf,
                Telefone  = "(11) 99999-0000",
                SenhaHash = hash,
                Tipo      = "admin"
            });

            await db.SaveChangesAsync();
            log.LogInformation("✅ Admin padrão criado — CPF: {Cpf} | Senha: {Senha}", adminCpf, adminSenha);
        }
    }
    catch (Exception ex)
    {
        log.LogError(ex,
            "❌ Não foi possível conectar ao banco. " +
            "Verifique se o MySQL/MariaDB está rodando e as credenciais em appsettings.json.");
    }
}

app.Run();
