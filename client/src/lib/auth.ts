'use client';

export interface User {
  id: string;
  username: string;
  email: string;
  name?: string;
  photoUrl?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

interface JwtPayload {
  exp: number;
  sub: string;
  username: string;
  email?: string;
  name?: string;
  photoUrl?: string;
}

function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function getTokenExpirationTime(token: string | null): number | null {
  if (!token) return null;
  
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) return null;
  
  return payload.exp;
}

export function isTokenExpiringSoon(token: string | null, bufferSeconds: number = 60): boolean {
  if (!token) return true;
  
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const timeUntilExpiration = expirationTime - currentTime;
  
  return timeUntilExpiration < bufferSeconds;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

export function logout() {
  removeToken();
  
  
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export async function getServerSession(): Promise<User | null> {
  return null;
}

export async function refreshToken(): Promise<boolean> {
  try {
    const { authApi } = await import('./api');
    const response = await authApi.refresh();
    setToken(response.access_token);
    return true;
  } catch (error) {
    return false;
  }
}

export function getCurrentUser(): User | null {
  const token = getToken();
  if (!token) return null;
  
  const payload = decodeJwt(token);
  if (!payload) return null;
  
  return {
    id: payload.sub,
    username: payload.username,
    email: payload.email || '',
    name: payload.name,
    photoUrl: payload.photoUrl,
  };
}

