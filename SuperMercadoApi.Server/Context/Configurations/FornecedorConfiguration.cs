using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SuperMercadoApi.Server.Context.Configurations;

public class FornecedorConfiguration : IEntityTypeConfiguration<Fornecedor>
{
    public void Configure(EntityTypeBuilder<Fornecedor> builder)
    {
        builder.ToTable("Fornecedores");

        builder.HasKey(f => f.Id);

        builder.Property(f => f.RazaoSocial)
            .HasMaxLength(200)
            .IsRequired();

        builder.Property(f => f.NomeFantasia).HasMaxLength(200);
        builder.Property(f => f.CNPJ).HasMaxLength(18);
        builder.Property(f => f.Telefone).HasMaxLength(20);
        builder.Property(f => f.Email).HasMaxLength(150);
        builder.Property(f => f.Contato).HasMaxLength(100);
        builder.Property(f => f.Endereco).HasMaxLength(300);
        builder.Property(f => f.Cidade).HasMaxLength(100);
        builder.Property(f => f.Estado).HasMaxLength(2);

        builder.Property(f => f.Ativo).HasDefaultValue(true);
        builder.Property(f => f.CriadoEm).HasDefaultValueSql("GETUTCDATE()");
        builder.Property(f => f.AtualizadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(f => f.Supermercado)
            .WithMany(s => s.Fornecedores)
            .HasForeignKey(f => f.SupermercadoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
