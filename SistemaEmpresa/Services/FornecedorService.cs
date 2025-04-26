using SistemaEmpresa.Models;
using SistemaEmpresa.Repositories;
using SistemaEmpresa.Validations;
using System.ComponentModel.DataAnnotations;

namespace SistemaEmpresa.Services
{
    public class FornecedorService
    {
        private readonly FornecedorRepository _fornecedorRepository;
        private readonly CidadeRepository _cidadeRepository;

        public FornecedorService(FornecedorRepository fornecedorRepository, CidadeRepository cidadeRepository)
        {
            _fornecedorRepository = fornecedorRepository;
            _cidadeRepository = cidadeRepository;
        }

        public async Task<IEnumerable<Fornecedor>> GetAllAsync()
        {
            return await _fornecedorRepository.ReadAll();
        }

        public async Task<Fornecedor> GetByIdAsync(long id)
        {
            var fornecedor = await _fornecedorRepository.ReadById(id);
            if (fornecedor == null)
                throw new Exception($"Fornecedor não encontrado com o ID: {id}");
            return fornecedor;
        }

        public async Task<IEnumerable<Fornecedor>> GetByNameAsync(string nome)
        {
            return await _fornecedorRepository.ReadByName(nome);
        }

        public async Task<IEnumerable<Fornecedor>> GetByCNPJAsync(string cnpj)
        {
            var fornecedor = await _fornecedorRepository.ReadByCNPJ(cnpj);
            return fornecedor != null ? new List<Fornecedor> { fornecedor } : Enumerable.Empty<Fornecedor>();
        }

        public async Task<Fornecedor> SaveAsync(Fornecedor fornecedor)
        {
            // Validar campos obrigatórios
            if (string.IsNullOrWhiteSpace(fornecedor.RazaoSocial))
                throw new ValidationException("A razão social é obrigatória");

            // Validar CNPJ (obrigatório para fornecedor)
            if (string.IsNullOrWhiteSpace(fornecedor.CNPJ))
                throw new ValidationException("O CNPJ é obrigatório");

            if (!DocumentoValidator.ValidarCNPJ(fornecedor.CNPJ))
                throw new ValidationException("CNPJ inválido");

            // Validar email se fornecido
            if (!string.IsNullOrWhiteSpace(fornecedor.Email) && !DocumentoValidator.ValidarEmail(fornecedor.Email))
                throw new ValidationException("Email inválido");

            // Validar CEP se fornecido
            if (!string.IsNullOrWhiteSpace(fornecedor.CEP) && !DocumentoValidator.ValidarCEP(fornecedor.CEP))
                throw new ValidationException("CEP inválido");

            // Validar cidade se fornecida
            if (fornecedor.CidadeId.HasValue)
            {
                var cidade = await _cidadeRepository.ReadById(fornecedor.CidadeId.Value);
                if (cidade == null)
                    throw new ValidationException($"Cidade não encontrada com o ID: {fornecedor.CidadeId}");
            }

            if (fornecedor.Id == 0)
            {
                await _fornecedorRepository.Create(fornecedor);
            }
            else
            {
                await _fornecedorRepository.Update(fornecedor.Id, fornecedor);
            }
            return fornecedor;
        }

        public async Task DeleteAsync(long id)
        {
            var fornecedor = await _fornecedorRepository.ReadById(id);
            if (fornecedor == null)
                throw new Exception($"Fornecedor não encontrado com o ID: {id}");
                
            await _fornecedorRepository.Delete(id);
        }
    }
}