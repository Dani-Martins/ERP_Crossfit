using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SistemaEmpresa.Models
{
    [Table("forma_pagamento")]
    public class FormaPagamento
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [Column("descricao")]
        [StringLength(255)]
        public string Descricao { get; set; } = string.Empty;
        
        // Propriedade necessária para compatibilidade com código existente
        // Não será mapeada para o banco de dados
        [NotMapped]
        public bool Ativo { get; set; } = true;
        
        // Alias para manter compatibilidade com código existente
        [NotMapped]
        public string Nome 
        { 
            get => Descricao; 
            set => Descricao = value; 
        }
    }
}
