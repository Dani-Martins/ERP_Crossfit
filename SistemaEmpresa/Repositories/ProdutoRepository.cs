using MySqlConnector;
using SistemaEmpresa.Models;
using System.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaEmpresa.Repositories
{
    public class ProdutoRepository
    {
        private readonly MySqlConnection _connection;

        public ProdutoRepository(MySqlConnection connection)
        {
            _connection = connection;
        }

        public async Task<List<Produto>> ReadAll()
        {
            var produtos = new List<Produto>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT p.* 
                    FROM produto p
                    WHERE p.ativo = 1
                    ORDER BY p.nome", _connection);
                    
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    produtos.Add(MapearProduto(reader));
                }
                
                return produtos;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<Produto?> ReadById(long id)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT p.* 
                    FROM produto p
                    WHERE p.id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return MapearProduto(reader);
                }
                
                return null;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<IEnumerable<Produto>> ReadByName(string nome)
        {
            // Implement the method to search products by name
            var produtos = await ReadAll();
            return produtos.Where(p => p.Nome.Contains(nome, StringComparison.OrdinalIgnoreCase));
        }

        public async Task<bool> Create(Produto produto)
        {
            try
            {
                await _connection.OpenAsync();

                using var command = new MySqlCommand(@"
                    INSERT INTO produto (codigo, nome, descricao, preco, ativo)
                    VALUES (@codigo, @nome, @descricao, @preco, @ativo);
                    SELECT LAST_INSERT_ID();", _connection);
                
                PreencherParametros(command, produto);
                
                var id = Convert.ToInt64(await command.ExecuteScalarAsync());
                produto.Id = id;
                
                return id > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Update(long id, Produto produto)
        {
            try
            {
                await _connection.OpenAsync();

                using var command = new MySqlCommand(@"
                    UPDATE produto 
                    SET codigo = @codigo,
                        nome = @nome,
                        descricao = @descricao,
                        preco = @preco,
                        ativo = @ativo
                    WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                PreencherParametros(command, produto);
                
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
                
                using var command = new MySqlCommand(@"
                    UPDATE produto 
                    SET ativo = 0 
                    WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        private void PreencherParametros(MySqlCommand command, Produto produto)
        {
            command.Parameters.AddWithValue("@codigo", produto.Codigo ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@nome", produto.Nome);
            command.Parameters.AddWithValue("@descricao", produto.Descricao ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@preco", produto.Preco);
            command.Parameters.AddWithValue("@ativo", produto.Ativo);
        }

        private Produto MapearProduto(MySqlDataReader reader)
        {
            return new Produto
            {
                Id = reader.GetInt64("id"),
                Codigo = reader.IsDBNull(reader.GetOrdinal("codigo")) 
                    ? null 
                    : reader.GetString("codigo"),
                Nome = reader.GetString("nome"),
                Descricao = reader.IsDBNull(reader.GetOrdinal("descricao")) 
                    ? null 
                    : reader.GetString("descricao"),
                Preco = reader.GetDecimal("preco"),
                Ativo = reader.GetBoolean("ativo")
            };
        }
    }
}
