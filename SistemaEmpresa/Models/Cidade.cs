using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEmpresa.Models
{
    [Table("cidade")]
    public class Cidade
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("nome")]
        [StringLength(100)]
        public string Nome { get; set; } = string.Empty;

        [Column("codigo_ibge")]
        [StringLength(10)]
        public string? CodigoIBGE { get; set; }

        [Required]
        [Column("estado_id")]
        public long EstadoId { get; set; }

        [ForeignKey("EstadoId")]
        public virtual Estado? Estado { get; set; }
    }
}
