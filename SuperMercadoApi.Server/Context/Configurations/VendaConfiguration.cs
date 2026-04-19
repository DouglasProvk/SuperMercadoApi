using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CommonTemp.Models.Sistema;

namespace SupermercadoPro.API.Data.Configurations;

public class VendaConfiguration : IEntityTypeConfiguration<Venda>
{
    public void Configure(EntityTypeBuilder<Venda> builder)
    {
        builder.ToTable("Vendas");

        builder.HasKey(v => v.Id);

        builder.Property(v => v.NumeroVenda)
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(v => v.Status)
            .HasMaxLength(20)
            .HasDefaultValue("Aberta");

        builder.Property(v => v.FormaPagamento).HasMaxLength(50);
        builder.Property(v => v.Observacoes).HasMaxLength(500);
        builder.Property(v => v.MotivoCancelamento).HasMaxLength(300);

        builder.Property(v => v.Subtotal).HasColumnType("decimal(10,2)").HasDefaultValue(0);
        builder.Property(v => v.Desconto).HasColumnType("decimal(10,2)").HasDefaultValue(0);
        builder.Property(v => v.Acrescimo).HasColumnType("decimal(10,2)").HasDefaultValue(0);
        builder.Property(v => v.Total).HasColumnType("decimal(10,2)").HasDefaultValue(0);
        builder.Property(v => v.ValorPago).HasColumnType("decimal(10,2)");
        builder.Property(v => v.Troco).HasColumnType("decimal(10,2)");

        builder.Property(v => v.CriadoEm).HasDefaultValueSql("GETUTCDATE()");

        builder.HasIndex(v => v.SupermercadoId);
        builder.HasIndex(v => v.CriadoEm);

        builder.HasOne(v => v.Supermercado)
            .WithMany(s => s.Vendas)
            .HasForeignKey(v => v.SupermercadoId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(v => v.Cliente)
            .WithMany(c => c.Vendas)
            .HasForeignKey(v => v.ClienteId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(v => v.Usuario)
            .WithMany()
            .HasForeignKey(v => v.UsuarioId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}

public class ItemVendaConfiguration : IEntityTypeConfiguration<ItemVenda>
{
    public void Configure(EntityTypeBuilder<ItemVenda> builder)
    {
        builder.ToTable("ItensVenda");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Quantidade).HasColumnType("decimal(10,3)");
        builder.Property(i => i.PrecoUnitario).HasColumnType("decimal(10,2)");
        builder.Property(i => i.Desconto).HasColumnType("decimal(10,2)").HasDefaultValue(0);
        builder.Property(i => i.Subtotal).HasColumnType("decimal(10,2)");

        builder.Property(i => i.EmPromocao).HasDefaultValue(false);

        builder.HasOne(i => i.Venda)
            .WithMany(v => v.Itens)
            .HasForeignKey(i => i.VendaId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Produto)
            .WithMany()
            .HasForeignKey(i => i.ProdutoId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
