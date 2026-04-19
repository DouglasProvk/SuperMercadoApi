using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SuperMercadoApi.Server.Context.Configurations;

public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> builder)
    {
        builder.ToTable("Clientes");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Nome)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(c => c.CPF).HasMaxLength(14);
        builder.Property(c => c.Email).HasMaxLength(150);
        builder.Property(c => c.Telefone).HasMaxLength(20);
        builder.Property(c => c.Endereco).HasMaxLength(300);
        builder.Property(c => c.Cidade).HasMaxLength(100);
        builder.Property(c => c.Estado).HasMaxLength(2);

        builder.Property(c => c.PontosAcumulados).HasDefaultValue(0);
        builder.Property(c => c.Ativo).HasDefaultValue(true);
        builder.Property(c => c.CriadoEm).HasDefaultValueSql("GETUTCDATE()");
        builder.Property(c => c.AtualizadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(c => c.Supermercado)
            .WithMany(s => s.Clientes)
            .HasForeignKey(c => c.SupermercadoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
