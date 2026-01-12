import { apiClient } from './api-client';
import { AuthResponse } from './auth';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface Room {
  _id: string;
  name: string;
  participants: string[];
  createdBy?: string;
  createdAt: string;
}

export interface OnlineUser {
  userId: string;
  username: string;
  name?: string;
  photoUrl?: string;
  socketId: string;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface RefreshResponse {
  access_token: string;
}

export const authApi = {
  register: (data: RegisterDto) => apiClient.post<AuthResponse>('/auth/register', data),
  login: (data: LoginDto) => apiClient.post<AuthResponse>('/auth/login', data),
  refresh: () => apiClient.post<RefreshResponse>('/auth/refresh'),
};

export const roomsApi = {
  getAll: () => apiClient.get<Room[]>('/rooms'),
  getById: (id: string) => apiClient.get<Room>(`/rooms/${id}`),
  create: (name: string) => apiClient.post<Room>('/rooms', { name }),
  join: (id: string) => apiClient.post<Room>(`/rooms/${id}/join`),
  update: (id: string, name: string) => apiClient.put<Room>(`/rooms/${id}`, { name }),
  delete: (id: string) => apiClient.delete<Room>(`/rooms/${id}`),
};

export const messagesApi = {
  getByRoom: (roomId: string) => apiClient.get<Message[]>(`/rooms/${roomId}/messages`),
  create: (roomId: string, content: string) =>
    apiClient.post<Message>(`/rooms/${roomId}/messages`, { content }),
};

