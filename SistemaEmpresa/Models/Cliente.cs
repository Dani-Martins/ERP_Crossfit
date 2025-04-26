using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEmpresa.Models
{
    [Table("cliente")]
    public class Cliente
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("nome")]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Column("cpf")]
        [StringLength(14)]
        public string CPF { get; set; } = string.Empty;

        [Column("cnpj")]
        [StringLength(18)]
        public string CNPJ { get; set; } = string.Empty;

        [Column("email")]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Column("telefone")]
        [StringLength(20)]
        public string Telefone { get; set; } = string.Empty;

        [Column("endereco")]
        [StringLength(200)]
        public string Endereco { get; set; } = string.Empty;

        [Column("numero")]
        [StringLength(20)]
        public string Numero { get; set; } = string.Empty;

        [Column("complemento")]
        [StringLength(100)]
        public string Complemento { get; set; } = string.Empty;

        [Column("bairro")]
        [StringLength(50)]
        public string Bairro { get; set; } = string.Empty;

        [Column("cep")]
        [StringLength(10)]
        public string CEP { get; set; } = string.Empty;

        [Column("cidade_id")]
        public long? CidadeId { get; set; }

        [Column("ativo")]
        public bool Ativo { get; set; }

        [ForeignKey("CidadeId")]
        public virtual Cidade? Cidade { get; set; }
    }
}
