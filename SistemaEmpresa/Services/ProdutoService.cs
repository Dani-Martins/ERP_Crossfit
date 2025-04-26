using SistemaEmpresa.Models;
using SistemaEmpresa.Repositories;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System.Linq;

namespace SistemaEmpresa.Services
{
    public class ProdutoService
    {
        private readonly ProdutoRepository _produtoRepository;

        public ProdutoService(ProdutoRepository produtoRepository)
        {
            _produtoRepository = produtoRepository;
        }

        public async Task<IEnumerable<Produto>> GetAllAsync()
        {
            return await _produtoRepository.ReadAll();
        }

        public async Task<Produto> GetByIdAsync(long id)
        {
            var produto = await _produtoRepository.ReadById(id);
            if (produto == null)
                throw new Exception($"Produto não encontrado com o ID: {id}");
            return produto;
        }

        public async Task<IEnumerable<Produto>> GetByNameAsync(string nome)
        {
            return await _produtoRepository.ReadByName(nome);
        }

        public async Task<Produto> SaveAsync(Produto produto)
        {
            // Validações
            if (string.IsNullOrWhiteSpace(produto.Nome))
                throw new Exception("O nome do produto é obrigatório");

            if (produto.Preco <= 0)
                throw new Exception("O preço do produto deve ser maior que zero");

            if (produto.EstoqueMinimo < 0)
                throw new ValidationException("O estoque mínimo não pode ser negativo");

            if (produto.Id == 0)
            {
                await _produtoRepository.Create(produto);
            }
            else
            {
                await _produtoRepository.Update(produto.Id, produto);
            }
            return produto;
        }

        public async Task DeleteAsync(long id)
        {
            var produto = await _produtoRepository.ReadById(id);
            if (produto == null)
                throw new Exception($"Produto não encontrado com o ID: {id}");

            await _produtoRepository.Delete(id);
        }
    }
}