using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Perfis;

namespace SuperMercadoApi.Server.Context.Configurations;

public class PerfilConfiguration : IEntityTypeConfiguration<Perfil>
{
    public void Configure(EntityTypeBuilder<Perfil> builder)
    {
        builder.ToTable("Perfis");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Nome)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(p => p.Descricao).HasMaxLength(200);

        builder.Property(p => p.Permissoes)
            .HasColumnType("nvarchar(max)");

        builder.Property(p => p.CriadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(p => p.Nome).IsUnique();
    }
}
