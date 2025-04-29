using Microsoft.EntityFrameworkCore;
using SistemaEmpresa.Models;
using SistemaEmpresa.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaEmpresa.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }
        public DbSet<Produto> Produtos { get; set; }

        public DbSet<Pais> Paises { get; set; }
        public DbSet<Estado> Estados { get; set; }
        public DbSet<Cidade> Cidades { get; set; }
        public DbSet<Fornecedor> Fornecedores { get; set; }
        public DbSet<FormaPagamento> FormasPagamento { get; set; }
        public DbSet<CondicaoPagamento> CondicoesPagamento { get; set; }
        public DbSet<ProdutoFornecedor> ProdutoFornecedores { get; set; }
        public DbSet<Transportadora> Transportadoras { get; set; }
        public DbSet<Veiculo> Veiculos { get; set; }
        public DbSet<ModalidadeNFE> ModalidadesNFE { get; set; }
        public DbSet<NFE> NFEs { get; set; }
        public DbSet<ItemNFE> ItensNFE { get; set; }
        public DbSet<MovimentacaoNFE> MovimentacoesNFE { get; set; }
        public DbSet<TranspItem> TranspItens { get; set; }
        public DbSet<FormaPagamento> FormaPagamento { get; set; }
        public DbSet<ParcelaCondicaoPagamento> ParcelasCondicaoPagamento { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuração para Pais (chave primária string)
            modelBuilder.Entity<Pais>(entity =>
            {
                entity.ToTable("pais");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Nome).HasMaxLength(100).IsRequired();
                entity.Property(p => p.Codigo).HasMaxLength(5);
                entity.Property(p => p.Sigla).HasMaxLength(5);
            });

            // Configuração para Estado
            modelBuilder.Entity<Estado>(entity =>
            {
                entity.ToTable("estado");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Nome).HasColumnName("nome").IsRequired();
                entity.Property(e => e.UF).HasColumnName("uf").IsRequired(false); // Marca explicitamente como nullable
                entity.Property(e => e.PaisId).HasColumnName("pais_id");
                
                entity.HasOne(e => e.Pais)
                      .WithMany()
                      .HasForeignKey(e => e.PaisId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Estado>()
                .HasMany<Cidade>()
                .WithOne(c => c.Estado)
                .HasForeignKey(c => c.EstadoId);

            // Configuração explícita do relacionamento Estado-País
            modelBuilder.Entity<Estado>()
                .HasOne(e => e.Pais)
                .WithMany(p => p.Estados)
                .HasForeignKey(e => e.PaisId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configuração para Cidade
            modelBuilder.Entity<Cidade>(entity =>
            {
                entity.ToTable("cidade");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Nome).HasMaxLength(100).IsRequired();
                entity.Property(c => c.CodigoIBGE).HasMaxLength(10);

                entity.HasOne(c => c.Estado)
                      .WithMany(e => e.Cidades)
                      .HasForeignKey(c => c.EstadoId);
            });

            // Configuração para Cliente
            modelBuilder.Entity<Cliente>(entity =>
            {
                entity.ToTable("cliente");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Nome).HasMaxLength(100).IsRequired();
                entity.Property(c => c.CPF).HasMaxLength(14);
                entity.Property(c => c.CNPJ).HasMaxLength(18);
                entity.Property(c => c.Email).HasMaxLength(100);
                entity.Property(c => c.Telefone).HasMaxLength(20);
                entity.Property(c => c.Endereco).HasMaxLength(200);
                entity.Property(c => c.Numero).HasMaxLength(20);
                entity.Property(c => c.Complemento).HasMaxLength(100);
                entity.Property(c => c.Bairro).HasMaxLength(50);
                entity.Property(c => c.CEP).HasMaxLength(10);
                entity.Property(c => c.Ativo).HasDefaultValue(true);

                entity.HasOne(c => c.Cidade)
                      .WithMany()
                      .HasForeignKey(c => c.CidadeId);
            });

            // Configuração para Fornecedor
            modelBuilder.Entity<Fornecedor>(entity =>
            {
                entity.ToTable("fornecedores");
                entity.HasKey(f => f.Id);
                entity.Property(f => f.RazaoSocial).HasMaxLength(150).IsRequired();
                entity.Property(f => f.NomeFantasia).HasMaxLength(100);
                entity.Property(f => f.CNPJ).HasMaxLength(18);
                entity.Property(f => f.Email).HasMaxLength(100);
                entity.Property(f => f.Telefone).HasMaxLength(20);
                entity.Property(f => f.Endereco).HasMaxLength(200);
                entity.Property(f => f.Numero).HasMaxLength(20);
                entity.Property(f => f.Complemento).HasMaxLength(100);
                entity.Property(f => f.Bairro).HasMaxLength(50);
                entity.Property(f => f.CEP).HasMaxLength(10);
                entity.Property(f => f.Ativo).HasDefaultValue(true);

                entity.HasOne(f => f.Cidade)
                      .WithMany()
                      .HasForeignKey(f => f.CidadeId);
            });

            // Continuar com outras configurações...

            // Configuração para FormaPagamento
            modelBuilder.Entity<FormaPagamento>(entity =>
            {
                entity.ToTable("forma_pagamento");
                entity.HasKey(f => f.Id);
                entity.Property(f => f.Descricao).HasMaxLength(255);
            });

            // Configuração para CondicaoPagamento
            modelBuilder.Entity<CondicaoPagamento>(entity =>
            {
                entity.ToTable("condicao_pagamento");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.AVista).HasDefaultValue(true);
                entity.Property(c => c.Ativo).HasDefaultValue(true);
            });

            modelBuilder.Entity<CondicaoPagamento>()
                .HasMany(c => c.Parcelas)
                .WithOne(p => p.CondicaoPagamento)
                .HasForeignKey(p => p.CondicaoPagamentoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuração para chave única composta
            modelBuilder.Entity<ParcelaCondicaoPagamento>()
                .HasIndex(p => new { p.CondicaoPagamentoId, p.Numero })
                .IsUnique();

            // Configuração para Produto
            modelBuilder.Entity<Produto>(entity =>
            {
                entity.ToTable("produto");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Codigo).HasMaxLength(30);
                entity.Property(p => p.Nome).HasMaxLength(100).IsRequired();
                entity.Property(p => p.Preco).HasPrecision(10, 2);
                entity.Property(p => p.Ativo).HasDefaultValue(true);
            });

            // Configuração para ProdutoFornecedor
            modelBuilder.Entity<ProdutoFornecedor>(entity =>
            {
                entity.ToTable("produto_fornecedor");
                entity.HasKey(pf => pf.Id);
                entity.Property(pf => pf.CodigoProd).HasMaxLength(50);
                entity.Property(pf => pf.Custo).HasPrecision(10, 2);
                entity.Property(pf => pf.Ativo).HasDefaultValue(true);

                entity.HasOne(pf => pf.Produto)
                      .WithMany()
                      .HasForeignKey(pf => pf.ProdutoId);

                entity.HasOne(pf => pf.Fornecedor)
                      .WithMany()
                      .HasForeignKey(pf => pf.FornecedorId);
            });

            // Configuração para Transportadora
            modelBuilder.Entity<Transportadora>(entity =>
            {
                entity.ToTable("transportadora");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.RazaoSocial).HasMaxLength(150).IsRequired();
                entity.Property(t => t.NomeFantasia).HasMaxLength(100);
                entity.Property(t => t.CNPJ).HasMaxLength(18);
                entity.Property(t => t.Email).HasMaxLength(100);
                entity.Property(t => t.Telefone).HasMaxLength(20);
                entity.Property(t => t.Endereco).HasMaxLength(200);
                entity.Property(t => t.Ativo).HasDefaultValue(true);

                entity.HasOne(t => t.Cidade)
                      .WithMany()
                      .HasForeignKey(t => t.CidadeId);
            });

            // Configuração para Veiculo
            modelBuilder.Entity<Veiculo>(entity =>
            {
                entity.ToTable("veiculo");
                entity.HasKey(v => v.Id);
                entity.Property(v => v.Placa).HasMaxLength(10).IsRequired();
                entity.Property(v => v.Modelo).HasMaxLength(50);
                entity.Property(v => v.Marca).HasMaxLength(50);
                entity.Property(v => v.Capacidade).HasPrecision(10, 2);
                entity.Property(v => v.Ativo).HasDefaultValue(true);

                entity.HasOne(v => v.Transportadora)
                      .WithMany()
                      .HasForeignKey(v => v.TransportadoraId);
            });

            // Configuração para ModalidadeNFE
            modelBuilder.Entity<ModalidadeNFE>(entity =>
            {
                entity.ToTable("modalidade_nfe");
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Codigo).HasMaxLength(10).IsRequired();
                entity.Property(m => m.Descricao).HasMaxLength(100).IsRequired();
                entity.Property(m => m.Ativo).HasDefaultValue(true);
            });

            // Configuração para NFE
            modelBuilder.Entity<NFE>(entity =>
            {
                entity.ToTable("nfe");
                entity.HasKey(n => n.Id);
                entity.Property(n => n.Numero).HasMaxLength(50).IsRequired();
                entity.Property(n => n.Serie).HasMaxLength(3).IsRequired();
                entity.Property(n => n.ChaveAcesso).HasMaxLength(44);
                entity.Property(n => n.ValorTotal).HasPrecision(10, 2);
                entity.Property(n => n.Cancelada).HasDefaultValue(false);

                entity.HasOne(n => n.Cliente)
                      .WithMany()
                      .HasForeignKey(n => n.ClienteId);

                entity.HasOne(n => n.FormaPagamento)
                      .WithMany()
                      .HasForeignKey(n => n.FormaPagamentoId);

                entity.HasOne(n => n.CondicaoPagamento)
                      .WithMany()
                      .HasForeignKey(n => n.CondicaoPagamentoId);

                entity.HasOne(n => n.Transportadora)
                      .WithMany()
                      .HasForeignKey(n => n.TransportadoraId);

                entity.HasOne(n => n.Veiculo)
                      .WithMany()
                      .HasForeignKey(n => n.VeiculoId);

                entity.HasOne(n => n.Modalidade)
                      .WithMany()
                      .HasForeignKey(n => n.ModalidadeId);
            });

            // Configuração para ItemNFE
            modelBuilder.Entity<ItemNFE>(entity =>
            {
                entity.ToTable("item_nfe");
                entity.HasKey(i => i.Id);
                entity.Property(i => i.Quantidade).HasPrecision(10, 3);
                entity.Property(i => i.ValorUnitario).HasPrecision(10, 2);
                entity.Property(i => i.ValorTotal).HasPrecision(10, 2);

                entity.HasOne(i => i.NFE)
                      .WithMany()
                      .HasForeignKey(i => i.NfeId);

                entity.HasOne(i => i.Produto)
                      .WithMany()
                      .HasForeignKey(i => i.ProdutoId);
            });

            // Configuração para MovimentacaoNFE
            modelBuilder.Entity<MovimentacaoNFE>(entity =>
            {
                entity.ToTable("movimentacao_nfe");
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Status).HasMaxLength(50).IsRequired();

                entity.HasOne(m => m.NFE)
                      .WithMany()
                      .HasForeignKey(m => m.NfeId);
            });

            // Configuração para TranspItem
            modelBuilder.Entity<TranspItem>(entity =>
            {
                entity.ToTable("transp_item");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Codigo).HasMaxLength(20).IsRequired();
                entity.Property(t => t.Descricao).HasMaxLength(100);
                entity.Property(t => t.CodigoTransp).HasMaxLength(20);
                entity.Property(t => t.Ativo).HasDefaultValue(true);

                entity.HasOne(t => t.Transportadora)
                      .WithMany()
                      .HasForeignKey(t => t.TransportadoraId);
            });
        }
    }
}