using MySqlConnector;
using SistemaEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace SistemaEmpresa.Repositories
{
    public class FuncionarioRepository
    {
        private readonly MySqlConnection _connection;

        public FuncionarioRepository(MySqlConnection connection)
        {
            _connection = connection;
        }

        public async Task<List<Funcionario>> ReadAll()
        {
            var funcionarios = new List<Funcionario>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM funcionario f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.ativo = 1
                    ORDER BY f.nome", _connection);
                    
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    funcionarios.Add(MapearFuncionario(reader));
                }
                
                return funcionarios;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<Funcionario?> ReadById(long id)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM funcionario f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.id = @id", _connection);
                    
                command.Parameters.AddWithValue("@id", id);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return MapearFuncionario(reader);
                }
                
                return null;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<List<Funcionario>> ReadByName(string nome)
        {
            var funcionarios = new List<Funcionario>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM funcionario f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.nome LIKE @nome AND f.ativo = 1
                    ORDER BY f.nome", _connection);
                    
                command.Parameters.AddWithValue("@nome", $"%{nome}%");
                
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    funcionarios.Add(MapearFuncionario(reader));
                }
                
                return funcionarios;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<List<Funcionario>> ReadByCargo(string cargo)
        {
            var funcionarios = new List<Funcionario>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM funcionario f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.cargo LIKE @cargo AND f.ativo = 1
                    ORDER BY f.nome", _connection);
                    
                command.Parameters.AddWithValue("@cargo", $"%{cargo}%");
                
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    funcionarios.Add(MapearFuncionario(reader));
                }
                
                return funcionarios;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Create(Funcionario funcionario)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    INSERT INTO funcionario (
                        nome, cpf, rg, data_nascimento, telefone, 
                        email, endereco, numero, complemento, bairro, 
                        cep, cidade_id, cargo, salario, data_admissao, 
                        data_demissao, ativo
                    )
                    VALUES (
                        @nome, @cpf, @rg, @dataNascimento, @telefone, 
                        @email, @endereco, @numero, @complemento, @bairro, 
                        @cep, @cidadeId, @cargo, @salario, @dataAdmissao, 
                        @dataDemissao, @ativo
                    );
                    SELECT LAST_INSERT_ID();", _connection);
                
                PreencherParametros(command, funcionario);
                
                var id = Convert.ToInt64(await command.ExecuteScalarAsync());
                funcionario.Id = id;
                
                return id > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Update(long id, Funcionario funcionario)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    UPDATE funcionario
                    SET nome = @nome, 
                        cpf = @cpf, 
                        rg = @rg, 
                        data_nascimento = @dataNascimento, 
                        telefone = @telefone, 
                        email = @email, 
                        endereco = @endereco, 
                        numero = @numero, 
                        complemento = @complemento, 
                        bairro = @bairro, 
                        cep = @cep, 
                        cidade_id = @cidadeId, 
                        cargo = @cargo, 
                        salario = @salario, 
                        data_admissao = @dataAdmissao, 
                        data_demissao = @dataDemissao, 
                        ativo = @ativo
                    WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                PreencherParametros(command, funcionario);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Delete(long id)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(
                    "UPDATE funcionario SET ativo = 0 WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        private void PreencherParametros(MySqlCommand command, Funcionario funcionario)
        {
            command.Parameters.AddWithValue("@nome", funcionario.Nome);
            command.Parameters.AddWithValue("@cpf", funcionario.CPF ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@rg", funcionario.RG ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@dataNascimento", funcionario.DataNascimento.HasValue ? funcionario.DataNascimento : DBNull.Value);
            command.Parameters.AddWithValue("@telefone", funcionario.Telefone ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@email", funcionario.Email ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@endereco", funcionario.Endereco ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@numero", funcionario.Numero ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@complemento", funcionario.Complemento ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@bairro", funcionario.Bairro ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cep", funcionario.CEP ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cidadeId", funcionario.CidadeId.HasValue ? funcionario.CidadeId : DBNull.Value);
            command.Parameters.AddWithValue("@cargo", funcionario.Cargo ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@salario", funcionario.Salario.HasValue ? funcionario.Salario : DBNull.Value);
            command.Parameters.AddWithValue("@dataAdmissao", funcionario.DataAdmissao.HasValue ? funcionario.DataAdmissao : DBNull.Value);
            command.Parameters.AddWithValue("@dataDemissao", funcionario.DataDemissao.HasValue ? funcionario.DataDemissao : DBNull.Value);
            command.Parameters.AddWithValue("@ativo", funcionario.Ativo);
        }

        private Funcionario MapearFuncionario(MySqlDataReader reader)
        {
            var funcionario = new Funcionario
            {
                Id = reader.GetInt64("id"),
                Nome = reader.GetString("nome"),
                CPF = reader.IsDBNull(reader.GetOrdinal("cpf")) ? null : reader.GetString("cpf"),
                RG = reader.IsDBNull(reader.GetOrdinal("rg")) ? null : reader.GetString("rg"),
                DataNascimento = reader.IsDBNull(reader.GetOrdinal("data_nascimento")) ? (DateTime?)null : reader.GetDateTime("data_nascimento"),
                Telefone = reader.IsDBNull(reader.GetOrdinal("telefone")) ? null : reader.GetString("telefone"),
                Email = reader.IsDBNull(reader.GetOrdinal("email")) ? null : reader.GetString("email"),
                Endereco = reader.IsDBNull(reader.GetOrdinal("endereco")) ? null : reader.GetString("endereco"),
                Numero = reader.IsDBNull(reader.GetOrdinal("numero")) ? null : reader.GetString("numero"),
                Complemento = reader.IsDBNull(reader.GetOrdinal("complemento")) ? null : reader.GetString("complemento"),
                Bairro = reader.IsDBNull(reader.GetOrdinal("bairro")) ? null : reader.GetString("bairro"),
                CEP = reader.IsDBNull(reader.GetOrdinal("cep")) ? null : reader.GetString("cep"),
                CidadeId = reader.IsDBNull(reader.GetOrdinal("cidade_id")) ? (long?)null : reader.GetInt64("cidade_id"),
                Cargo = reader.IsDBNull(reader.GetOrdinal("cargo")) ? null : reader.GetString("cargo"),
                DataAdmissao = reader.IsDBNull(reader.GetOrdinal("data_admissao")) ? (DateTime?)null : reader.GetDateTime("data_admissao"),
                DataDemissao = reader.IsDBNull(reader.GetOrdinal("data_demissao")) ? (DateTime?)null : reader.GetDateTime("data_demissao"),
                Ativo = reader.GetBoolean("ativo"),
                Salario = reader.IsDBNull(reader.GetOrdinal("salario")) ? (decimal?)null : reader.GetDecimal("salario")
            };

            // Se tiver cidade, cria o objeto
            if (!reader.IsDBNull(reader.GetOrdinal("cidade_id")))
            {
                var cidade = new Cidade
                {
                    Id = reader.GetInt64("cidade_id"),
                    Nome = reader.IsDBNull(reader.GetOrdinal("cidade_nome")) ? string.Empty : reader.GetString("cidade_nome"),
                    CodigoIBGE = reader.IsDBNull(reader.GetOrdinal("cidade_codigo_ibge")) ? null : reader.GetString("cidade_codigo_ibge"),
                };

                // Verifica se tem estado antes de acessar
                if (!reader.IsDBNull(reader.GetOrdinal("estado_id")))
                {
                    cidade.EstadoId = reader.GetInt64("estado_id");
                    
                    var estado = new Estado
                    {
                        Id = reader.GetInt64("estado_id"),
                        Nome = reader.IsDBNull(reader.GetOrdinal("estado_nome")) ? string.Empty : reader.GetString("estado_nome"),
                        UF = reader.IsDBNull(reader.GetOrdinal("estado_uf")) ? string.Empty : reader.GetString("estado_uf"),
                    };

                    // Verifica se tem país antes de acessar
                    if (!reader.IsDBNull(reader.GetOrdinal("pais_id")))
                    {
                        estado.PaisId = reader.GetInt64("pais_id");
                        
                        estado.Pais = new Pais
                        {
                            Id = reader.GetInt64("pais_id"),
                            Nome = reader.IsDBNull(reader.GetOrdinal("pais_nome")) ? string.Empty : reader.GetString("pais_nome"),
                            Codigo = reader.IsDBNull(reader.GetOrdinal("pais_codigo")) ? null : reader.GetString("pais_codigo"),
                            Sigla = reader.IsDBNull(reader.GetOrdinal("pais_sigla")) ? null : reader.GetString("pais_sigla")
                        };
                    }
                    
                    cidade.Estado = estado;
                }
                
                funcionario.Cidade = cidade;
            }

            return funcionario;
        }
    }
}
