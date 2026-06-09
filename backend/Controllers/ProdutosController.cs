using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CafeteriaAPI.Data;
using CafeteriaAPI.DTOs;
using CafeteriaAPI.Models;

namespace CafeteriaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class ProdutosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<ProdutosController> _logger;

    public ProdutosController(AppDbContext context, ILogger<ProdutosController> logger)
    {
        _context = context;
        _logger  = logger;
    }

    // ----------------------------------------------------------------
    // GET /api/produtos — público
    // ----------------------------------------------------------------
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProdutoDto>>> GetProdutos(
        [FromQuery] string? categoria,
        [FromQuery] string? busca,
        [FromQuery] bool?   destaque)
    {
        try
        {
            var query = _context.Produtos.Include(p => p.Categoria).AsQueryable();

            if (!string.IsNullOrWhiteSpace(categoria) && categoria != "all")
                query = query.Where(p => p.Categoria != null && p.Categoria.SlugCategoria == categoria);

            if (!string.IsNullOrWhiteSpace(busca))
            {
                var termo = busca.ToLower();
                query = query.Where(p =>
                    p.NomeProduto.ToLower().Contains(termo) ||
                    (p.DescricaoProduto != null && p.DescricaoProduto.ToLower().Contains(termo)));
            }

            if (destaque.HasValue)
                query = query.Where(p => p.Destaque == destaque.Value);

            var produtos = await query
                .OrderBy(p => p.NomeProduto)
                .Select(p => new ProdutoDto
                {
                    Id            = p.IdProduto,
                    Nome          = p.NomeProduto,
                    Categoria     = p.Categoria != null ? p.Categoria.SlugCategoria : "",
                    NomeCategoria = p.Categoria != null ? p.Categoria.NomeCategoria  : "",
                    Descricao     = p.DescricaoProduto,
                    Imagem        = p.ImagemProduto,
                    Preco         = p.ValorUnitarioProduto,
                    Destaque      = p.Destaque
                })
                .ToListAsync();

            return Ok(produtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar produtos");
            return StatusCode(500, new { mensagem = "Erro interno ao buscar produtos." });
        }
    }

    // ----------------------------------------------------------------
    // GET /api/produtos/{id} — público
    // ----------------------------------------------------------------
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProdutoDto>> GetProduto(int id)
    {
        try
        {
            var produto = await _context.Produtos
                .Include(p => p.Categoria)
                .Where(p => p.IdProduto == id)
                .Select(p => new ProdutoDto
                {
                    Id            = p.IdProduto,
                    Nome          = p.NomeProduto,
                    Categoria     = p.Categoria != null ? p.Categoria.SlugCategoria : "",
                    NomeCategoria = p.Categoria != null ? p.Categoria.NomeCategoria  : "",
                    Descricao     = p.DescricaoProduto,
                    Imagem        = p.ImagemProduto,
                    Preco         = p.ValorUnitarioProduto,
                    Destaque      = p.Destaque
                })
                .FirstOrDefaultAsync();

            if (produto is null)
                return NotFound(new { mensagem = $"Produto com ID {id} não encontrado." });

            return Ok(produto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar produto {Id}", id);
            return StatusCode(500, new { mensagem = "Erro interno ao buscar produto." });
        }
    }

    // ----------------------------------------------------------------
    // POST /api/produtos — somente admin
    // ----------------------------------------------------------------
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<ProdutoDto>> CriarProduto([FromBody] SalvarProdutoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nome))
            return BadRequest(new { mensagem = "Nome do produto é obrigatório." });

        var produto = new Produto
        {
            NomeProduto          = dto.Nome.Trim(),
            DescricaoProduto     = dto.Descricao?.Trim(),
            ImagemProduto        = dto.Imagem?.Trim(),
            ValorUnitarioProduto = dto.Preco,
            Destaque             = dto.Destaque,
            CodCategoria         = dto.CategoriaId
        };

        _context.Produtos.Add(produto);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduto), new { id = produto.IdProduto },
            await MapearProdutoDto(produto.IdProduto));
    }

    // ----------------------------------------------------------------
    // PUT /api/produtos/{id} — somente admin
    // ----------------------------------------------------------------
    [HttpPut("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> AtualizarProduto(int id, [FromBody] SalvarProdutoDto dto)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto is null)
            return NotFound(new { mensagem = $"Produto {id} não encontrado." });

        produto.NomeProduto          = dto.Nome.Trim();
        produto.DescricaoProduto     = dto.Descricao?.Trim();
        produto.ImagemProduto        = dto.Imagem?.Trim();
        produto.ValorUnitarioProduto = dto.Preco;
        produto.Destaque             = dto.Destaque;
        produto.CodCategoria         = dto.CategoriaId;

        await _context.SaveChangesAsync();
        return Ok(await MapearProdutoDto(id));
    }

    // ----------------------------------------------------------------
    // DELETE /api/produtos/{id} — somente admin
    // ----------------------------------------------------------------
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> DeletarProduto(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);
        if (produto is null)
            return NotFound(new { mensagem = $"Produto {id} não encontrado." });

        _context.Produtos.Remove(produto);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // ----------------------------------------------------------------
    // HELPER
    // ----------------------------------------------------------------
    private async Task<ProdutoDto?> MapearProdutoDto(int id)
    {
        return await _context.Produtos
            .Include(p => p.Categoria)
            .Where(p => p.IdProduto == id)
            .Select(p => new ProdutoDto
            {
                Id            = p.IdProduto,
                Nome          = p.NomeProduto,
                Categoria     = p.Categoria != null ? p.Categoria.SlugCategoria : "",
                NomeCategoria = p.Categoria != null ? p.Categoria.NomeCategoria  : "",
                Descricao     = p.DescricaoProduto,
                Imagem        = p.ImagemProduto,
                Preco         = p.ValorUnitarioProduto,
                Destaque      = p.Destaque
            })
            .FirstOrDefaultAsync();
    }
}
