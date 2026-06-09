namespace CafeteriaAPI.DTOs;

// ----------------------------------------------------------------
// DTO de RESPOSTA — pedido completo com itens
// ----------------------------------------------------------------
public class PedidoDto
{
    public int Id { get; set; }
    public string Numero { get; set; } = string.Empty;   // ex: "#00001"
    public DateTime Data { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "pendente";
    public int? UsuarioId { get; set; }
    public string? NomeCliente { get; set; }
    public List<ItemPedidoDto> Itens { get; set; } = new();
}

public class ItemPedidoDto
{
    public int Id { get; set; }
    public int ProdutoId { get; set; }
    public string NomeProduto { get; set; } = string.Empty;
    public string? ImagemProduto { get; set; }
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
    public decimal Subtotal => ValorUnitario * Quantidade;
}

// ----------------------------------------------------------------
// DTO de REQUISIÇÃO — criar novo pedido
// ----------------------------------------------------------------
public class CriarPedidoDto
{
    public List<CriarItemPedidoDto> Itens { get; set; } = new();
    public decimal Total { get; set; }
}

public class CriarItemPedidoDto
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
    public decimal ValorUnitario { get; set; }
}

// ----------------------------------------------------------------
// DTO de REQUISIÇÃO — atualizar status
// ----------------------------------------------------------------
public class AtualizarStatusDto
{
    public string Status { get; set; } = string.Empty;
}
