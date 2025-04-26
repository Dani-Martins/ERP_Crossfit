using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SistemaEmpresa.Models
{
    [Table("fornecedores")]
    public class Fornecedor
    {
        [Key]
        [Column("id")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required(ErrorMessage = "A Razão Social é obrigatória")]
        [StringLength(150, ErrorMessage = "A Razão Social deve ter no máximo 150 caracteres")]
        [Column("razao_social")]
        public string RazaoSocial { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "O Nome Fantasia deve ter no máximo 100 caracteres")]
        [Column("nome_fantasia")]
        public string? NomeFantasia { get; set; }

        [StringLength(18, ErrorMessage = "O CNPJ deve ter no máximo 18 caracteres")]
        [Column("cnpj")]
        public string? CNPJ { get; set; }

        [EmailAddress(ErrorMessage = "Formato de e-mail inválido")]
        [StringLength(100, ErrorMessage = "O Email deve ter no máximo 100 caracteres")]
        [Column("email")]
        public string? Email { get; set; }

        [StringLength(20, ErrorMessage = "O Telefone deve ter no máximo 20 caracteres")]
        [Column("telefone")]
        public string? Telefone { get; set; }

        [StringLength(200, ErrorMessage = "O Endereço deve ter no máximo 200 caracteres")]
        [Column("endereco")]
        public string? Endereco { get; set; }

        [StringLength(20, ErrorMessage = "O Número deve ter no máximo 20 caracteres")]
        [Column("numero")]
        public string? Numero { get; set; }

        [StringLength(100, ErrorMessage = "O Complemento deve ter no máximo 100 caracteres")]
        [Column("complemento")]
        public string? Complemento { get; set; }

        [StringLength(50, ErrorMessage = "O Bairro deve ter no máximo 50 caracteres")]
        [Column("bairro")]
        public string? Bairro { get; set; }

        [StringLength(10, ErrorMessage = "O CEP deve ter no máximo 10 caracteres")]
        [Column("cep")]
        public string? CEP { get; set; }

        [Column("cidade_id")]
        public long? CidadeId { get; set; }

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        [ForeignKey("CidadeId")]
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public virtual Cidade? Cidade { get; set; }

        // Propriedade de navegação para produtos associados
        [JsonIgnore]
        public virtual ICollection<ProdutoFornecedor>? ProdutoFornecedores { get; set; }

        // Método para retornar o endereço completo formatado
        [NotMapped]
        public string EnderecoCompleto => 
            $"{Endereco ?? ""}, {Numero ?? ""} {(string.IsNullOrEmpty(Complemento) ? "" : $"- {Complemento}")}, {Bairro ?? ""}, {(Cidade != null ? Cidade.Nome : "")}, {(Cidade?.Estado != null ? Cidade.Estado.UF : "")}";

        // Método para validar CNPJ
        [NotMapped]
        public bool CNPJValido => 
            !string.IsNullOrWhiteSpace(CNPJ) && 
            System.Text.RegularExpressions.Regex.IsMatch(CNPJ, @"^\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}$");
    }
}
