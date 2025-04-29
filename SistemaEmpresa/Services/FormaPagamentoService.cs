using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using SistemaEmpresa.Models;
using SistemaEmpresa.Repositories;
using SistemaEmpresa.DTOs;

namespace SistemaEmpresa.Services
{
    public class FormaPagamentoService
    {
        private readonly FormaPagamentoRepository _repository;

        public FormaPagamentoService(FormaPagamentoRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<FormaPagamentoDTO>> GetAll()
        {
            var formasPagamento = await _repository.GetAll();
            
            return formasPagamento.Select(fp => new FormaPagamentoDTO
            {
                Id = fp.Id,
                Descricao = fp.Descricao
            });
        }

        public async Task<FormaPagamentoDTO> GetById(long id)
        {
            var formaPagamento = await _repository.GetById(id);
            
            if (formaPagamento == null)
                return null;
                
            return new FormaPagamentoDTO
            {
                Id = formaPagamento.Id,
                Descricao = formaPagamento.Descricao
            };
        }

        public async Task<FormaPagamentoDTO> Create(FormaPagamentoCreateDTO dto)
        {
            var formaPagamento = new FormaPagamento
            {
                Descricao = dto.Descricao
            };
            
            var created = await _repository.Create(formaPagamento);
            
            return new FormaPagamentoDTO
            {
                Id = created.Id,
                Descricao = created.Descricao
            };
        }

        public async Task<FormaPagamentoDTO> Update(long id, FormaPagamentoUpdateDTO dto)
        {
            var formaPagamento = new FormaPagamento
            {
                Descricao = dto.Descricao
            };
            
            var updated = await _repository.Update(id, formaPagamento);
            
            if (updated == null)
                return null;
                
            return new FormaPagamentoDTO
            {
                Id = updated.Id,
                Descricao = updated.Descricao
            };
        }

        public async Task<bool> Delete(long id)
        {
            return await _repository.Delete(id);
        }
    }
}