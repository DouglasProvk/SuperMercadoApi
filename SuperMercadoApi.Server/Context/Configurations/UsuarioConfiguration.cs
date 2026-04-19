using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;
using CommonTemp.Models.Perfis;

namespace SuperMercadoApi.Server.Context.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<CommonTemp.Models.Perfis.Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("Usuarios");

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Nome)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(u => u.Email)
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(u => u.SenhaHash)
            .HasMaxLength(500)
            .IsRequired();

        builder.Property(u => u.Telefone).HasMaxLength(20);
        builder.Property(u => u.Foto).HasMaxLength(500);

        builder.Property(u => u.Ativo).HasDefaultValue(true);
        builder.Property(u => u.CriadoEm).HasDefaultValueSql("GETUTCDATE()");
        builder.Property(u => u.AtualizadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(u => u.Email).IsUnique();

        builder.HasOne(u => u.Supermercado)
            .WithMany(s => s.Usuarios)
            .HasForeignKey(u => u.SupermercadoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(u => u.Perfil)
            .WithMany(p => p.Usuarios)
            .HasForeignKey(u => u.PerfilId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
