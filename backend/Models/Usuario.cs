using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeteriaAPI.Models;

[Table("tb_usuario")]
public class Usuario
{
    [Key]
    [Column("ID_USUARIO")]
    public int IdUsuario { get; set; }

    [Column("NOME_USUARIO")]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Column("TELEFONE_USUARIO")]
    [MaxLength(20)]
    public string? Telefone { get; set; }

    [Column("CPF_USUARIO")]
    [MaxLength(14)]
    public string Cpf { get; set; } = string.Empty;

    [Column("SENHA_HASH")]
    [MaxLength(64)]
    public string SenhaHash { get; set; } = string.Empty;

    /// <summary>"cliente" ou "admin"</summary>
    [Column("TIPO_USUARIO")]
    [MaxLength(10)]
    public string Tipo { get; set; } = "cliente";

    [Column("DATA_CADASTRO")]
    public DateTime DataCadastro { get; set; } = DateTime.UtcNow;

    public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
}
