using SistemaEmpresa.Models;
using SistemaEmpresa.Repositories;
using SistemaEmpresa.Validations;
using System.ComponentModel.DataAnnotations;

namespace SistemaEmpresa.Services
{
    public class ClienteService
    {
        private readonly ClienteRepository _clienteRepository;
        private readonly CidadeRepository _cidadeRepository;

        public ClienteService(ClienteRepository clienteRepository, CidadeRepository cidadeRepository)
        {
            _clienteRepository = clienteRepository;
            _cidadeRepository = cidadeRepository;
        }

        public async Task<IEnumerable<Cliente>> GetAllAsync()
        {
            return await _clienteRepository.GetAll();
        }

        public async Task<Cliente> GetByIdAsync(long id)
        {
            var cliente = await _clienteRepository.ReadById(id);
            if (cliente == null)
                throw new Exception($"Cliente não encontrado com o ID: {id}");
            return cliente;
        }

        public async Task<IEnumerable<Cliente>> GetByNameAsync(string nome)
        {
            return await _clienteRepository.ReadByName(nome);
        }

        public async Task<Cliente> SaveAsync(Cliente cliente)
        {
            // Validar campos obrigatórios
            if (string.IsNullOrWhiteSpace(cliente.Nome))
                throw new ValidationException("O nome é obrigatório");

            // Validar CPF se fornecido
            if (!string.IsNullOrWhiteSpace(cliente.CPF) && !DocumentoValidator.ValidarCPF(cliente.CPF))
                throw new ValidationException("CPF inválido");

            // Validar CNPJ se fornecido
            if (!string.IsNullOrWhiteSpace(cliente.CNPJ) && !DocumentoValidator.ValidarCNPJ(cliente.CNPJ))
                throw new ValidationException("CNPJ inválido");

            // Validar email se fornecido
            if (!string.IsNullOrWhiteSpace(cliente.Email) && !DocumentoValidator.ValidarEmail(cliente.Email))
                throw new ValidationException("Email inválido");

            // Validar CEP se fornecido
            if (!string.IsNullOrWhiteSpace(cliente.CEP) && !DocumentoValidator.ValidarCEP(cliente.CEP))
                throw new ValidationException("CEP inválido");

            // Validar cidade se fornecida
            if (cliente.CidadeId.HasValue)
            {
                var cidade = await _cidadeRepository.ReadById(cliente.CidadeId.Value);
                if (cidade == null)
                    throw new ValidationException($"Cidade não encontrada com o ID: {cliente.CidadeId}");
            }

            if (cliente.Id == 0)
            {
                await _clienteRepository.Create(cliente);
            }
            else
            {
                await _clienteRepository.Update(cliente.Id, cliente);
            }
            return cliente;
        }

        public async Task DeleteAsync(long id)
        {
            var cliente = await _clienteRepository.ReadById(id);
            if (cliente == null)
                throw new Exception($"Cliente não encontrado com o ID: {id}");

            await _clienteRepository.Delete(id);
        }
    }
}