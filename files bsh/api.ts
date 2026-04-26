import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

// Token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { token: refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api.request(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, senha: string) =>
    api.post('/auth/login', { email, senha }).then((r) => r.data),
  logout: (token: string) => api.post('/auth/logout', { token }),
};

export const dashboardApi = {
  get: () => api.get('/dashboard').then((r) => r.data),
};

export const produtosApi = {
  listar: (params?: Record<string, unknown>) =>
    api.get('/produtos', { params }).then((r) => r.data),
  obter: (id: number) => api.get(`/produtos/${id}`).then((r) => r.data),
  criar: (data: unknown) => api.post('/produtos', data).then((r) => r.data),
  atualizar: (id: number, data: unknown) =>
    api.put(`/produtos/${id}`, data).then((r) => r.data),
  deletar: (id: number) => api.delete(`/produtos/${id}`),
  promocao: (id: number, data: unknown) =>
    api.patch(`/produtos/${id}/promocao`, data),
  alertas: () => api.get('/produtos/alertas').then((r) => r.data),
};

export const estoqueApi = {
  movimentar: (data: unknown) =>
    api.post('/estoque/movimentar', data).then((r) => r.data),
  historico: (produtoId: number, pagina = 1) =>
    api.get(`/estoque/historico/${produtoId}`, { params: { pagina } }).then((r) => r.data),
  historicoGeral: (de?: string, ate?: string) =>
    api.get('/estoque/historico', { params: { de, ate } }).then((r) => r.data),
};

export const vendasApi = {
  listar: (params?: Record<string, unknown>) =>
    api.get('/vendas', { params }).then((r) => r.data),
  obter: (id: number) => api.get(`/vendas/${id}`).then((r) => r.data),
  abrir: (data: unknown) => api.post('/vendas', data).then((r) => r.data),
  adicionarItem: (vendaId: number, data: unknown) =>
    api.post(`/vendas/${vendaId}/itens`, data).then((r) => r.data),
  removerItem: (vendaId: number, itemId: number) =>
    api.delete(`/vendas/${vendaId}/itens/${itemId}`).then((r) => r.data),
  finalizar: (vendaId: number, data: unknown) =>
    api.post(`/vendas/${vendaId}/finalizar`, data).then((r) => r.data),
  cancelar: (vendaId: number, data: unknown) =>
    api.post(`/vendas/${vendaId}/cancelar`, data).then((r) => r.data),
};

export const clientesApi = {
  listar: (params?: Record<string, unknown>) =>
    api.get('/clientes', { params }).then((r) => r.data),
  criar: (data: unknown) => api.post('/clientes', data).then((r) => r.data),
  atualizar: (id: number, data: unknown) =>
    api.put(`/clientes/${id}`, data).then((r) => r.data),
  deletar: (id: number) => api.delete(`/clientes/${id}`),
};

export const usuariosApi = {
  listar: () => api.get('/usuarios').then((r) => r.data),
  criar: (data: unknown) => api.post('/usuarios', data).then((r) => r.data),
  atualizar: (id: number, data: unknown) =>
    api.put(`/usuarios/${id}`, data).then((r) => r.data),
  deletar: (id: number) => api.delete(`/usuarios/${id}`),
  alterarSenha: (id: number, novaSenha: string) =>
    api.post(`/usuarios/${id}/senha`, { novaSenha }),
};

export const financeiroApi = {
  listar: (params?: Record<string, unknown>) =>
    api.get('/financeiro', { params }).then((r) => r.data),
  criar: (data: unknown) => api.post('/financeiro', data).then((r) => r.data),
  pagar: (id: number, data: unknown) =>
    api.post(`/financeiro/${id}/pagar`, data).then((r) => r.data),
  deletar: (id: number) => api.delete(`/financeiro/${id}`),
};

export default api;
