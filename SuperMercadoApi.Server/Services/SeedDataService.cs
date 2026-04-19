using CommonTemp.Models.Perfis;
using CommonTemp.Models.Sistema;
using SuperMercadoApi.Server.Context;

namespace SuperMercadoApi.Server.Services
{
    public static class SeedDataService
    {
        public static void SeedDatabase(AppDbContext context)
        {
            try
            {
                // Se já existem dados, não faz seed novamente
                if (context.Supermercados.Any() || context.Usuarios.Any())
                {
                    return;
                }

                // 1. Criar Perfis
                var perfis = new List<Perfil>
                {
                    new Perfil
                    {
                        Nome = "Administrador",
                        Descricao = "Acesso total ao sistema",
                        Permissoes = "[\"criar\", \"editar\", \"deletar\", \"visualizar\"]"
                    },
                    new Perfil
                    {
                        Nome = "Gerente",
                        Descricao = "Gerencia geral da loja",
                        Permissoes = "[\"editar\", \"visualizar\"]"
                    },
                    new Perfil
                    {
                        Nome = "Vendedor",
                        Descricao = "Apenas vendas",
                        Permissoes = "[\"visualizar\"]"
                    },
                    new Perfil
                    {
                        Nome = "Estoque",
                        Descricao = "Gerencia de estoque",
                        Permissoes = "[\"editar\", \"visualizar\"]"
                    }
                };
                context.Perfis.AddRange(perfis);
                context.SaveChanges();

                // 2. Criar Supermercado
                var supermercado = new Supermercado
                {
                    Nome = "SuperGestao Demo",
                    CNPJ = "12.345.678/0001-99",
                    Telefone = "(11) 98765-4321",
                    Email = "contato@supermercado.com",
                    Endereco = "Rua Principal, 123",
                    Cidade = "Sao Paulo",
                    Estado = "SP",
                    CEP = "01234-567",
                    Ativo = true
                };
                context.Supermercados.Add(supermercado);
                context.SaveChanges();

                // 3. Criar Usuario Admin
                var senhaHash = BCrypt.Net.BCrypt.HashPassword("senha123");
                var usuario = new Usuario
                {
                    Nome = "Administrador",
                    Email = "admin@supermercado.com",
                    SenhaHash = senhaHash,
                    SupermercadoId = supermercado.Id,
                    PerfilId = perfis.First(p => p.Nome == "Administrador").Id,
                    Ativo = true
                };
                context.Usuarios.Add(usuario);
                context.SaveChanges();

                // 4. Criar Categorias
                var categorias = new List<Categoria>
                {
                    new Categoria { SupermercadoId = supermercado.Id, Nome = "Alimentos", Descricao = "Produtos alimentares", Cor = "#FF6B6B", Icone = "local_offer", Ativo = true },
                    new Categoria { SupermercadoId = supermercado.Id, Nome = "Bebidas", Descricao = "Bebidas em geral", Cor = "#4ECDC4", Icone = "local_offer", Ativo = true },
                    new Categoria { SupermercadoId = supermercado.Id, Nome = "Limpeza", Descricao = "Produtos de limpeza", Cor = "#45B7D1", Icone = "local_offer", Ativo = true },
                    new Categoria { SupermercadoId = supermercado.Id, Nome = "Higiene", Descricao = "Produtos de higiene pessoal", Cor = "#FFA07A", Icone = "local_offer", Ativo = true }
                };
                context.Categorias.AddRange(categorias);
                context.SaveChanges();

                // 5. Criar Fornecedores
                var fornecedores = new List<Fornecedor>
                {
                    new Fornecedor
                    {
                        SupermercadoId = supermercado.Id,
                        RazaoSocial = "Distribuidora ABC Ltda",
                        NomeFantasia = "ABC Distribuidora",
                        CNPJ = "98.765.432/0001-11",
                        Telefone = "(11) 3456-7890",
                        Email = "vendas@abc.com",
                        Ativo = true
                    },
                    new Fornecedor
                    {
                        SupermercadoId = supermercado.Id,
                        RazaoSocial = "Fornecedor XYZ S.A.",
                        NomeFantasia = "XYZ Fornecedora",
                        CNPJ = "56.789.012/0001-22",
                        Telefone = "(21) 2345-6789",
                        Email = "contato@xyz.com",
                        Ativo = true
                    }
                };
                context.Fornecedores.AddRange(fornecedores);
                context.SaveChanges();

                // 6. Criar Produtos
                var produtos = new List<Produto>
                {
                    new Produto
                    {
                        SupermercadoId = supermercado.Id,
                        CategoriaId = categorias[0].Id,
                        FornecedorId = fornecedores[0].Id,
                        Nome = "Arroz 5kg",
                        Descricao = "Arroz integral de qualidade",
                        Unidade = "SA",
                        PrecoCusto = 15m,
                        PrecoVenda = 25m,
                        QuantidadeEstoque = 100m,
                        EstoqueMinimo = 10m,
                        Ativo = true
                    },
                    new Produto
                    {
                        SupermercadoId = supermercado.Id,
                        CategoriaId = categorias[0].Id,
                        FornecedorId = fornecedores[0].Id,
                        Nome = "Feijao 1kg",
                        Descricao = "Feijao carioca",
                        Unidade = "UN",
                        PrecoCusto = 4m,
                        PrecoVenda = 8m,
                        QuantidadeEstoque = 50m,
                        EstoqueMinimo = 5m,
                        Ativo = true
                    },
                    new Produto
                    {
                        SupermercadoId = supermercado.Id,
                        CategoriaId = categorias[1].Id,
                        FornecedorId = fornecedores[0].Id,
                        Nome = "Suco Natural 1L",
                        Descricao = "Suco natural de frutas",
                        Unidade = "UN",
                        PrecoCusto = 3m,
                        PrecoVenda = 7m,
                        QuantidadeEstoque = 75m,
                        EstoqueMinimo = 10m,
                        Ativo = true
                    },
                    new Produto
                    {
                        SupermercadoId = supermercado.Id,
                        CategoriaId = categorias[1].Id,
                        FornecedorId = fornecedores[1].Id,
                        Nome = "Refrigerante 2L",
                        Descricao = "Refrigerante tradicional",
                        Unidade = "UN",
                        PrecoCusto = 4m,
                        PrecoVenda = 9m,
                        QuantidadeEstoque = 80m,
                        EstoqueMinimo = 15m,
                        Ativo = true
                    },
                    new Produto
                    {
                        SupermercadoId = supermercado.Id,
                        CategoriaId = categorias[2].Id,
                        FornecedorId = fornecedores[1].Id,
                        Nome = "Detergente 1L",
                        Descricao = "Detergente neutro",
                        Unidade = "UN",
                        PrecoCusto = 2m,
                        PrecoVenda = 5m,
                        QuantidadeEstoque = 120m,
                        EstoqueMinimo = 20m,
                        Ativo = true
                    },
                    new Produto
                    {
                        SupermercadoId = supermercado.Id,
                        CategoriaId = categorias[3].Id,
                        FornecedorId = fornecedores[1].Id,
                        Nome = "Sabonete 90g",
                        Descricao = "Sabonete bactericida",
                        Unidade = "UN",
                        PrecoCusto = 1.5m,
                        PrecoVenda = 4m,
                        QuantidadeEstoque = 200m,
                        EstoqueMinimo = 30m,
                        Ativo = true
                    }
                };
                context.Produtos.AddRange(produtos);
                context.SaveChanges();

                // 7. Criar Clientes
                var clientes = new List<Cliente>
                {
                    new Cliente
                    {
                        SupermercadoId = supermercado.Id,
                        Nome = "Jose Silva",
                        CPF = "123.456.789-00",
                        Email = "jose@email.com",
                        Telefone = "(11) 98765-4321",
                        Ativo = true
                    },
                    new Cliente
                    {
                        SupermercadoId = supermercado.Id,
                        Nome = "Maria Santos",
                        CPF = "987.654.321-11",
                        Email = "maria@email.com",
                        Telefone = "(11) 91234-5678",
                        Ativo = true
                    },
                    new Cliente
                    {
                        SupermercadoId = supermercado.Id,
                        Nome = "Paulo Oliveira",
                        CPF = "456.789.123-22",
                        Email = "paulo@email.com",
                        Telefone = "(11) 92345-6789",
                        Ativo = true
                    }
                };
                context.Clientes.AddRange(clientes);
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao fazer seed dos dados: {ex.Message}");
            }
        }
    }
}
