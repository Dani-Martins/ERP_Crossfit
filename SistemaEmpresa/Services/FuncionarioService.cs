using SistemaEmpresa.Models;
using SistemaEmpresa.Repositories;

namespace SistemaEmpresa.Services
{
    public class FuncionarioService
    {
        private readonly FuncionarioRepository _funcionarioRepository;
        private readonly CidadeRepository _cidadeRepository;

        public FuncionarioService(FuncionarioRepository funcionarioRepository, CidadeRepository cidadeRepository)
        {
            _funcionarioRepository = funcionarioRepository;
            _cidadeRepository = cidadeRepository;
        }

        public async Task<IEnumerable<Funcionario>> GetAllAsync()
        {
            return await _funcionarioRepository.ReadAll();
        }

        public async Task<Funcionario> GetByIdAsync(long id)
        {
            var funcionario = await _funcionarioRepository.ReadById(id);
            if (funcionario == null)
                throw new Exception($"Funcionário não encontrado com o ID: {id}");
            return funcionario;
        }

        public async Task<IEnumerable<Funcionario>> GetByNameAsync(string nome)
        {
            return await _funcionarioRepository.ReadByName(nome);
        }

        public async Task<IEnumerable<Funcionario>> GetByCargoAsync(string cargo)
        {
            return await _funcionarioRepository.ReadByCargo(cargo);
        }

        public async Task<Funcionario> SaveAsync(Funcionario funcionario)
        {
            // Validações
            if (string.IsNullOrWhiteSpace(funcionario.Nome))
                throw new Exception("O nome do funcionário é obrigatório");

            // Validar se a cidade existe quando informada
            if (funcionario.CidadeId.HasValue)
            {
                var cidade = await _cidadeRepository.ReadById(funcionario.CidadeId.Value);
                if (cidade == null)
                    throw new Exception($"Cidade não encontrada com o ID: {funcionario.CidadeId}");
            }

            if (funcionario.Id == 0)
            {
                await _funcionarioRepository.Create(funcionario);
            }
            else
            {
                await _funcionarioRepository.Update(funcionario.Id, funcionario);
            }
            return funcionario;
        }

        public async Task DeleteAsync(long id)
        {
            await _funcionarioRepository.Delete(id);
        }
    }
}