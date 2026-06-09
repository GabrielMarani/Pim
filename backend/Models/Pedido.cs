using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CafeteriaAPI.Models;

[Table("tb_pedido")]
public class Pedido
{
    [Key]
    [Column("ID_PEDIDO")]
    public int IdPedido { get; set; }

    [Column("TOTAL_PEDIDO")]
    [Required]
    public decimal TotalPedido { get; set; }

    [Column("DATA_PEDIDO")]
    public DateTime DataPedido { get; set; } = DateTime.Now;

    [Column("STATUS_PEDIDO")]
    [Required]
    [MaxLength(20)]
    public string StatusPedido { get; set; } = "pendente";

    [Column("ID_USUARIO")]
    public int? IdUsuario { get; set; }

    // Navegação
    public Usuario? Usuario { get; set; }
    public ICollection<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
}
