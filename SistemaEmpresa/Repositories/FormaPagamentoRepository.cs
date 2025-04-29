using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SistemaEmpresa.Models;
using SistemaEmpresa.Data;

namespace SistemaEmpresa.Repositories
{
    public class FormaPagamentoRepository
    {
        private readonly ApplicationDbContext _context;

        public FormaPagamentoRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FormaPagamento>> GetAll()
        {
            return await _context.FormaPagamento
                .OrderBy(fp => fp.Descricao)
                .ToListAsync();
        }

        // Método renomeado de GetById para ReadById para manter consistência
        public async Task<FormaPagamento> ReadById(long id)
        {
            return await _context.FormaPagamento
                .FirstOrDefaultAsync(fp => fp.Id == id);
        }

        // Manter o GetById como alias para compatibilidade
        public async Task<FormaPagamento> GetById(long id)
        {
            return await ReadById(id);
        }

        public async Task<FormaPagamento> Create(FormaPagamento formaPagamento)
        {
            _context.FormaPagamento.Add(formaPagamento);
            await _context.SaveChangesAsync();
            
            return formaPagamento;
        }

        public async Task<FormaPagamento> Update(long id, FormaPagamento formaPagamento)
        {
            var existing = await _context.FormaPagamento.FindAsync(id);
            
            if (existing == null)
                return null;
                
            existing.Descricao = formaPagamento.Descricao;
                
            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> Delete(long id)
        {
            var formaPagamento = await _context.FormaPagamento.FindAsync(id);
            
            if (formaPagamento == null)
                return false;
                
            _context.FormaPagamento.Remove(formaPagamento);
            await _context.SaveChangesAsync();
            return true;
        }

        // Adicione este método à classe FormaPagamentoRepository
        public async Task<FormaPagamento> GetByDescricao(string descricao)
        {
            return await _context.FormaPagamento
                .FirstOrDefaultAsync(fp => fp.Descricao.ToLower() == descricao.ToLower());
        }
    }
}
