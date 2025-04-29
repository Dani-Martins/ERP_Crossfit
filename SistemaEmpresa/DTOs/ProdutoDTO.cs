using System.ComponentModel.DataAnnotations;

namespace SistemaEmpresa.DTOs
{
    public class ProdutoDTO
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "Código é obrigatório")]
        [StringLength(20, ErrorMessage = "Código deve ter no máximo 20 caracteres")]
        public string Codigo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Descrição é obrigatória")]
        [StringLength(100, ErrorMessage = "Descrição deve ter no máximo 100 caracteres")]
        public string Descricao { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Descrição reduzida deve ter no máximo 100 caracteres")]
        public string? DescricaoReduzida { get; set; }

        [StringLength(14, ErrorMessage = "GTIN deve ter no máximo 14 caracteres")]
        public string? GTIN { get; set; }

        [StringLength(8, ErrorMessage = "NCM deve ter no máximo 8 caracteres")]
        public string? NCM { get; set; }

        [StringLength(7, ErrorMessage = "CEST deve ter no máximo 7 caracteres")]
        public string? CEST { get; set; }

        [Range(0, 999999.999, ErrorMessage = "Peso bruto deve estar entre 0 e 999.999,999")]
        public decimal? PesoBruto { get; set; }

        [Range(0, 999999.999, ErrorMessage = "Peso líquido deve estar entre 0 e 999.999,999")]
        public decimal? PesoLiquido { get; set; }

        public bool Ativo { get; set; }
    }

    public class CreateProdutoDTO
    {
        [Required(ErrorMessage = "Código é obrigatório")]
        [StringLength(20, ErrorMessage = "Código deve ter no máximo 20 caracteres")]
        public string Codigo { get; set; } = string.Empty;

        [Required(ErrorMessage = "Descrição é obrigatória")]
        [StringLength(100, ErrorMessage = "Descrição deve ter no máximo 100 caracteres")]
        public string Descricao { get; set; } = string.Empty;

        [StringLength(100, ErrorMessage = "Descrição reduzida deve ter no máximo 100 caracteres")]
        public string? DescricaoReduzida { get; set; }

        [StringLength(14, ErrorMessage = "GTIN deve ter no máximo 14 caracteres")]
        public string? GTIN { get; set; }

        [StringLength(8, ErrorMessage = "NCM deve ter no máximo 8 caracteres")]
        public string? NCM { get; set; }

        [StringLength(7, ErrorMessage = "CEST deve ter no máximo 7 caracteres")]
        public string? CEST { get; set; }

        [Range(0, 999999.999, ErrorMessage = "Peso bruto deve estar entre 0 e 999.999,999")]
        public decimal? PesoBruto { get; set; }

        [Range(0, 999999.999, ErrorMessage = "Peso líquido deve estar entre 0 e 999.999,999")]
        public decimal? PesoLiquido { get; set; }
    }

    public class UpdateProdutoDTO : CreateProdutoDTO
    {
        public bool Ativo { get; set; }
    }
}