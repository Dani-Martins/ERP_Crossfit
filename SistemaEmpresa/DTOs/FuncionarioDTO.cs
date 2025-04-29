using System.ComponentModel.DataAnnotations;

namespace SistemaEmpresa.DTOs
{
    public class FuncionarioDTO
    {
        public long Id { get; set; }

        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 caracteres")]
        public string CPF { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "RG deve ter no máximo 20 caracteres")]
        public string? RG { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        public DateTime DataNascimento { get; set; }

        [EmailAddress(ErrorMessage = "Email inválido")]
        [StringLength(100, ErrorMessage = "Email deve ter no máximo 100 caracteres")]
        public string? Email { get; set; }

        [StringLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string? Telefone { get; set; }

        [StringLength(100, ErrorMessage = "Endereço deve ter no máximo 100 caracteres")]
        public string? Endereco { get; set; }

        [StringLength(10, ErrorMessage = "Número deve ter no máximo 10 caracteres")]
        public string? Numero { get; set; }

        [StringLength(50, ErrorMessage = "Complemento deve ter no máximo 50 caracteres")]
        public string? Complemento { get; set; }

        [StringLength(50, ErrorMessage = "Bairro deve ter no máximo 50 caracteres")]
        public string? Bairro { get; set; }

        [StringLength(8, MinimumLength = 8, ErrorMessage = "CEP deve ter 8 caracteres")]
        public string? CEP { get; set; }

        public long? CidadeId { get; set; }

        [Required(ErrorMessage = "Data de admissão é obrigatória")]
        public DateTime DataAdmissao { get; set; }

        public DateTime? DataDemissao { get; set; }

        [Required(ErrorMessage = "Cargo é obrigatório")]
        [StringLength(50, ErrorMessage = "Cargo deve ter no máximo 50 caracteres")]
        public string Cargo { get; set; } = string.Empty;

        [Range(0, 999999.99, ErrorMessage = "Salário deve estar entre 0 e 999.999,99")]
        public decimal? Salario { get; set; }

        public bool Ativo { get; set; }

        public CidadeDTO? Cidade { get; set; }
    }

    public class CreateFuncionarioDTO
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "CPF é obrigatório")]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 caracteres")]
        public string CPF { get; set; } = string.Empty;

        [StringLength(20, ErrorMessage = "RG deve ter no máximo 20 caracteres")]
        public string? RG { get; set; }

        [Required(ErrorMessage = "Data de nascimento é obrigatória")]
        public DateTime DataNascimento { get; set; }

        [EmailAddress(ErrorMessage = "Email inválido")]
        [StringLength(100, ErrorMessage = "Email deve ter no máximo 100 caracteres")]
        public string? Email { get; set; }

        [StringLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string? Telefone { get; set; }

        [StringLength(100, ErrorMessage = "Endereço deve ter no máximo 100 caracteres")]
        public string? Endereco { get; set; }

        [StringLength(10, ErrorMessage = "Número deve ter no máximo 10 caracteres")]
        public string? Numero { get; set; }

        [StringLength(50, ErrorMessage = "Complemento deve ter no máximo 50 caracteres")]
        public string? Complemento { get; set; }

        [StringLength(50, ErrorMessage = "Bairro deve ter no máximo 50 caracteres")]
        public string? Bairro { get; set; }

        [StringLength(8, MinimumLength = 8, ErrorMessage = "CEP deve ter 8 caracteres")]
        public string? CEP { get; set; }

        public long? CidadeId { get; set; }

        [Required(ErrorMessage = "Data de admissão é obrigatória")]
        public DateTime DataAdmissao { get; set; }

        public DateTime? DataDemissao { get; set; }

        [Required(ErrorMessage = "Cargo é obrigatório")]
        [StringLength(50, ErrorMessage = "Cargo deve ter no máximo 50 caracteres")]
        public string Cargo { get; set; } = string.Empty;

        [Range(0, 999999.99, ErrorMessage = "Salário deve estar entre 0 e 999.999,99")]
        public decimal? Salario { get; set; }
    }

    public class UpdateFuncionarioDTO : CreateFuncionarioDTO
    {
        public bool Ativo { get; set; }
    }

    public class FuncionarioCreateDTO
    {
        public string Nome { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
        public string RG { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Numero { get; set; } = string.Empty;
        public string Complemento { get; set; } = string.Empty;
        public string Bairro { get; set; } = string.Empty;
        public string CEP { get; set; } = string.Empty;
        public long CidadeId { get; set; }
        public string Cargo { get; set; } = string.Empty;
        public decimal Salario { get; set; }
        public DateTime DataAdmissao { get; set; }
        public DateTime? DataDemissao { get; set; }
        public bool Ativo { get; set; }
    }

    public class FuncionarioUpdateDTO
    {
        public string Nome { get; set; } = string.Empty;
        public string CPF { get; set; } = string.Empty;
        public string RG { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public string Telefone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Numero { get; set; } = string.Empty;
        public string Complemento { get; set; } = string.Empty;
        public string Bairro { get; set; } = string.Empty;
        public string CEP { get; set; } = string.Empty;
        public long CidadeId { get; set; }
        public string Cargo { get; set; } = string.Empty;
        public decimal Salario { get; set; }
        public DateTime DataAdmissao { get; set; }
        public DateTime? DataDemissao { get; set; }
        public bool Ativo { get; set; }
    }
}