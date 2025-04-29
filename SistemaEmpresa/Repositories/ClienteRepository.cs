using MySqlConnector;
using SistemaEmpresa.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace SistemaEmpresa.Repositories
{
    public class ClienteRepository
    {
        private readonly MySqlConnection _connection;

        public ClienteRepository(MySqlConnection connection)
        {
            _connection = connection;
        }

        public async Task<IEnumerable<Cliente>> GetAll()
        {
            var clientes = new List<Cliente>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT c.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM cliente c
                    LEFT JOIN cidade cid ON c.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE c.ativo = 1
                    ORDER BY c.nome", _connection);
                    
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    clientes.Add(MapearCliente(reader));
                }
                
                return clientes;
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao buscar clientes: {ex.Message}", ex);
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<Cliente?> ReadById(long id)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT c.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM cliente c
                    LEFT JOIN cidade cid ON c.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE c.id = @id", _connection);
                    
                command.Parameters.AddWithValue("@id", id);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return MapearCliente(reader);
                }
                
                return null;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<List<Cliente>> ReadByName(string nome)
        {
            var clientes = new List<Cliente>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT c.*, 
                           cid.id as cidade_id, cid.nome as cidade_nome, cid.codigo_ibge as cidade_codigo_ibge,
                           e.id as estado_id, e.nome as estado_nome, e.uf as estado_uf,
                           p.id as pais_id, p.nome as pais_nome, p.codigo as pais_codigo, p.sigla as pais_sigla
                    FROM cliente c
                    LEFT JOIN cidade cid ON c.cidade_id = cid.id
                    LEFT JOIN estado e ON cid.estado_id = e.id
                    LEFT JOIN pais p ON e.pais_id = p.id
                    WHERE c.nome LIKE @nome AND c.ativo = 1
                    ORDER BY c.nome", _connection);
                    
                command.Parameters.AddWithValue("@nome", $"%{nome}%");
                
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    clientes.Add(MapearCliente(reader));
                }
                
                return clientes;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Create(Cliente cliente)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    INSERT INTO cliente (
                        nome, cpf, cnpj, email, telefone, 
                        endereco, numero, complemento, bairro, cep, 
                        cidade_id, ativo
                    )
                    VALUES (
                        @nome, @cpf, @cnpj, @email, @telefone, 
                        @endereco, @numero, @complemento, @bairro, @cep, 
                        @cidadeId, @ativo
                    );
                    SELECT LAST_INSERT_ID();", _connection);
                
                PreencherParametros(command, cliente);
                
                var id = Convert.ToInt64(await command.ExecuteScalarAsync());
                cliente.Id = id;
                
                return id > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Update(long id, Cliente cliente)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    UPDATE cliente
                    SET nome = @nome, 
                        cpf = @cpf, 
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
                PreencherParametros(command, cliente);
                
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
                    "UPDATE cliente SET ativo = 0 WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        private void PreencherParametros(MySqlCommand command, Cliente cliente)
        {
            command.Parameters.AddWithValue("@nome", cliente.Nome);
            command.Parameters.AddWithValue("@cpf", cliente.CPF ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cnpj", cliente.CNPJ ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@email", cliente.Email ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@telefone", cliente.Telefone ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@endereco", cliente.Endereco ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@numero", cliente.Numero ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@complemento", cliente.Complemento ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@bairro", cliente.Bairro ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cep", cliente.CEP ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@cidadeId", cliente.CidadeId != null ? cliente.CidadeId : DBNull.Value);
            command.Parameters.AddWithValue("@ativo", cliente.Ativo);
        }

        private Cliente MapearCliente(MySqlDataReader reader)
        {
            var cliente = new Cliente
            {
                Id = reader.GetInt64("id"),
                Nome = reader.GetString("nome"),
                CPF = reader.IsDBNull(reader.GetOrdinal("cpf")) ? null : reader.GetString("cpf"),
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

            // Se tiver cidade, cria o objeto completo com estado e país
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
                        Id = reader.GetInt32("estado_id"),
                        Nome = reader.IsDBNull(reader.GetOrdinal("estado_nome")) ? string.Empty : reader.GetString("estado_nome"),
                        UF = reader.IsDBNull(reader.GetOrdinal("estado_uf")) ? string.Empty : reader.GetString("estado_uf"),
                    };

                    // Verifica se tem país antes de acessar
                    if (!reader.IsDBNull(reader.GetOrdinal("pais_id")))
                    {
                        estado.PaisId = reader.GetInt32("pais_id");
                        
                        var pais = new Pais
                        {
                            Id = reader.GetInt32("pais_id"),
                            Nome = reader.IsDBNull(reader.GetOrdinal("pais_nome")) ? string.Empty : reader.GetString("pais_nome"),
                            Codigo = reader.IsDBNull(reader.GetOrdinal("pais_codigo")) ? null : reader.GetString("pais_codigo"),
                            Sigla = reader.IsDBNull(reader.GetOrdinal("pais_sigla")) ? null : reader.GetString("pais_sigla")
                        };
                        
                        estado.Pais = pais;
                    }
                    
                    cidade.Estado = estado;
                }
                
                cliente.Cidade = cidade;
            }

            return cliente;
        }
    }
}
