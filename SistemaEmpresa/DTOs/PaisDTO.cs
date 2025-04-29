using System.ComponentModel.DataAnnotations;

namespace SistemaEmpresa.DTOs
{
    public class PaisDTO
    {
        public long Id { get; set; } // Alterado de int para long
        public string Nome { get; set; } = string.Empty;
        public string Sigla { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        // ... outras propriedades
    }

    public class PaisCreateDTO
    {
        // Removido o campo ID, pois será gerado automaticamente no banco
        
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;
        
        [StringLength(10, ErrorMessage = "Código deve ter no máximo 10 caracteres")]
        public string? Codigo { get; set; }
        
        [StringLength(3, ErrorMessage = "Sigla deve ter no máximo 3 caracteres")]
        public string? Sigla { get; set; }
    }

    public class PaisUpdateDTO
    {
        // Removido o campo ID, pois será obtido apenas da URL
        
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;
        
        [StringLength(10, ErrorMessage = "Código deve ter no máximo 10 caracteres")]
        public string? Codigo { get; set; }
        
        [StringLength(3, ErrorMessage = "Sigla deve ter no máximo 3 caracteres")]
        public string? Sigla { get; set; }
    }
}