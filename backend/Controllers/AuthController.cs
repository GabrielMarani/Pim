using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using CafeteriaAPI.Data;
using CafeteriaAPI.DTOs;
using CafeteriaAPI.Models;

namespace CafeteriaAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public AuthController(AppDbContext db, IConfiguration config)
    {
        _db     = db;
        _config = config;
    }

    // ----------------------------------------------------------------
    // POST /api/auth/cadastro
    // ----------------------------------------------------------------
    [HttpPost("cadastro")]
    public async Task<IActionResult> Cadastro([FromBody] CadastroDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome)   ||
            string.IsNullOrWhiteSpace(dto.Cpf)    ||
            string.IsNullOrWhiteSpace(dto.Senha))
            return BadRequest(new { mensagem = "Nome, CPF e senha são obrigatórios." });

        var cpfLimpo = LimparCpf(dto.Cpf);

        if (await _db.Usuarios.AnyAsync(u => u.Cpf == dto.Cpf))
            return Conflict(new { mensagem = "CPF já cadastrado." });

        var usuario = new Usuario
        {
            Nome      = dto.Nome.Trim(),
            Telefone  = dto.Telefone?.Trim(),
            Cpf       = dto.Cpf.Trim(),
            SenhaHash = HashSenha(dto.Senha, cpfLimpo),
            Tipo      = "cliente"
        };

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();

        var token = GerarToken(usuario);

        return CreatedAtAction(nameof(Cadastro), new AuthResponseDto
        {
            Token    = token,
            Id       = usuario.IdUsuario,
            Nome     = usuario.Nome,
            Tipo     = usuario.Tipo,
            Mensagem = "Cadastro realizado com sucesso!"
        });
    }

    // ----------------------------------------------------------------
    // POST /api/auth/login
    // ----------------------------------------------------------------
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Cpf) || string.IsNullOrWhiteSpace(dto.Senha))
            return BadRequest(new { mensagem = "CPF e senha são obrigatórios." });

        var usuario = await _db.Usuarios.FirstOrDefaultAsync(u => u.Cpf == dto.Cpf.Trim());
        if (usuario is null)
            return Unauthorized(new { mensagem = "CPF ou senha incorretos." });

        var cpfLimpo = LimparCpf(dto.Cpf);
        if (usuario.SenhaHash != HashSenha(dto.Senha, cpfLimpo))
            return Unauthorized(new { mensagem = "CPF ou senha incorretos." });

        var token = GerarToken(usuario);

        return Ok(new AuthResponseDto
        {
            Token    = token,
            Id       = usuario.IdUsuario,
            Nome     = usuario.Nome,
            Tipo     = usuario.Tipo,
            Mensagem = $"Bem-vindo, {usuario.Nome}!"
        });
    }

    // ----------------------------------------------------------------
    // HELPERS
    // ----------------------------------------------------------------
    private string GerarToken(Usuario usuario)
    {
        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.IdUsuario.ToString()),
            new Claim(ClaimTypes.Name,           usuario.Nome),
            new Claim(ClaimTypes.Role,           usuario.Tipo)
        };

        var token = new JwtSecurityToken(
            issuer:             _config["Jwt:Issuer"],
            audience:           _config["Jwt:Audience"],
            claims:             claims,
            expires:            DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string HashSenha(string senha, string cpfLimpo)
    {
        var bytes = Encoding.UTF8.GetBytes(senha + cpfLimpo);
        return Convert.ToHexString(SHA256.HashData(bytes)).ToLower();
    }

    private static string LimparCpf(string cpf)
        => cpf.Replace(".", "").Replace("-", "").Replace("/", "").Trim();
}
