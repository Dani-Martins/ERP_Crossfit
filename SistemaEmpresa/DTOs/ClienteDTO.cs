using System;
using System.ComponentModel.DataAnnotations;

namespace SistemaEmpresa.DTOs
{
    public class ClienteDTO
    {
        public long Id { get; set; }
        public required string Nome { get; set; }
        public string? CPF { get; set; }
        public string? CNPJ { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public string? Endereco { get; set; }
        public string? Numero { get; set; }
        public string? Complemento { get; set; }
        public string? Bairro { get; set; }
        public string? CEP { get; set; }
        public long? CidadeId { get; set; }
        public CidadeDTO? Cidade { get; set; }
        public bool Ativo { get; set; }
    }

    public class ClienteCreateDTO
    {
        [Required(ErrorMessage = "O nome do cliente é obrigatório")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres")]
        public required string Nome { get; set; }

        [StringLength(14, ErrorMessage = "O CPF deve ter no máximo 14 caracteres")]
        public string? CPF { get; set; }

        [StringLength(18, ErrorMessage = "O CNPJ deve ter no máximo 18 caracteres")]
        public string? CNPJ { get; set; }

        [EmailAddress(ErrorMessage = "Formato de e-mail inválido")]
        [StringLength(100, ErrorMessage = "O email deve ter no máximo 100 caracteres")]
        public string? Email { get; set; }

        [StringLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres")]
        public string? Telefone { get; set; }

        [StringLength(200, ErrorMessage = "O endereço deve ter no máximo 200 caracteres")]
        public string? Endereco { get; set; }

        [StringLength(20, ErrorMessage = "O número deve ter no máximo 20 caracteres")]
        public string? Numero { get; set; }

        [StringLength(100, ErrorMessage = "O complemento deve ter no máximo 100 caracteres")]
        public string? Complemento { get; set; }

        [StringLength(50, ErrorMessage = "O bairro deve ter no máximo 50 caracteres")]
        public string? Bairro { get; set; }

        [StringLength(10, ErrorMessage = "O CEP deve ter no máximo 10 caracteres")]
        public string? CEP { get; set; }

        public long? CidadeId { get; set; }

        public bool Ativo { get; set; } = true;
    }

    public class ClienteUpdateDTO
    {
        [Required(ErrorMessage = "O nome do cliente é obrigatório")]
        [StringLength(100, ErrorMessage = "O nome deve ter no máximo 100 caracteres")]
        public required string Nome { get; set; }

        [StringLength(14, ErrorMessage = "O CPF deve ter no máximo 14 caracteres")]
        public string? CPF { get; set; }

        [StringLength(18, ErrorMessage = "O CNPJ deve ter no máximo 18 caracteres")]
        public string? CNPJ { get; set; }

        [EmailAddress(ErrorMessage = "Formato de e-mail inválido")]
        [StringLength(100, ErrorMessage = "O email deve ter no máximo 100 caracteres")]
        public string? Email { get; set; }

        [StringLength(20, ErrorMessage = "O telefone deve ter no máximo 20 caracteres")]
        public string? Telefone { get; set; }

        [StringLength(200, ErrorMessage = "O endereço deve ter no máximo 200 caracteres")]
        public string? Endereco { get; set; }

        [StringLength(20, ErrorMessage = "O número deve ter no máximo 20 caracteres")]
        public string? Numero { get; set; }

        [StringLength(100, ErrorMessage = "O complemento deve ter no máximo 100 caracteres")]
        public string? Complemento { get; set; }

        [StringLength(50, ErrorMessage = "O bairro deve ter no máximo 50 caracteres")]
        public string? Bairro { get; set; }

        [StringLength(10, ErrorMessage = "O CEP deve ter no máximo 10 caracteres")]
        public string? CEP { get; set; }

        public long? CidadeId { get; set; }

        public bool Ativo { get; set; }
    }
}