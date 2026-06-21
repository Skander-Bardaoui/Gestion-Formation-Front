import { api } from './client';

export type LoginDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    nom: string;
    prenom: string;
    telephone?: string;
  };
};

export type User = {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive?: boolean;
  nom: string;
  prenom: string;
  telephone?: string;
};

export async function login(dto: LoginDto): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/login', dto);
}

export async function register(dto: { username: string; email: string; password: string; role?: string }): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/register', dto);
}

export async function refresh(refreshToken: string): Promise<AuthResponse> {
  return api.post<AuthResponse>('/auth/refresh', { refreshToken });
}

export async function getProfile(): Promise<User> {
  return api.get<User>('/auth/profile');
}

export async function updateProfile(dto: { username?: string; nom?: string; prenom?: string; telephone?: string }): Promise<User> {
  return api.patch<User>('/auth/profile', dto);
}

export async function changePassword(dto: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
  return api.post<{ message: string }>('/auth/change-password', dto);
}

export async function logout(): Promise<void> {
  return api.post('/auth/logout');
}
