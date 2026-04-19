using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SuperMercadoApi.Server.Context.Configurations;

public class ContaConfiguration : IEntityTypeConfiguration<Conta>
{
    public void Configure(EntityTypeBuilder<Conta> builder)
    {
        builder.ToTable("Contas");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Tipo)
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(c => c.Descricao)
            .HasMaxLength(300)
            .IsRequired();

        builder.Property(c => c.Status)
            .HasMaxLength(20)
            .HasDefaultValue("Pendente");

        builder.Property(c => c.FormaPagamento).HasMaxLength(50);
        builder.Property(c => c.Observacoes).HasMaxLength(500);

        builder.Property(c => c.Valor).HasColumnType("decimal(10,2)");

        builder.Property(c => c.CriadoEm).HasDefaultValueSql("GETUTCDATE()");
        builder.Property(c => c.AtualizadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(c => c.Supermercado)
            .WithMany()
            .HasForeignKey(c => c.SupermercadoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Fornecedor)
            .WithMany()
            .HasForeignKey(c => c.FornecedorId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(c => c.Cliente)
            .WithMany()
            .HasForeignKey(c => c.ClienteId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
    public void Configure(EntityTypeBuilder<RefreshToken> builder)
    {
        builder.ToTable("RefreshTokens");

        builder.HasKey(r => r.Id);

        builder.Property(r => r.Token)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(r => r.Revogado).HasDefaultValue(false);
        builder.Property(r => r.CriadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(r => r.Token).IsUnique();

        builder.HasOne(r => r.Usuario)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(r => r.UsuarioId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
