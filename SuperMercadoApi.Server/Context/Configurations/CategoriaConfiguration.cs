using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SuperMercadoApi.Server.Context.Configurations;

public class CategoriaConfiguration : IEntityTypeConfiguration<Categoria>
{
    public void Configure(EntityTypeBuilder<Categoria> builder)
    {
        builder.ToTable("Categorias");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Nome)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.Descricao).HasMaxLength(300);
        builder.Property(c => c.Cor).HasMaxLength(7);
        builder.Property(c => c.Icone).HasMaxLength(50);

        builder.Property(c => c.Ativo).HasDefaultValue(true);
        builder.Property(c => c.CriadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(c => c.Supermercado)
            .WithMany(s => s.Categorias)
            .HasForeignKey(c => c.SupermercadoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
