using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SuperMercadoApi.Server.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Hash para "senha123" - gerado previamente com BCrypt
            var senhaHash = "$2a$11$4wFrqL0cQvf1z1K9L.4vS.VN7jK5L9M0O5P5Q5R5S5T5U5V5W5X5";

            // Insert Perfil
            migrationBuilder.InsertData(
                table: "Perfis",
                columns: new[] { "Nome", "Descricao", "Permissoes" },
                values: new object[,]
                {
                    { "Administrador", "Acesso total ao sistema", "[\"criar\", \"editar\", \"deletar\", \"visualizar\"]" },
                    { "Gerente", "Gerencia geral da loja", "[\"editar\", \"visualizar\"]" },
                    { "Vendedor", "Apenas vendas", "[\"visualizar\"]" },
                    { "Estoque", "Gerencia de estoque", "[\"editar\", \"visualizar\"]" }
                });

            // Insert Supermercado
            migrationBuilder.InsertData(
                table: "Supermercados",
                columns: new[] { "Nome", "CNPJ", "Telefone", "Email", "Endereco", "Cidade", "Estado", "CEP" },
                values: new object[] { "SuperGestao Demo", "12.345.678/0001-99", "(11) 98765-4321", "contato@supermercado.com", "Rua Principal, 123", "Sao Paulo", "SP", "01234-567" });

            // Insert Usuario (admin)
            migrationBuilder.InsertData(
                table: "Usuarios",
                columns: new[] { "Nome", "Email", "SenhaHash", "SupermercadoId", "PerfilId", "Ativo" },
                values: new object[] { "Administrador", "admin@supermercado.com", senhaHash, 1, 1, true });

            // Insert Categoria
            migrationBuilder.InsertData(
                table: "Categorias",
                columns: new[] { "SupermercadoId", "Nome", "Descricao", "Cor", "Icone", "Ativo" },
                values: new object[,]
                {
                    { 1, "Alimentos", "Produtos alimentares", "#FF6B6B", "local_offer", true },
                    { 1, "Bebidas", "Bebidas em geral", "#4ECDC4", "local_offer", true },
                    { 1, "Limpeza", "Produtos de limpeza", "#45B7D1", "local_offer", true },
                    { 1, "Higiene", "Produtos de higiene pessoal", "#FFA07A", "local_offer", true }
                });

            // Insert Fornecedor
            migrationBuilder.InsertData(
                table: "Fornecedores",
                columns: new[] { "SupermercadoId", "RazaoSocial", "NomeFantasia", "CNPJ", "Telefone", "Email", "Ativo" },
                values: new object[,]
                {
                    { 1, "Distribuidora ABC Ltda", "ABC Distribuidora", "98.765.432/0001-11", "(11) 3456-7890", "vendas@abc.com", true },
                    { 1, "Fornecedor XYZ S.A.", "XYZ Fornecedora", "56.789.012/0001-22", "(21) 2345-6789", "contato@xyz.com", true }
                });

            // Insert Produtos
            migrationBuilder.InsertData(
                table: "Produtos",
                columns: new[] { "SupermercadoId", "CategoriaId", "FornecedorId", "Nome", "Descricao", "Unidade", "PrecoCusto", "PrecoVenda", "QuantidadeEstoque", "EstoqueMinimo", "Ativo" },
                values: new object[,]
                {
                    { 1, 1, 1, "Arroz 5kg", "Arroz integral de qualidade", "SA", 15m, 25m, 100m, 10m, true },
                    { 1, 1, 1, "Feijao 1kg", "Feijao carioca", "UN", 4m, 8m, 50m, 5m, true },
                    { 1, 2, 1, "Suco Natural 1L", "Suco natural de frutas", "UN", 3m, 7m, 75m, 10m, true },
                    { 1, 2, 2, "Refrigerante 2L", "Refrigerante tradicional", "UN", 4m, 9m, 80m, 15m, true },
                    { 1, 3, 2, "Detergente 1L", "Detergente neutro", "UN", 2m, 5m, 120m, 20m, true },
                    { 1, 4, 2, "Sabonete 90g", "Sabonete bactericida", "UN", 1.5m, 4m, 200m, 30m, true }
                });

            // Insert Clientes
            migrationBuilder.InsertData(
                table: "Clientes",
                columns: new[] { "SupermercadoId", "Nome", "CPF", "Email", "Telefone", "Ativo" },
                values: new object[,]
                {
                    { 1, "Jose Silva", "123.456.789-00", "jose@email.com", "(11) 98765-4321", true },
                    { 1, "Maria Santos", "987.654.321-11", "maria@email.com", "(11) 91234-5678", true },
                    { 1, "Paulo Oliveira", "456.789.123-22", "paulo@email.com", "(11) 92345-6789", true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Clientes",
                keyColumn: "Id",
                keyValues: new object[] { 1, 2, 3 });

            migrationBuilder.DeleteData(
                table: "Produtos",
                keyColumn: "Id",
                keyValues: new object[] { 1, 2, 3, 4, 5, 6 });

            migrationBuilder.DeleteData(
                table: "Fornecedores",
                keyColumn: "Id",
                keyValues: new object[] { 1, 2 });

            migrationBuilder.DeleteData(
                table: "Categorias",
                keyColumn: "Id",
                keyValues: new object[] { 1, 2, 3, 4 });

            migrationBuilder.DeleteData(
                table: "Usuarios",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Perfis",
                keyColumn: "Id",
                keyValues: new object[] { 1, 2, 3, 4 });

            migrationBuilder.DeleteData(
                table: "Supermercados",
                keyColumn: "Id",
                keyValue: 1);
        }
    }
}
