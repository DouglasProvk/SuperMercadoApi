import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { LoginRequest, LoginResponse, DashboardDto } from '../types';
import { API_CONFIG } from '../config';

class ApiService {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Load token from localStorage
    this.accessToken = localStorage.getItem('accessToken');
    if (this.accessToken) {
      this.setAuthHeader(this.accessToken);
    }

    // Interceptor para requisições
    this.client.interceptors.request.use((config) => {
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`;
      }
      return config;
    });

    // Interceptor para respostas
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expirado - fazer logout
          this.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private setAuthHeader(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', credentials);
    this.accessToken = response.data.accessToken;
    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario));
    this.setAuthHeader(this.accessToken);
    return response.data;
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    delete this.client.defaults.headers.common['Authorization'];
  }

  async getDashboard(): Promise<DashboardDto> {
    const response = await this.client.get<DashboardDto>('/dashboard');
    return response.data;
  }

  async getProdutos(pagina = 1, tamanho = 20) {
    const response = await this.client.get('/produtos', {
      params: { pagina, tamanho },
    });
    return response.data;
  }

  async getVendas(pagina = 1, tamanho = 20) {
    const response = await this.client.get('/vendas', {
      params: { pagina, tamanho },
    });
    return response.data;
  }

  async getClientes(pagina = 1, tamanho = 20, busca?: string) {
    const response = await this.client.get('/clientes', {
      params: { pagina, tamanho, busca },
    });
    return response.data;
  }

  async getEstoque(pagina = 1, tamanho = 20) {
    const response = await this.client.get('/estoque', {
      params: { pagina, tamanho },
    });
    return response.data;
  }

  async getFinanceiro(pagina = 1, tamanho = 20) {
    const response = await this.client.get('/financeiro', {
      params: { pagina, tamanho },
    });
    return response.data;
  }

  getClient() {
    return this.client;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getUsuario() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
}

export default new ApiService();
