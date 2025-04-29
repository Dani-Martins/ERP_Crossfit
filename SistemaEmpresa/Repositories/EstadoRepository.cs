using SistemaEmpresa.Data;
using SistemaEmpresa.DTOs;
using SistemaEmpresa.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using Dapper;

namespace SistemaEmpresa.Repositories
{
    public class EstadoRepository
    {
        private readonly ApplicationDbContext _context;

        public EstadoRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<Estado>> GetAllAsync()
        {
            return await _context.Estados.ToListAsync();
        }

        public async Task<List<EstadoDTO>> ReadAll()
        {
            try
            {
                // Usar Entity Framework com Include para trazer os dados relacionados
                var estados = await _context.Estados
                    .Include(e => e.Pais)
                    .OrderBy(e => e.Nome)
                    .Select(e => new EstadoDTO
                    {
                        Id = e.Id,
                        Nome = e.Nome,
                        UF = e.UF,
                        PaisId = e.PaisId,
                        PaisNome = e.Pais != null ? e.Pais.Nome : string.Empty
                    })
                    .ToListAsync();
                    
                return estados;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar estados: {ex.Message}");
                throw;
            }
        }

        public async Task<EstadoDTO?> ReadById(long id)
        {
            try
            {
                await _context.Database.OpenConnectionAsync();
                
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = @"
                    SELECT e.id, e.nome, e.uf, e.pais_id, 
                           p.id as pais_id, p.nome as pais_nome, p.sigla as pais_sigla, p.codigo as pais_codigo
                    FROM estado e
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE e.id = @id";
                
                var parameter = command.CreateParameter();
                parameter.ParameterName = "@id";
                parameter.Value = id;
                command.Parameters.Add(parameter);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return MapearEstadoDTO(reader);
                }
                
                return null;
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        public async Task<bool> Create(Estado estado)
        {
            try
            {
                await _context.Database.OpenConnectionAsync();

                // Verificar se o país existe
                using var checkCommand = _context.Database.GetDbConnection().CreateCommand();
                checkCommand.CommandText = "SELECT COUNT(*) FROM pais WHERE id = @paisId";
                
                var checkParameter = checkCommand.CreateParameter();
                checkParameter.ParameterName = "@paisId";
                checkParameter.Value = estado.PaisId;
                checkCommand.Parameters.Add(checkParameter);
                
                var paisExists = Convert.ToInt32(await checkCommand.ExecuteScalarAsync()) > 0;

                if (!paisExists)
                    throw new InvalidOperationException($"País com ID {estado.PaisId} não encontrado");

                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = @"
                    INSERT INTO estado (nome, uf, pais_id) 
                    VALUES (@nome, @uf, @paisId);
                    SELECT LAST_INSERT_ID();";
                
                var nomeParameter = command.CreateParameter();
                nomeParameter.ParameterName = "@nome";
                nomeParameter.Value = estado.Nome;
                command.Parameters.Add(nomeParameter);
                
                var ufParameter = command.CreateParameter();
                ufParameter.ParameterName = "@uf";
                ufParameter.Value = estado.UF;
                command.Parameters.Add(ufParameter);
                
                var paisIdParameter = command.CreateParameter();
                paisIdParameter.ParameterName = "@paisId";
                paisIdParameter.Value = estado.PaisId;
                command.Parameters.Add(paisIdParameter);
                
                estado.Id = (int)Convert.ToInt64(await command.ExecuteScalarAsync());
                return estado.Id > 0;
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        public async Task<bool> Update(long id, Estado estado)
        {
            try
            {
                await _context.Database.OpenConnectionAsync();

                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = @"
                    UPDATE estado 
                    SET nome = @nome, uf = @uf, pais_id = @paisId
                    WHERE id = @id";
                
                var idParameter = command.CreateParameter();
                idParameter.ParameterName = "@id";
                idParameter.Value = id;
                command.Parameters.Add(idParameter);
                
                var nomeParameter = command.CreateParameter();
                nomeParameter.ParameterName = "@nome";
                nomeParameter.Value = estado.Nome;
                command.Parameters.Add(nomeParameter);
                
                var ufParameter = command.CreateParameter();
                ufParameter.ParameterName = "@uf";
                ufParameter.Value = estado.UF;
                command.Parameters.Add(ufParameter);
                
                var paisIdParameter = command.CreateParameter();
                paisIdParameter.ParameterName = "@paisId";
                paisIdParameter.Value = estado.PaisId;
                command.Parameters.Add(paisIdParameter);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        public async Task<bool> Delete(long id)
        {
            try
            {
                await _context.Database.OpenConnectionAsync();
                
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = "DELETE FROM estado WHERE id = @id";
                
                var parameter = command.CreateParameter();
                parameter.ParameterName = "@id";
                parameter.Value = id;
                command.Parameters.Add(parameter);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        public async Task<List<EstadoDTO>> ReadByPaisId(long paisId) // Alterado de int para long
        {
            var estados = new List<EstadoDTO>();
            
            try
            {
                await _context.Database.OpenConnectionAsync();
                
                using var command = _context.Database.GetDbConnection().CreateCommand();
                command.CommandText = @"
                    SELECT e.id, e.nome, e.uf, e.pais_id, 
                           p.id as pais_id, p.nome as pais_nome, p.sigla as pais_sigla, p.codigo as pais_codigo
                    FROM estado e
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE e.pais_id = @paisId
                    ORDER BY e.nome";
                
                var parameter = command.CreateParameter();
                parameter.ParameterName = "@paisId";
                parameter.Value = paisId;
                command.Parameters.Add(parameter);
                
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    estados.Add(MapearEstadoDTO(reader));
                }
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
            
            return estados;
        }

        public async Task<List<Estado>> ReadByPaisIdWithPais(long paisId)
        {
            try
            {
                return await _context.Estados
                    .Include(e => e.Pais)
                    .Where(e => e.PaisId == paisId)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar estados por país: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Verifica se um país com o ID informado existe
        /// </summary>
        /// <param name="paisId">ID do país</param>
        /// <returns>True se o país existir, False caso contrário</returns>
        public async Task<bool> PaisExists(long paisId)
        {
            // Implemente de acordo com sua fonte de dados
            // Por exemplo, se estiver usando Entity Framework:
            // return await _context.Paises.AnyAsync(p => p.Id == paisId);
            
            // Substitua esta implementação temporária:
            return await Task.FromResult(true);
        }

        public async Task<List<Estado>> ReadAllWithPaisDapper()
        {
            try
            {
                var connection = _context.Database.GetDbConnection();
                await connection.OpenAsync();
                
                string sql = @"
                    SELECT e.id, e.nome, e.uf, e.pais_id as PaisId,
                           p.nome as PaisNome, p.sigla as PaisSigla, p.codigo_telefonico as Codigo
                    FROM estado e
                    LEFT JOIN pais p ON e.pais_id = p.id
                    ORDER BY e.nome";
                
                var estados = await connection.QueryAsync<Estado, Pais, Estado>(
                    sql,
                    (estado, pais) => 
                    {
                        // Garantir que o UF não seja nulo
                        estado.UF = estado.UF ?? string.Empty;
                        
                        if (pais != null)
                        {
                            // Garantir que as propriedades do país não sejam nulas
                            pais.Nome = pais.Nome ?? string.Empty;
                            pais.Sigla = pais.Sigla ?? string.Empty;
                            pais.Codigo = pais.Codigo ?? string.Empty;
                            
                            estado.Pais = pais;
                        }
                        
                        return estado;
                    },
                    splitOn: "PaisNome"
                );
                return estados.ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO ao buscar estados: {ex.Message}");
                throw new Exception($"Erro ao buscar estados: {ex.Message}");
            }
            finally
            {
                if (_context.Database.GetDbConnection().State == ConnectionState.Open)
                    await _context.Database.CloseConnectionAsync();
            }
        }

        public async Task<IEnumerable<Estado>> ReadAllWithPais()
        {
            try
            {
                // Usar SQL direto para evitar problemas com o EF Core
                var connection = _context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                    await connection.OpenAsync();
                    
                string sql = @"
                    SELECT e.id, e.nome, e.uf, e.pais_id,
                           p.id as PaisId, p.nome as PaisNome, p.sigla as PaisSigla, p.codigo as PaisCodigo
                    FROM estado e
                    LEFT JOIN pais p ON e.pais_id = p.id
                    ORDER BY e.nome";
                    
                var resultados = await connection.QueryAsync<Estado, Pais, Estado>(sql,
                    (estado, pais) => {
                        if (pais != null)
                        {
                            estado.Pais = pais;
                            estado.PaisNome = pais.Nome;
                        }
                        return estado;
                    },
                    splitOn: "PaisId");
                    
                return resultados;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao buscar estados: {ex.Message}");
                throw new Exception($"Erro ao buscar estados: {ex.Message}");
            }
        }

        public async Task<IEnumerable<Estado>> ReadAllWithRawData()
        {
            try
            {
                await _context.Database.OpenConnectionAsync();
                
                var connection = _context.Database.GetDbConnection();
                
                string sql = @"
                    SELECT e.id, e.nome, e.uf, e.pais_id as PaisId,
                           p.nome as PaisNome, p.sigla as PaisSigla, p.codigo as PaisCodigo
                    FROM estado e
                    LEFT JOIN pais p ON e.pais_id = p.id
                    ORDER BY e.nome";
                
                var estados = await connection.QueryAsync<Estado, Pais, Estado>(
                    sql,
                    (estado, pais) => 
                    {
                        // Tratamento para campos possivelmente nulos
                        estado.UF = estado.UF ?? string.Empty;
                        
                        if (pais != null)
                        {
                            pais.Nome = pais.Nome ?? string.Empty;
                            pais.Sigla = pais.Sigla ?? string.Empty;
                            pais.Codigo = pais.Codigo ?? string.Empty;
                            
                            estado.Pais = pais;
                        }
                        
                        return estado;
                    },
                    splitOn: "PaisNome"
                );
                
                return estados;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERRO ao buscar estados: {ex.Message}");
                throw new Exception($"Erro ao buscar estados: {ex.Message}", ex);
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        private EstadoDTO MapearEstadoDTO(DbDataReader reader)
        {
            var estadoDto = new EstadoDTO
            {
                Id = reader.GetInt64(reader.GetOrdinal("id")),
                Nome = reader.IsDBNull(reader.GetOrdinal("nome")) ? string.Empty : reader.GetString(reader.GetOrdinal("nome")),
                UF = reader.IsDBNull(reader.GetOrdinal("uf")) ? string.Empty : reader.GetString(reader.GetOrdinal("uf")),
                PaisId = reader.IsDBNull(reader.GetOrdinal("pais_id")) ? 0 : reader.GetInt64(reader.GetOrdinal("pais_id")),
                PaisNome = reader.IsDBNull(reader.GetOrdinal("pais_nome")) ? string.Empty : reader.GetString(reader.GetOrdinal("pais_nome"))
            };

            return estadoDto;
        }
    }
}
