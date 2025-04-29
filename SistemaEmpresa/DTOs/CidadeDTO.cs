using System.ComponentModel.DataAnnotations;

namespace SistemaEmpresa.DTOs
{
    public class CidadeCreateDTO
    {
        [Required(ErrorMessage = "O nome da cidade é obrigatório")]
        public required string Nome { get; set; }
        
        [Required(ErrorMessage = "O código IBGE é obrigatório")]
        public required string CodigoIBGE { get; set; }
        
        [Required(ErrorMessage = "O ID do estado é obrigatório")]
        public long EstadoId { get; set; }
    }

    public class CidadeUpdateDTO
    {
        [Required(ErrorMessage = "O nome da cidade é obrigatório")]
        public required string Nome { get; set; }
        
        [Required(ErrorMessage = "O código IBGE é obrigatório")]
        public required string CodigoIBGE { get; set; }
        
        [Required(ErrorMessage = "O ID do estado é obrigatório")]
        public long EstadoId { get; set; }
    }
}