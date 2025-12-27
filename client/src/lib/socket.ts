'use client';

import { io, Socket } from 'socket.io-client';
import { getToken, isTokenExpired, logout } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const token = getToken();
    
    if (!token || isTokenExpired(token)) {
      logout();
      throw new Error('Token expired or missing');
    }
    
    socket = io(API_URL, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      
      if (error.message.includes('Authentication required') || 
          error.message.includes('Invalid authentication token')) {
        
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          logout();
        }
      }
    });

    
    socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        
        
        
      }
    });

    
    socket.on('error', (error: { message?: string; code?: string }) => {
      console.error('Socket error:', error);
      if (error.code === 'UNAUTHORIZED' || error.message?.includes('Authentication required')) {
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          logout();
        }
      }
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

