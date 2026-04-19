using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SuperMercadoApi.Server.Context.Configurations;

public class ProdutoConfiguration : IEntityTypeConfiguration<Produto>
{
    public void Configure(EntityTypeBuilder<Produto> builder)
    {
        builder.ToTable("Produtos");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Nome)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(p => p.CodigoBarras).HasMaxLength(50);
        builder.Property(p => p.CodigoInterno).HasMaxLength(50);
        builder.Property(p => p.Descricao).HasMaxLength(500);
        builder.Property(p => p.Imagem).HasMaxLength(500);
        builder.Property(p => p.Unidade).HasMaxLength(20).HasDefaultValue("UN");
        builder.Property(p => p.Localizacao).HasMaxLength(100);
        builder.Property(p => p.NCM).HasMaxLength(10);
        builder.Property(p => p.CEST).HasMaxLength(10);

        builder.Property(p => p.PrecoCusto).HasColumnType("decimal(10,2)").HasDefaultValue(0);
        builder.Property(p => p.PrecoVenda).HasColumnType("decimal(10,2)");
        builder.Property(p => p.PrecoPromocao).HasColumnType("decimal(10,2)");
        builder.Property(p => p.QuantidadeEstoque).HasColumnType("decimal(10,3)").HasDefaultValue(0);
        builder.Property(p => p.EstoqueMinimo).HasColumnType("decimal(10,3)").HasDefaultValue(5);
        builder.Property(p => p.EstoqueMaximo).HasColumnType("decimal(10,3)");
        builder.Property(p => p.AliquotaICMS).HasColumnType("decimal(5,2)");

        builder.Property(p => p.EmPromocao).HasDefaultValue(false);
        builder.Property(p => p.DiasAvisoValidade).HasDefaultValue(30);
        builder.Property(p => p.Ativo).HasDefaultValue(true);
        builder.Property(p => p.CriadoEm).HasDefaultValueSql("GETUTCDATE()");
        builder.Property(p => p.AtualizadoEm).HasDefaultValueSql("GETUTCDATE()");

        // Propriedades computadas — ignoradas pelo EF
        builder.Ignore(p => p.PrecoEfetivo);
        builder.Ignore(p => p.EstoqueBaixo);
        builder.Ignore(p => p.VencimentoProximo);
        builder.Ignore(p => p.Vencido);

        builder.HasIndex(p => p.CodigoBarras)
            .HasFilter("[CodigoBarras] IS NOT NULL");

        builder.HasIndex(p => p.SupermercadoId);

        builder.HasOne(p => p.Supermercado)
            .WithMany(s => s.Produtos)
            .HasForeignKey(p => p.SupermercadoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(p => p.Categoria)
            .WithMany(c => c.Produtos)
            .HasForeignKey(p => p.CategoriaId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(p => p.Fornecedor)
            .WithMany(f => f.Produtos)
            .HasForeignKey(p => p.FornecedorId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
