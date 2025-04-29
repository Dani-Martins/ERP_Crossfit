using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using SistemaEmpresa.DTOs;
using SistemaEmpresa.Models;
using SistemaEmpresa.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SistemaEmpresa.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public class ClienteController : ControllerBase
    {
        private readonly ClienteService _clienteService;

        public ClienteController(ClienteService clienteService)
        {
            _clienteService = clienteService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Cliente>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetAll()
        {
            try
            {
                var clientes = await _clienteService.GetAllAsync();
                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao listar clientes", erro = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Cliente), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Cliente>> GetById(long id)
        {
            try
            {
                var cliente = await _clienteService.GetByIdAsync(id);
                return Ok(cliente);
            }
            catch (Exception ex) when (ex.Message.Contains("não encontrado"))
            {
                return NotFound(new { mensagem = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao buscar cliente", erro = ex.Message });
            }
        }

        [HttpGet("nome/{nome}")]
        [ProducesResponseType(typeof(IEnumerable<Cliente>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetByName(string nome)
        {
            try
            {
                var clientes = await _clienteService.GetByNameAsync(nome);
                return Ok(clientes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao buscar clientes por nome", erro = ex.Message });
            }
        }

        [HttpPost]
        [ProducesResponseType(typeof(Cliente), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Cliente>> Create([FromBody] ClienteCreateDTO clienteDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var cliente = new Cliente
                {
                    Nome = clienteDTO.Nome,
                    CPF = clienteDTO.CPF ?? string.Empty,
                    CNPJ = clienteDTO.CNPJ ?? string.Empty,
                    Email = clienteDTO.Email ?? string.Empty,
                    Telefone = clienteDTO.Telefone ?? string.Empty,
                    Endereco = clienteDTO.Endereco ?? string.Empty,
                    Numero = clienteDTO.Numero,
                    Complemento = clienteDTO.Complemento ?? string.Empty,
                    Bairro = clienteDTO.Bairro ?? string.Empty,
                    CEP = clienteDTO.CEP ?? string.Empty,
                    CidadeId = clienteDTO.CidadeId,
                    Ativo = clienteDTO.Ativo
                };

                var novoCliente = await _clienteService.SaveAsync(cliente);
                return CreatedAtAction(nameof(GetById), new { id = novoCliente.Id }, novoCliente);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao criar cliente", erro = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Cliente), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(long id, [FromBody] ClienteUpdateDTO clienteDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var clienteExistente = await _clienteService.GetByIdAsync(id);
                
                clienteExistente.Nome = clienteDTO.Nome;
                clienteExistente.CPF = clienteDTO.CPF ?? string.Empty;
                clienteExistente.CNPJ = clienteDTO.CNPJ ?? string.Empty;
                clienteExistente.Email = clienteDTO.Email ?? string.Empty;
                clienteExistente.Telefone = clienteDTO.Telefone ?? string.Empty;
                clienteExistente.Endereco = clienteDTO.Endereco ?? string.Empty;
                clienteExistente.Numero = clienteDTO.Numero;
                clienteExistente.Complemento = clienteDTO.Complemento ?? string.Empty;
                clienteExistente.Bairro = clienteDTO.Bairro ?? string.Empty;
                clienteExistente.CEP = clienteDTO.CEP ?? string.Empty;
                clienteExistente.CidadeId = clienteDTO.CidadeId;
                clienteExistente.Ativo = clienteDTO.Ativo;

                await _clienteService.SaveAsync(clienteExistente);
                return NoContent();
            }
            catch (Exception ex) when (ex.Message.Contains("não encontrado"))
            {
                return NotFound(new { mensagem = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao atualizar cliente", erro = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(long id)
        {
            try
            {
                await _clienteService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex) when (ex.Message.Contains("não encontrado"))
            {
                return NotFound(new { mensagem = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = "Erro ao excluir cliente", erro = ex.Message });
            }
        }
    }
}