import { Message } from '@/lib/api';

export function isOwnMessage(msg: Message, currentUserId: string | null): boolean {
  return currentUserId === msg.userId;
}

export function getUserMessageColor(userId: string, currentUserId: string | null, themeMode: 'light' | 'dark') {
  if (userId === currentUserId) {
    return null;
  }

  const lightModeColors = [
    { bg: '#e0f2fe', border: '#0ea5e9', text: '#0c4a6e' },
    { bg: '#fce7f3', border: '#ec4899', text: '#831843' },
    { bg: '#f0fdf4', border: '#22c55e', text: '#14532d' },
    { bg: '#fef3c7', border: '#f59e0b', text: '#78350f' },
    { bg: '#ede9fe', border: '#8b5cf6', text: '#4c1d95' },
    { bg: '#fecdd3', border: '#f43f5e', text: '#881337' },
    { bg: '#cffafe', border: '#06b6d4', text: '#164e63' },
    { bg: '#ddd6fe', border: '#7c3aed', text: '#3b0764' },
  ];

  const darkModeColors = [
    { bg: '#0c4a6e', border: '#0ea5e9', text: '#e0f2fe' },
    { bg: '#831843', border: '#ec4899', text: '#fce7f3' },
    { bg: '#14532d', border: '#22c55e', text: '#f0fdf4' },
    { bg: '#78350f', border: '#f59e0b', text: '#fef3c7' },
    { bg: '#4c1d95', border: '#8b5cf6', text: '#ede9fe' },
    { bg: '#881337', border: '#f43f5e', text: '#fecdd3' },
    { bg: '#164e63', border: '#06b6d4', text: '#cffafe' },
    { bg: '#3b0764', border: '#7c3aed', text: '#ddd6fe' },
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = themeMode === 'dark' ? darkModeColors : lightModeColors;
  const index = Math.abs(hash) % colors.length;
  
  return colors[index];
}

export function getRoomId(room: { id?: string; _id?: string } | null | undefined): string | null {
  if (!room) return null;
  return (room as any).id || (room as any)._id || null;
}

