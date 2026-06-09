using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeteriaAPI.Models;

[Table("tb_categoria")]
public class Categoria
{
    [Key]
    [Column("ID_CATEGORIA")]
    public int IdCategoria { get; set; }

    [Column("NOME_CATEGORIA")]
    [Required]
    [MaxLength(50)]
    public string NomeCategoria { get; set; } = string.Empty;

    [Column("SLUG_CATEGORIA")]
    [Required]
    [MaxLength(50)]
    public string SlugCategoria { get; set; } = string.Empty;

    // Navegação
    public ICollection<Produto> Produtos { get; set; } = new List<Produto>();
}
