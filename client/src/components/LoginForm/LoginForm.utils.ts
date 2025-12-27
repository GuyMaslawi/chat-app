export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getGoogleAuthUrl(): string {
  return `${API_URL}/auth/google`;
}

export function getMicrosoftAuthUrl(): string {
  return `${API_URL}/auth/microsoft`;
}

