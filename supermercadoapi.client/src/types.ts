// Auth Types
export interface LoginRequest {
  email: string;
  senha: string;
}

export interface UsuarioDto {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  foto?: string;
  perfil: string;
  permissoes: string[];
  supermercadoId: number;
  supermercado: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiracao: string;
  usuario: UsuarioDto;
}

// Dashboard Types
export interface VendaDiaDto {
  data: string;
  total: number;
  qtd: number;
}

export interface AlertaDto {
  id?: number;
  tipo: string;
  nivel: 'warning' | 'danger' | 'info' | 'success';
  mensagem: string;
  descricao?: string;
  data?: string;
}

export interface DashboardDto {
  vendaHoje: number;
  vendaMes: number;
  totalProdutos: number;
  totalClientes: number;
  estoqueBaixo: number;
  vendasUltimos7Dias: VendaDiaDto[];
  alertas: AlertaDto[];
  movimentacoes: {
    entrada: number;
    saida: number;
  };
}

// Produto Types
export interface ProdutoDto {
  id: number;
  nome: string;
  descricao?: string;
  precoCusto: number;
  precoVenda: number;
  precoPromocao?: number;
  quantidadeEstoque: number;
  categoriaId?: number;
  imagem?: string;
  codigoBarras?: string;
  ativo: boolean;
}

// Venda Types
export interface VendaDto {
  id: number;
  numeroVenda: string;
  status: string;
  subtotal: number;
  desconto: number;
  total: number;
  dataCriacao: string;
  clienteId?: number;
  usuarioId: number;
}

// Cliente Types
export interface ClienteDto {
  id: number;
  nome: string;
  email?: string;
  cpf?: string;
  telefone?: string;
  ativo: boolean;
}

// Estoque Types
export interface MovimentacaoEstoqueDto {
  id: number;
  produtoId: number;
  tipo: 'Entrada' | 'Saida' | 'Ajuste';
  quantidade: number;
  motivo?: string;
  dataCriacao: string;
}

// Financeiro Types
export interface ContaDto {
  id: number;
  tipo: 'Receita' | 'Despesa';
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
}
