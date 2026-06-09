using Microsoft.EntityFrameworkCore;
using CafeteriaAPI.Models;

namespace CafeteriaAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Pedido> Pedidos { get; set; }
    public DbSet<ItemPedido> ItensPedido { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Categoria
        modelBuilder.Entity<Categoria>(entity =>
        {
            entity.HasKey(c => c.IdCategoria);
            entity.HasMany(c => c.Produtos)
                  .WithOne(p => p.Categoria)
                  .HasForeignKey(p => p.CodCategoria)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Produto
        modelBuilder.Entity<Produto>(entity =>
        {
            entity.HasKey(p => p.IdProduto);
            entity.Property(p => p.ValorUnitarioProduto).HasPrecision(7, 2);
        });

        // Usuario
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(u => u.IdUsuario);
            entity.HasIndex(u => u.Cpf).IsUnique();
            entity.HasMany(u => u.Pedidos)
                  .WithOne(p => p.Usuario)
                  .HasForeignKey(p => p.IdUsuario)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Pedido
        modelBuilder.Entity<Pedido>(entity =>
        {
            entity.HasKey(p => p.IdPedido);
            entity.Property(p => p.TotalPedido).HasPrecision(7, 2);
            entity.HasMany(p => p.Itens)
                  .WithOne(i => i.Pedido)
                  .HasForeignKey(i => i.CodPedido)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ItemPedido
        modelBuilder.Entity<ItemPedido>(entity =>
        {
            entity.HasKey(i => i.IdItem);
            entity.Property(i => i.ValorUnitario).HasPrecision(10, 2);
            entity.HasOne(i => i.Produto)
                  .WithMany(p => p.ItensPedido)
                  .HasForeignKey(i => i.IdProduto)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
