using MySqlConnector;
using SistemaEmpresa.Models;
using System.Data;

namespace SistemaEmpresa.Repositories
{
    public class PaisRepository
    {
        private readonly MySqlConnection _connection;

        public PaisRepository(MySqlConnection connection)
        {
            _connection = connection;
        }

        public async Task<List<Pais>> ReadAll()
        {
            var paises = new List<Pais>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(
                    "SELECT * FROM pais ORDER BY nome", _connection);
                    
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    paises.Add(MapearPais(reader));
                }
                
                return paises;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<Pais?> ReadById(int id)  // Mudança de string para int
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(
                    "SELECT * FROM pais WHERE id = @id", _connection);
                    
                command.Parameters.AddWithValue("@id", id);  // ID como int
                
                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    return new Pais
                    {
                        Id = reader.GetInt32("id"),  // Usando GetInt32
                        Nome = reader.GetString("nome"),
                        Sigla = reader.IsDBNull(reader.GetOrdinal("sigla")) 
                            ? null 
                            : reader.GetString("sigla"),
                        Codigo = reader.IsDBNull(reader.GetOrdinal("codigo")) 
                            ? null 
                            : reader.GetString("codigo")
                    };
                }
                
                return null;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Create(Pais pais)
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    INSERT INTO pais (id, nome, codigo, sigla)
                    VALUES (@id, @nome, @codigo, @sigla)", _connection);
                
                PreencherParametros(command, pais);
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task Update(int id, Pais pais)
        {
            try
            {
                await _connection.OpenAsync();
                
                string sql = @"UPDATE pais 
                              SET Nome = @Nome, 
                                  Sigla = @Sigla, 
                                  Codigo = @Codigo 
                              WHERE id = @idParam"; // Mudado para @idParam para evitar duplicação
                              
                using var cmd = new MySqlCommand(sql, _connection);
                
                // Adicionar parâmetros com nomes diferentes
                cmd.Parameters.AddWithValue("@Nome", pais.Nome);
                cmd.Parameters.AddWithValue("@Sigla", pais.Sigla);
                cmd.Parameters.AddWithValue("@Codigo", pais.Codigo);
                cmd.Parameters.AddWithValue("@idParam", id); // Usar nome diferente
                
                await cmd.ExecuteNonQueryAsync();
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<bool> Delete(int id)  // Mudança de string para int
        {
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(
                    "DELETE FROM pais WHERE id = @id", _connection);
                
                command.Parameters.AddWithValue("@id", id);  // ID como int
                
                return await command.ExecuteNonQueryAsync() > 0;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        public async Task<IEnumerable<Pais>> GetAllAsync()
        {
            var paises = new List<Pais>();
            
            try
            {
                await _connection.OpenAsync();
                
                using var command = new MySqlCommand(@"
                    SELECT * FROM pais
                    ORDER BY nome", _connection);
                    
                using var reader = await command.ExecuteReaderAsync();
                
                while (await reader.ReadAsync())
                {
                    paises.Add(MapearPais(reader));
                }
                
                return paises;
            }
            finally
            {
                if (_connection.State == ConnectionState.Open)
                    await _connection.CloseAsync();
            }
        }

        private void PreencherParametros(MySqlCommand command, Pais pais)
        {
            command.Parameters.AddWithValue("@id", pais.Id);
            command.Parameters.AddWithValue("@nome", pais.Nome);
            command.Parameters.AddWithValue("@codigo", pais.Codigo ?? (object)DBNull.Value);
            command.Parameters.AddWithValue("@sigla", pais.Sigla ?? (object)DBNull.Value);
        }

        private Pais MapearPais(MySqlDataReader reader)
        {
            return new Pais
            {
                Id = reader.GetInt32("id"),  // Usando GetInt32
                Nome = reader.GetString("nome"),
                Sigla = reader.IsDBNull(reader.GetOrdinal("sigla")) 
                    ? null 
                    : reader.GetString("sigla"),
                Codigo = reader.IsDBNull(reader.GetOrdinal("codigo")) 
                    ? null 
                    : reader.GetString("codigo"),
                // Adicione outras propriedades conforme necessário
            };
        }
    }
}
