using SistemaEmpresa.Models;
using SistemaEmpresa.DTOs;
using SistemaEmpresa.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace SistemaEmpresa.Services
{
    public class EstadoService
    {
        private readonly EstadoRepository _repository;
        private readonly PaisRepository _paisRepository;

        public EstadoService(EstadoRepository repository, PaisRepository paisRepository)
        {
            _repository = repository;
            _paisRepository = paisRepository;
        }

        public async Task<EstadoDTO> Create(EstadoCreateDTO estadoDTO)
        {
            // Converte DTO para modelo
            var estadoModel = new Estado
            {
                Nome = estadoDTO.Nome,
                PaisId = estadoDTO.PaisId,
                UF = estadoDTO.UF 
            };
            
            // Cria o estado
            bool sucesso = await _repository.Create(estadoModel);
            
            if (sucesso)
            {
                // Se criado com sucesso, retornamos o DTO recém-criado
                var resultado = await _repository.ReadById(estadoModel.Id);
                if (resultado == null)
                {
                    throw new Exception("Estado criado, mas não foi possível recuperá-lo");
                }
                return resultado;
            }
            
            throw new Exception("Não foi possível criar o estado");
        }

        public async Task<bool> Delete(long id)
        {
            return await _repository.Delete(id);
        }

        // Método principal para obter todos os estados
        public async Task<List<EstadoDTO>> GetAll()
        {
            try
            {
                // Buscar estados com os dados do país incluídos
                var estados = await _repository.ReadAllWithPais();
                
                // Mapear para DTOs incluindo o nome do país
                var estadosDTO = estados.Select(e => new EstadoDTO
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    UF = e.UF ?? string.Empty, // Garantir que UF não seja null
                    PaisId = e.PaisId,
                    PaisNome = e.Pais?.Nome ?? string.Empty // Garantir que PaisNome não seja null
                }).ToList();
                
                return estadosDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar estados: {ex.Message}");
                throw new Exception($"Erro ao buscar estados: {ex.Message}");
            }
        }

        public async Task<List<EstadoDTO>> GetAllSeguro()
        {
            try
            {
                // Usar o repositório em vez de acessar o contexto diretamente
                var estados = await _repository.ReadAllWithPais();
                
                // Mapear manualmente para garantir tratamento de valores nulos
                var estadosDTO = estados.Select(e => new EstadoDTO
                {
                    Id = e.Id,
                    Nome = e.Nome ?? string.Empty,
                    UF = e.UF ?? string.Empty,
                    PaisId = e.PaisId,
                    PaisNome = e.Pais?.Nome ?? string.Empty,
                    // Adicione outros campos se necessário
                }).ToList();
                
                return estadosDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar estados: {ex.Message}");
                throw new Exception($"Erro ao buscar estados: {ex.Message}", ex);
            }
        }

        // Método principal para obter um estado por ID
        public async Task<EstadoDTO> GetById(long id)
        {
            try 
            {
                var estado = await _repository.ReadById(id);
                
                if (estado == null)
                    return null;
                    
                // Garantir que não haja propriedades nulas
                estado.UF ??= string.Empty;
                estado.PaisNome = estado.PaisNome ?? string.Empty;
                
                return estado;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar estado por ID {id}: {ex.Message}");
                throw new Exception($"Erro ao buscar estado por ID: {ex.Message}");
            }
        }

        // Método principal para obter estados por país
        public async Task<IEnumerable<EstadoDTO>> GetByPaisId(long paisId)
        {
            try
            {
                // Verificar se o país existe - com conversão para int
                var pais = await _paisRepository.ReadById((int)paisId);
                if (pais == null)
                {
                    throw new Exception($"País com ID {paisId} não encontrado");
                }

                // Buscar estados do país com país incluído
                var estados = await _repository.ReadByPaisIdWithPais(paisId);
                
                // Converter para DTOs com tratamento para nulos
                var estadosDTO = estados.Select(e => new EstadoDTO
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    UF = e.UF ?? string.Empty, 
                    PaisId = e.PaisId,
                    PaisNome = e.Pais?.Nome ?? string.Empty
                }).ToList();
                
                return estadosDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar estados por país ID {paisId}: {ex.Message}");
                throw new Exception($"Erro ao buscar estados por país: {ex.Message}");
            }
        }

        public async Task<EstadoDTO> Update(long id, EstadoUpdateDTO dto)
        {
            // Verifica se o estado existe
            var estadoExistente = await _repository.ReadById(id);
            if (estadoExistente == null)
                throw new Exception($"Estado com ID {id} não encontrado");

            // Cria um modelo Estado para atualização
            var estadoModel = new Estado
            {
                Id = (int)id,
                Nome = dto.Nome,
                UF = dto.UF,
                PaisId = dto.PaisId
            };

            // Salva as alterações
            bool sucesso = await _repository.Update(id, estadoModel);
            
            if (!sucesso)
                throw new Exception("Falha ao atualizar estado");
                
            // Retorna o objeto atualizado
            return await GetById(id);
        }
        
        // Métodos antigos mantidos temporariamente para compatibilidade, redirecionando para os novos
        public async Task<List<EstadoDTO>> ReadAll() => await GetAll();
        public async Task<EstadoDTO> ReadById(long id) => await GetById(id);
        public async Task<List<EstadoDTO>> ReadByPaisId(long paisId) => 
            (await GetByPaisId(paisId)).ToList();
    }
}