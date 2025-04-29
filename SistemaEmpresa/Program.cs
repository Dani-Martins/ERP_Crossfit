using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using MySqlConnector;
using System.Reflection;
using SistemaEmpresa.Repositories;
using SistemaEmpresa.Controllers;
using SistemaEmpresa.Services;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SistemaEmpresa.Data;
using Swashbuckle.AspNetCore.SwaggerUI;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // Adicionar configuração de ConnectionStrings
    builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                         .AddInMemoryCollection(new[]
                         {
                             new KeyValuePair<string, string?>("ConnectionStrings:DefaultConnection", "Server=localhost;Database=sistema_empresa;User=root;Password=dsm852003;AllowUserVariables=True")
                         });

    // Teste de conexão com o banco de dados
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    using (var connection = new MySqlConnection(connectionString))
    {
        try
        {
            await connection.OpenAsync();
            Console.WriteLine("✅ Conexão com o banco de dados estabelecida com sucesso!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Erro ao conectar ao banco de dados: {ex.Message}");
            throw;
        }
    }

    // Substitua todas as configurações CORS por esta única configuração
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
    });

    // Configurar a conexão com o banco de dados
    builder.Services.AddTransient<MySqlConnection>(_ => 
        new MySqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

    // Configuração do Entity Framework com MySQL
    // Mudei de AppDbContext para ApplicationDbContext para manter consistência
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySql(
            builder.Configuration.GetConnectionString("DefaultConnection"),
            ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
        )
    );

    // Registro dos Repositories - Eliminei duplicações
    builder.Services.AddScoped<VeiculoRepository>();
    builder.Services.AddScoped<TransportadoraRepository>();
    builder.Services.AddScoped<NFERepository>();
    builder.Services.AddScoped<ClienteRepository>();
    builder.Services.AddScoped<FornecedorRepository>();
    builder.Services.AddScoped<ModalidadeNFERepository>();
    builder.Services.AddScoped<MovimentacaoNFERepository>();
    builder.Services.AddScoped<EstadoRepository>();
    builder.Services.AddScoped<PaisRepository>();
    builder.Services.AddScoped<CondicaoPagamentoRepository>();
    builder.Services.AddScoped<FormaPagamentoRepository>();
    builder.Services.AddScoped<FuncionarioRepository>();
    builder.Services.AddScoped<ItemNFERepository>();
    builder.Services.AddScoped<TranspItemRepository>();
    builder.Services.AddScoped<FaturaRepository>();
    builder.Services.AddScoped<ParcelaRepository>();
    builder.Services.AddScoped<CidadeRepository>();
    builder.Services.AddScoped<ParcelaCondicaoPagamentoRepository>();
    builder.Services.AddScoped<ProdutoRepository>();

    // Registro dos Services - Eliminei duplicações
    builder.Services.AddScoped<VeiculoService>();
    builder.Services.AddScoped<TransportadoraService>();
    builder.Services.AddScoped<NFEService>();
    builder.Services.AddScoped<ClienteService>();
    builder.Services.AddScoped<FornecedorService>();
    builder.Services.AddScoped<ModalidadeNFEService>();
    builder.Services.AddScoped<MovimentacaoNFEService>();
    builder.Services.AddScoped<EstadoService>();
    builder.Services.AddScoped<PaisService>();
    builder.Services.AddScoped<CondicaoPagamentoService>();
    builder.Services.AddScoped<FormaPagamentoService>();
    builder.Services.AddScoped<FuncionarioService>();
    builder.Services.AddScoped<ItemNFEService>();
    builder.Services.AddScoped<TranspItemService>();
    builder.Services.AddScoped<CidadeService>();
    builder.Services.AddScoped<ProdutoService>();
    builder.Services.AddScoped<ParcelaCondicaoPagamentoService>();
    builder.Services.AddScoped<FaturaService>();
    builder.Services.AddScoped<ParcelaService>();

    // Os controllers não precisam ser registrados explicitamente
    // Removi as linhas relacionadas ao DiagnosticoController

    // Adicionar serviços ao contêiner
    builder.Services.AddControllers()
        .AddJsonOptions(options => 
        {
            // Configura o serializador para usar camelCase
            options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            
            // Mantém o case das chaves de dicionário (opcional)
            options.JsonSerializerOptions.DictionaryKeyPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            
            // Ignora propriedades nulas (opcional)
            options.JsonSerializerOptions.DefaultIgnoreCondition = 
                System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
        });

    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { 
            Title = "Sistema Empresa API", 
            Version = "v1",
            Description = "API para gestão empresarial"
        });
        
        // Esta linha é crucial para importar os comentários XML:
        var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
        if (File.Exists(xmlPath))
        {
            c.IncludeXmlComments(xmlPath);
        }
        c.EnableAnnotations(); // Habilita o uso de anotações como SwaggerOperation
    });

    var app = builder.Build();

    // Configurar o pipeline de requisição HTTP
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseCors(); // Esta linha deve vir ANTES do UseAuthorization
    app.UseAuthorization();
    app.MapControllers();

    // Configure a interface do Swagger
    app.UseSwagger(c => {
        c.SerializeAsV2 = false;
    });

    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Sistema Empresa API v1");
        c.RoutePrefix = "swagger";
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None);
        c.EnableFilter();
        c.DefaultModelsExpandDepth(-1);
        c.DisplayRequestDuration();
        c.EnableDeepLinking();
    });

    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"Erro ao iniciar a aplicação: {ex.Message}");
    throw;
}
