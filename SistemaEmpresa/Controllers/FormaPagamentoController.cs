using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using SistemaEmpresa.Services;
using SistemaEmpresa.DTOs;

namespace SistemaEmpresa.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FormaPagamentoController : ControllerBase
    {
        private readonly FormaPagamentoService _formaPagamentoService;

        public FormaPagamentoController(FormaPagamentoService formaPagamentoService)
        {
            _formaPagamentoService = formaPagamentoService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<FormaPagamentoDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var formasPagamento = await _formaPagamentoService.GetAll();
                return Ok(formasPagamento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(FormaPagamentoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(long id)
        {
            try
            {
                var formaPagamento = await _formaPagamentoService.GetById(id);
                
                if (formaPagamento == null)
                    return NotFound($"Forma de pagamento com ID {id} não encontrada");
                    
                return Ok(formaPagamento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(FormaPagamentoDTO), StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] FormaPagamentoCreateDTO dto)
        {
            try
            {
                var created = await _formaPagamentoService.Create(dto);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(FormaPagamentoDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(long id, [FromBody] FormaPagamentoUpdateDTO dto)
        {
            try
            {
                var updated = await _formaPagamentoService.Update(id, dto);
                
                if (updated == null)
                    return NotFound($"Forma de pagamento com ID {id} não encontrada");
                    
                return Ok(updated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                var success = await _formaPagamentoService.Delete(id);
                
                if (!success)
                    return NotFound($"Forma de pagamento com ID {id} não encontrada");
                    
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }
    }
}