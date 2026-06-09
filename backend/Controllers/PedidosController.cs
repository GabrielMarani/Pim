using System.Security.Claims;
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
public class PedidosController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<PedidosController> _logger;

    private static readonly HashSet<string> StatusValidos =
        new(StringComparer.OrdinalIgnoreCase) { "pendente", "preparando", "entregue", "cancelado" };

    public PedidosController(AppDbContext context, ILogger<PedidosController> logger)
    {
        _context = context;
        _logger  = logger;
    }

    // ----------------------------------------------------------------
    // GET /api/pedidos
    // Admin: todos os pedidos. Cliente: apenas os próprios.
    // ----------------------------------------------------------------
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<PedidoDto>>> GetPedidos()
    {
        try
        {
            var isAdmin  = User.IsInRole("admin");
            var usuarioId = ObterUsuarioId();

            var query = _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                .AsQueryable();

            if (!isAdmin && usuarioId.HasValue)
                query = query.Where(p => p.IdUsuario == usuarioId);

            var pedidos = await query
                .OrderByDescending(p => p.DataPedido)
                .ToListAsync();

            return Ok(pedidos.Select(MapearPedidoDto).ToList());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar pedidos");
            return StatusCode(500, new { mensagem = "Erro interno ao buscar pedidos." });
        }
    }

    // ----------------------------------------------------------------
    // GET /api/pedidos/{id}
    // ----------------------------------------------------------------
    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<PedidoDto>> GetPedido(int id)
    {
        try
        {
            var pedido = await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                .FirstOrDefaultAsync(p => p.IdPedido == id);

            if (pedido is null)
                return NotFound(new { mensagem = $"Pedido #{id} não encontrado." });

            // Cliente só pode ver o próprio pedido
            if (!User.IsInRole("admin"))
            {
                var usuarioId = ObterUsuarioId();
                if (pedido.IdUsuario != usuarioId)
                    return Forbid();
            }

            return Ok(MapearPedidoDto(pedido));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar pedido {Id}", id);
            return StatusCode(500, new { mensagem = "Erro interno ao buscar pedido." });
        }
    }

    // ----------------------------------------------------------------
    // POST /api/pedidos — requer login
    // ----------------------------------------------------------------
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<PedidoDto>> CriarPedido([FromBody] CriarPedidoDto dto)
    {
        try
        {
            if (dto.Itens is null || dto.Itens.Count == 0)
                return BadRequest(new { mensagem = "O pedido deve conter pelo menos um item." });

            if (dto.Total <= 0)
                return BadRequest(new { mensagem = "O total do pedido deve ser maior que zero." });

            var produtoIds = dto.Itens.Select(i => i.ProdutoId).Distinct().ToList();
            var produtosExistentes = await _context.Produtos
                .Where(p => produtoIds.Contains(p.IdProduto))
                .ToDictionaryAsync(p => p.IdProduto);

            var naoEncontrados = produtoIds.Where(id => !produtosExistentes.ContainsKey(id)).ToList();
            if (naoEncontrados.Any())
                return BadRequest(new { mensagem = $"Produtos não encontrados: {string.Join(", ", naoEncontrados)}" });

            var pedido = new Pedido
            {
                TotalPedido  = dto.Total,
                DataPedido   = DateTime.Now,
                StatusPedido = "pendente",
                IdUsuario    = ObterUsuarioId()
            };

            foreach (var itemDto in dto.Itens)
            {
                if (itemDto.Quantidade <= 0)
                    return BadRequest(new { mensagem = "A quantidade deve ser maior que zero." });

                pedido.Itens.Add(new ItemPedido
                {
                    IdProduto     = itemDto.ProdutoId,
                    Quantidade    = itemDto.Quantidade,
                    ValorUnitario = itemDto.ValorUnitario > 0
                        ? itemDto.ValorUnitario
                        : produtosExistentes[itemDto.ProdutoId].ValorUnitarioProduto
                });
            }

            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            var pedidoCriado = await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                .FirstAsync(p => p.IdPedido == pedido.IdPedido);

            _logger.LogInformation("Pedido #{Id} criado. Total: {Total:C}", pedidoCriado.IdPedido, pedidoCriado.TotalPedido);
            return CreatedAtAction(nameof(GetPedido), new { id = pedidoCriado.IdPedido }, MapearPedidoDto(pedidoCriado));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar pedido");
            return StatusCode(500, new { mensagem = "Erro interno ao criar pedido." });
        }
    }

    // ----------------------------------------------------------------
    // PUT /api/pedidos/{id}/status
    // Admin: qualquer status. Cliente: apenas "entregue" (confirmar recebimento).
    // ----------------------------------------------------------------
    [HttpPut("{id:int}/status")]
    [Authorize]
    public async Task<ActionResult<PedidoDto>> AtualizarStatus(int id, [FromBody] AtualizarStatusDto dto)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(dto.Status) || !StatusValidos.Contains(dto.Status))
                return BadRequest(new { mensagem = $"Status inválido. Valores aceitos: {string.Join(", ", StatusValidos)}" });

            var pedido = await _context.Pedidos
                .Include(p => p.Usuario)
                .Include(p => p.Itens)
                    .ThenInclude(i => i.Produto)
                .FirstOrDefaultAsync(p => p.IdPedido == id);

            if (pedido is null)
                return NotFound(new { mensagem = $"Pedido #{id} não encontrado." });

            // Cliente: só pode confirmar entrega do próprio pedido
            if (!User.IsInRole("admin"))
            {
                var usuarioId = ObterUsuarioId();
                if (pedido.IdUsuario != usuarioId)
                    return Forbid();

                if (dto.Status.ToLower() != "entregue")
                    return BadRequest(new { mensagem = "Clientes só podem confirmar a entrega do pedido." });
            }

            pedido.StatusPedido = dto.Status.ToLower();
            await _context.SaveChangesAsync();

            return Ok(MapearPedidoDto(pedido));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar status do pedido {Id}", id);
            return StatusCode(500, new { mensagem = "Erro interno ao atualizar status." });
        }
    }

    // ----------------------------------------------------------------
    // DELETE /api/pedidos/{id} — cancela pedido pendente
    // ----------------------------------------------------------------
    [HttpDelete("{id:int}")]
    [Authorize]
    public async Task<IActionResult> DeletarPedido(int id)
    {
        try
        {
            var pedido = await _context.Pedidos.FindAsync(id);
            if (pedido is null)
                return NotFound(new { mensagem = $"Pedido #{id} não encontrado." });

            if (!User.IsInRole("admin"))
            {
                var usuarioId = ObterUsuarioId();
                if (pedido.IdUsuario != usuarioId)
                    return Forbid();
            }

            if (pedido.StatusPedido != "pendente")
                return BadRequest(new { mensagem = "Apenas pedidos 'pendente' podem ser cancelados." });

            _context.Pedidos.Remove(pedido);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cancelar pedido {Id}", id);
            return StatusCode(500, new { mensagem = "Erro interno ao cancelar pedido." });
        }
    }

    // ----------------------------------------------------------------
    // HELPER — ID do usuário logado (claim NameIdentifier)
    // ----------------------------------------------------------------
    private int? ObterUsuarioId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(claim, out var id) ? id : null;
    }

    private static PedidoDto MapearPedidoDto(Pedido pedido) => new()
    {
        Id          = pedido.IdPedido,
        Numero      = $"#{pedido.IdPedido:D5}",
        Data        = pedido.DataPedido,
        Total       = pedido.TotalPedido,
        Status      = pedido.StatusPedido,
        UsuarioId   = pedido.IdUsuario,
        NomeCliente = pedido.Usuario?.Nome,
        Itens       = pedido.Itens.Select(i => new ItemPedidoDto
        {
            Id            = i.IdItem,
            ProdutoId     = i.IdProduto,
            NomeProduto   = i.Produto?.NomeProduto ?? "Produto removido",
            ImagemProduto = i.Produto?.ImagemProduto,
            Quantidade    = i.Quantidade,
            ValorUnitario = i.ValorUnitario
        }).ToList()
    };
}
