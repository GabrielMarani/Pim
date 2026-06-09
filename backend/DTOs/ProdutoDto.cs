namespace CafeteriaAPI.DTOs;

/// <summary>
/// DTO de resposta para Produto — estrutura compatível com o frontend
/// </summary>
public class ProdutoDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string Categoria { get; set; } = string.Empty;   // slug da categoria (ex: "cafes")
    public string NomeCategoria { get; set; } = string.Empty; // nome legível (ex: "Cafés")
    public string? Descricao { get; set; }
    public string? Imagem { get; set; }
    public decimal Preco { get; set; }
    public bool Destaque { get; set; }
}

/// <summary>
/// DTO de requisição para criar/atualizar produto (somente admin)
/// </summary>
public class SalvarProdutoDto
{
    public string Nome { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string? Imagem { get; set; }
    public decimal Preco { get; set; }
    public bool Destaque { get; set; }
    public int? CategoriaId { get; set; }
}
