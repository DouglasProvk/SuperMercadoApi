export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  usuario: UsuarioDto;
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
  supermercadoNome: string;
}

export interface DashboardDto {
  vendasHoje: number;
  qtdVendasHoje: number;
  vendasMes: number;
  totalProdutos: number;
  produtosEstoqueBaixo: number;
  produtosVencendo: number;
  totalClientes: number;
  contasVencer7Dias: number;
  graficoVendas: VendaDiaDto[];
  alertas: AlertaDto[];
}

export interface VendaDiaDto {
  data: string;
  total: number;
  qtd: number;
}

export interface AlertaDto {
  tipo: string;
  mensagem: string;
  nivel: string;
  refId?: number;
}

export interface ProdutoDto {
  id: number;
  nome: string;
  codigoBarras?: string;
  descricao?: string;
  imagem?: string;
  precoCusto: number;
  precoVenda: number;
  precoPromocao?: number;
  quantidadeEstoque: number;
  estoqueMinimo: number;
  categoria: string;
  ativo: boolean;
}

export interface VendaDto {
  id: number;
  numeroVenda: string;
  status: string;
  clienteId?: number;
  clienteNome?: string;
  usuarioNome: string;
  subtotal: number;
  desconto: number;
  acrescimo: number;
  total: number;
  formaPagamento?: string;
  valorPago?: number;
  troco?: number;
  itens: ItemVendaDto[];
  criadoEm: string;
  finalizadoEm?: string;
}

export interface ItemVendaDto {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  subtotal: number;
  emPromocao: boolean;
}
