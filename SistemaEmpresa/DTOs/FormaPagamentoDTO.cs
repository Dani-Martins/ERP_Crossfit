using System;
using System.ComponentModel.DataAnnotations;
using SistemaEmpresa.DTOs;

namespace SistemaEmpresa.Models.DTOs
{
    public class FormaPagamentoDTO
    {
        public long Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
    }

    public class FormaPagamentoCreateDTO
    {
        public string Descricao { get; set; } = string.Empty;
    }

    public class FormaPagamentoUpdateDTO
    {
        public string Descricao { get; set; } = string.Empty;
    }
}

namespace SistemaEmpresa.DTOs
{
    public class FormaPagamentoDTO
    {
        public long Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
    }

    public class FormaPagamentoCreateDTO
    {
        public string Descricao { get; set; } = string.Empty;
    }

    public class FormaPagamentoUpdateDTO
    {
        public string Descricao { get; set; } = string.Empty;
    }
}