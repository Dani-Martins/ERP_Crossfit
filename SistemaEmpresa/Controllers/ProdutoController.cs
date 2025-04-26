using Microsoft.AspNetCore.Mvc;
using SistemaEmpresa.Models;
using SistemaEmpresa.Services;

namespace SistemaEmpresa.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutoController : ControllerBase
    {
        private readonly ProdutoService _produtoService;

        public ProdutoController(ProdutoService produtoService)
        {
            _produtoService = produtoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Produto>>> GetAll()
        {
            try
            {
                var produtos = await _produtoService.GetAllAsync();
                return Ok(produtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao listar produtos", erro = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Produto>> GetById(long id)
        {
            try
            {
                var produto = await _produtoService.GetByIdAsync(id);
                return Ok(produto);
            }
            catch (Exception ex) when (ex.Message.Contains("não encontrado"))
            {
                return NotFound(new { mensagem = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao buscar produto", erro = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult<Produto>> Create([FromBody] Produto produto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var novoProduto = await _produtoService.SaveAsync(produto);
                return CreatedAtAction(nameof(GetById), new { id = novoProduto.Id }, novoProduto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao criar produto", erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] Produto produto)
        {
            try
            {
                if (id != produto.Id)
                    return BadRequest(new { mensagem = "ID na URL diferente do ID no corpo da requisição" });

                await _produtoService.SaveAsync(produto);
                return NoContent();
            }
            catch (Exception ex) when (ex.Message.Contains("não encontrado"))
            {
                return NotFound(new { mensagem = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao atualizar produto", erro = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                await _produtoService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex) when (ex.Message.Contains("não encontrado"))
            {
                return NotFound(new { mensagem = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao excluir produto", erro = ex.Message });
            }
        }
    }
}