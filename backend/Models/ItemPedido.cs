using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeteriaAPI.Models;

[Table("tb_item_pedido")]
public class ItemPedido
{
    [Key]
    [Column("ID_ITEM")]
    public int IdItem { get; set; }

    [Column("COD_PEDIDO")]
    [Required]
    public int CodPedido { get; set; }

    [Column("ID_PRODUTO")]
    [Required]
    public int IdProduto { get; set; }

    [Column("QUANTIDADE")]
    [Required]
    public int Quantidade { get; set; }

    [Column("VALOR_UNITARIO")]
    [Required]
    public decimal ValorUnitario { get; set; }

    // Navegação
    [ForeignKey("CodPedido")]
    public Pedido? Pedido { get; set; }

    [ForeignKey("IdProduto")]
    public Produto? Produto { get; set; }
}
