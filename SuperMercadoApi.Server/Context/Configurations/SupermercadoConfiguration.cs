using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SupermercadoPro.API.Data.Configurations;

public class SupermercadoConfiguration : IEntityTypeConfiguration<Supermercado>
{
    public void Configure(EntityTypeBuilder<Supermercado> builder)
    {
        builder.ToTable("Supermercados");

        builder.HasKey(s => s.Id);

        builder.Property(s => s.Nome)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(s => s.CNPJ)
            .HasMaxLength(18)
            .IsRequired();

        builder.Property(s => s.Telefone).HasMaxLength(20);
        builder.Property(s => s.Email).HasMaxLength(150);
        builder.Property(s => s.Endereco).HasMaxLength(300);
        builder.Property(s => s.Cidade).HasMaxLength(100);
        builder.Property(s => s.Estado).HasMaxLength(2);
        builder.Property(s => s.CEP).HasMaxLength(10);
        builder.Property(s => s.Logo).HasMaxLength(500);

        builder.Property(s => s.Ativo).HasDefaultValue(true);
        builder.Property(s => s.CriadoEm).HasDefaultValueSql("GETUTCDATE()");
        builder.Property(s => s.AtualizadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(s => s.CNPJ).IsUnique();
    }
}
