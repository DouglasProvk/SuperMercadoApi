using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SuperMercadoApi.Server.Context.Configurations;

public class MovimentacaoEstoqueConfiguration : IEntityTypeConfiguration<MovimentacaoEstoque>
{
    public void Configure(EntityTypeBuilder<MovimentacaoEstoque> builder)
    {
        builder.ToTable("MovimentacoesEstoque");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Tipo)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(m => m.Motivo).HasMaxLength(300);

        builder.Property(m => m.Quantidade).HasColumnType("decimal(10,3)");
        builder.Property(m => m.QuantidadeAntes).HasColumnType("decimal(10,3)");
        builder.Property(m => m.QuantidadeDepois).HasColumnType("decimal(10,3)");

        builder.Property(m => m.CriadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(m => m.Produto)
            .WithMany(p => p.Movimentacoes)
            .HasForeignKey(m => m.ProdutoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(m => m.Usuario)
            .WithMany()
            .HasForeignKey(m => m.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
