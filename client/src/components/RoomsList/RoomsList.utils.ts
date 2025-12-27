import { getToken } from '@/lib/auth';

export function getRoomInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

export function getCurrentUserId(): string | null {
  try {
    const token = getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    }
  } catch {
    return null;
  }
  return null;
}

