using Microsoft.AspNetCore.Mvc;
using SistemaEmpresa.Models;
using SistemaEmpresa.DTOs;
using SistemaEmpresa.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SistemaEmpresa.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class PaisController : ControllerBase
    {
        private readonly PaisService _service;

        public PaisController(PaisService service)
        {
            _service = service;
        }

        /// <summary>
        /// Obtém todos os países cadastrados
        /// </summary>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            Console.WriteLine("Recebida requisição GET em /api/Pais");
            try
            {
                var paises = await _service.GetAll();
                Console.WriteLine($"Retornando {paises.Count} países");
                return Ok(paises);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro em GetAll: {ex.Message}");
                return StatusCode(500, new { mensagem = ex.Message });
            }
        }

        /// <summary>
        /// Obtém um país pelo ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var pais = await _service.GetById(id);
                return Ok(pais);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Cadastra um novo país
        /// </summary>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<PaisDTO>> Create([FromBody] PaisCreateDTO dto)
        {
            // Adicionar logs para debug
            Console.WriteLine($"Recebendo dados: Nome={dto.Nome}, Codigo={dto.Codigo}, Sigla={dto.Sigla}");
            
            if (!ModelState.IsValid)
            {
                // Logar detalhes do erro de validação
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    Console.WriteLine($"Erro de validação: {error.ErrorMessage}");
                }
                return BadRequest(ModelState);
            }

            var paisCriado = await _service.Create(dto);
            if (paisCriado == null)
                return BadRequest(new { message = "Não foi possível criar o país" });
    
            return CreatedAtAction(nameof(Get), new { id = paisCriado.Id }, paisCriado);
        }

        /// <summary>
        /// Atualiza um país existente
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Put(int id, [FromBody] PaisUpdateDTO paisDto)
        {
            try
            {
                // Criar objeto Pais apenas com os dados do DTO + ID da rota
                var pais = new Pais
                {
                    Id = id, // ID vem APENAS da rota, não do corpo
                    Nome = paisDto.Nome,
                    Codigo = paisDto.Codigo ?? string.Empty, // Fornece valor padrão caso seja nulo
                    Sigla = paisDto.Sigla ?? string.Empty // Fornece valor padrão caso seja nulo
                };
                
                var updatedPais = await _service.UpdateAsync(pais);
                return Ok(updatedPais);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        /// <summary>
        /// Remove um país
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("ExcluirForcado/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ExcluirForcado(long id)
        {
            try
            {
                // Verificar se o país existe
                var pais = await _service.GetByIdAsync(id);
                if (pais == null)
                {
                    return NotFound(new { mensagem = $"País com ID {id} não encontrado." });
                }
                
                // Implementar exclusão forçada
                await _service.ExcluirForcado(id);
                
                return Ok(new { mensagem = "País excluído com sucesso (modo forçado)." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = $"Erro ao excluir país: {ex.Message}" });
            }
        }
    }
}