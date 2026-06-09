using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeteriaAPI.Models;

[Table("tb_produto")]
public class Produto
{
    [Key]
    [Column("ID_PRODUTO")]
    public int IdProduto { get; set; }

    [Column("COD_CATEGORIA")]
    public int? CodCategoria { get; set; }

    [Column("NOME_PRODUTO")]
    [Required]
    [MaxLength(100)]
    public string NomeProduto { get; set; } = string.Empty;

    [Column("DESCRICAO_PRODUTO")]
    [MaxLength(255)]
    public string? DescricaoProduto { get; set; }

    [Column("IMAGEM_PRODUTO")]
    [MaxLength(500)]
    public string? ImagemProduto { get; set; }

    [Column("VALOR_UNITARIO_PRODUTO")]
    [Required]
    public decimal ValorUnitarioProduto { get; set; }

    [Column("DESTAQUE")]
    public bool Destaque { get; set; } = false;

    // Navegação
    [ForeignKey("CodCategoria")]
    public Categoria? Categoria { get; set; }

    public ICollection<ItemPedido> ItensPedido { get; set; } = new List<ItemPedido>();
}
