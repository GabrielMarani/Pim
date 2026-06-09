using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CafeteriaAPI.Data;

namespace CafeteriaAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CategoriasController : ControllerBase
{
    private readonly AppDbContext _context;

    public CategoriasController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/categorias — público
    [HttpGet]
    public async Task<IActionResult> GetCategorias()
    {
        var categorias = await _context.Categorias
            .OrderBy(c => c.NomeCategoria)
            .Select(c => new
            {
                id   = c.IdCategoria,
                nome = c.NomeCategoria,
                slug = c.SlugCategoria
            })
            .ToListAsync();

        return Ok(categorias);
    }
}
