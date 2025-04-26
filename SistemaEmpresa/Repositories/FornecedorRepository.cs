using MySqlConnector;
using SistemaEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace SistemaEmpresa.Repositories
{
    public class FornecedorRepository
    {
        private readonly MySqlConnection _connection;

        public FornecedorRepository(MySqlConnection connection)
        {
            _connection = connection;
        }

        public async Task<List<Fornecedor>> ReadAll()
        {
            var fornecedores = new List<Fornecedor>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM fornecedores f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.ativo = 1
                    ORDER BY f.razao_social", _connection);
                    
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    fornecedores.Add(MapearFornecedor(reader));
                }
                
                return fornecedores;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<Fornecedor?> ReadById(long id)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM fornecedores f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.id = @id", _connection);
                    
                command.Parameters.AddWithValue("@id", id);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return MapearFornecedor(reader);
                }
                
                return null;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<List<Fornecedor>> ReadByRazaoSocial(string razaoSocial)
        {
            var fornecedores = new List<Fornecedor>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM fornecedores f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.razao_social LIKE @razaoSocial AND f.ativo = 1
                    ORDER BY f.razao_social", _connection);
                    
                command.Parameters.AddWithValue("@razaoSocial", $"%{razaoSocial}%");
                
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    fornecedores.Add(MapearFornecedor(reader));
                }
                
                return fornecedores;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<Fornecedor?> ReadByCNPJ(string cnpj)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT f.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM fornecedores f
                    LEFT JOIN cidade cid ON f.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE f.cnpj = @cnpj AND f.ativo = 1", _connection);
                    
                command.Parameters.AddWithValue("@cnpj", cnpj);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return MapearFornecedor(reader);
                }
                
                return null;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Create(Fornecedor fornecedor)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    INSERT INTO fornecedores (
                        razao_social, nome_fantasia, cnpj, email, telefone, 
                        endereco, numero, complemento, bairro, cep, 
                        cidade_id, ativo
                    )
                    VALUES (
                        @razaoSocial, @nomeFantasia, @cnpj, @email, @telefone, 
                        @endereco, @numero, @complemento, @bairro, @cep, 
                        @cidadeId, @ativo
                    );
                    SELECT LAST_INSERT_ID();", _connection);
                
                PreencherParametros(command, fornecedor);
                
                var id = Convert.ToInt64(await command.ExecuteScalarAsync());
                fornecedor.Id = id;
                
                return id > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Update(long id, Fornecedor fornecedor)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    UPDATE fornecedores
                    SET razao_social = @razaoSocial, 
                        nome_fantasia = @nomeFantasia, 
                        cnpj = @cnpj, 
                        email = @email, 
                        telefone = @telefone, 
                        endereco = @endereco, 
                        numero = @numero, 
                        complemento = @complemento, 
                        bairro = @bairro, 
                        cep = @cep, 
                        cidade_id = @cidadeId, 
                        ativo = @ativo
                    WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                PreencherParametros(command, fornecedor);
                
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
                    "UPDATE fornecedores SET ativo = 0 WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<IEnumerable<Fornecedor>> ReadByName(string nome)
        {
            // Reuse existing method since it already implements the same functionality
            return await ReadByRazaoSocial(nome);
        }

        private void PreencherParametros(MySqlCommand command, Fornecedor fornecedor)
        {
            command.Parameters.AddWithValue("@razaoSocial", fornecedor.RazaoSocial);
            command.Parameters.AddWithValue("@nomeFantasia", fornecedor.NomeFantasia ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cnpj", fornecedor.CNPJ ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@email", fornecedor.Email ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@telefone", fornecedor.Telefone ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@endereco", fornecedor.Endereco ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@numero", fornecedor.Numero ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@complemento", fornecedor.Complemento ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@bairro", fornecedor.Bairro ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cep", fornecedor.CEP ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cidadeId", fornecedor.CidadeId.HasValue ? fornecedor.CidadeId : DBNull.Value);
            command.Parameters.AddWithValue("@ativo", fornecedor.Ativo);
        }

        private Fornecedor MapearFornecedor(MySqlDataReader reader)
        {
            var fornecedor = new Fornecedor
            {
                Id = reader.GetInt64("id"),
                RazaoSocial = reader.GetString("razao_social"),
                NomeFantasia = reader.IsDBNull(reader.GetOrdinal("nome_fantasia")) ? null : reader.GetString("nome_fantasia"),
                CNPJ = reader.IsDBNull(reader.GetOrdinal("cnpj")) ? null : reader.GetString("cnpj"),
                Email = reader.IsDBNull(reader.GetOrdinal("email")) ? null : reader.GetString("email"),
                Telefone = reader.IsDBNull(reader.GetOrdinal("telefone")) ? null : reader.GetString("telefone"),
                Endereco = reader.IsDBNull(reader.GetOrdinal("endereco")) ? null : reader.GetString("endereco"),
                Numero = reader.IsDBNull(reader.GetOrdinal("numero")) ? null : reader.GetString("numero"),
                Complemento = reader.IsDBNull(reader.GetOrdinal("complemento")) ? null : reader.GetString("complemento"),
                Bairro = reader.IsDBNull(reader.GetOrdinal("bairro")) ? null : reader.GetString("bairro"),
                CEP = reader.IsDBNull(reader.GetOrdinal("cep")) ? null : reader.GetString("cep"),
                CidadeId = reader.IsDBNull(reader.GetOrdinal("cidade_id")) ? (long?)null : reader.GetInt64("cidade_id"),
                Ativo = reader.GetBoolean("ativo")
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
                
                fornecedor.Cidade = cidade;
            }

            return fornecedor;
        }
    }
}
