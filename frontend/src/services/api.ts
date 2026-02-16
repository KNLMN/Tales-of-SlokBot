import axios, { AxiosInstance } from 'axios';
import type { AuthResponse, Character, Class, Ability, ApiResponse } from '../types';

const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3001/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(email: string, password: string, telegram_username?: string): Promise<AuthResponse> {
    const { data } = await this.api.post<ApiResponse<AuthResponse>>('/auth/register', {
      email,
      password,
      telegram_username,
    });
    if (data.data) {
      localStorage.setItem('token', data.data.token);
    }
    return data.data!;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await this.api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password,
    });
    if (data.data) {
      localStorage.setItem('token', data.data.token);
    }
    return data.data!;
  }

  async getMe(): Promise<{ user: any; character: Character | null }> {
    const { data } = await this.api.get<ApiResponse>('/auth/me');
    return data.data!;
  }

  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  // Class endpoints
  async getClasses(): Promise<Class[]> {
    const { data } = await this.api.get<ApiResponse<Class[]>>('/classes');
    return data.data!;
  }

  async getClass(id: string): Promise<Class> {
    const { data } = await this.api.get<ApiResponse<Class>>(`/classes/${id}`);
    return data.data!;
  }

  // Character endpoints
  async createCharacter(name: string, class_id: string, avatar_color?: string): Promise<Character> {
    const { data } = await this.api.post<ApiResponse<Character>>('/characters', {
      name,
      class_id,
      avatar_color,
    });
    return data.data!;
  }

  async getMyCharacter(): Promise<Character> {
    const { data } = await this.api.get<ApiResponse<Character>>('/characters/me');
    return data.data!;
  }

  async getCharacter(id: string): Promise<Character> {
    const { data } = await this.api.get<ApiResponse<Character>>(`/characters/${id}`);
    return data.data!;
  }

  async deleteCharacter(): Promise<void> {
    await this.api.delete('/characters/me');
  }

  async getMyAbilities(): Promise<Ability[]> {
    const { data } = await this.api.get<ApiResponse<Ability[]>>('/characters/me/abilities');
    return data.data!;
  }

  // Ability endpoints
  async getAbilitiesByClass(classId: string): Promise<Ability[]> {
    const { data } = await this.api.get<ApiResponse<Ability[]>>(`/abilities/class/${classId}`);
    return data.data!;
  }

  // Leaderboard endpoints
  async getLeaderboardXP(): Promise<any[]> {
    const { data } = await this.api.get<ApiResponse<any[]>>('/leaderboards/xp');
    return data.data!;
  }

  async getLeaderboardSlokjes(): Promise<any[]> {
    const { data } = await this.api.get<ApiResponse<any[]>>('/leaderboards/slokjes');
    return data.data!;
  }

  // Combat endpoints
  async startPvECombat(enemyType: string): Promise<any> {
    const { data } = await this.api.post<ApiResponse<any>>('/combat/pve', { enemyType });
    return data.data!;
  }

  async getCombatHistory(): Promise<any[]> {
    const { data } = await this.api.get<ApiResponse<any[]>>('/combat/history');
    return data.data!;
  }
}

export default new ApiService();
