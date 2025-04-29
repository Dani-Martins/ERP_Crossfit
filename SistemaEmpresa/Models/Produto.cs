using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEmpresa.Models
{
    [Table("produto")]
    public class Produto
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("codigo")]
        [StringLength(30)]
        public string? Codigo { get; set; }

        [Required]
        [Column("nome")]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Column("descricao")]
        public string? Descricao { get; set; }

        [Required]
        [Column("preco")]
        [Range(0.01, double.MaxValue)]
        public decimal Preco { get; set; }

        [Column("ativo")]
        public bool Ativo { get; set; } = true;

        public int EstoqueMinimo { get; set; }
    }
}
