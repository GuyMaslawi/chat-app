'use client';

import { getSocket } from './socket';
import { RoomListResponse } from './socket.types';

/**
 * Gets the lobby room ID by requesting the room list and finding the lobby
 * @returns Promise that resolves to the lobby room ID, or null if not found
 */
export async function getLobbyRoomId(): Promise<string | null> {
  return new Promise((resolve) => {
    const socket = getSocket();
    
    
    const waitForConnection = () => {
      if (socket.connected) {
        requestRoomList();
      } else {
        
        socket.once('connect', () => {
          requestRoomList();
        });
        
        setTimeout(() => {
          socket.off('connect', requestRoomList);
          resolve(null);
        }, 5000);
      }
    };
    
    const requestRoomList = () => {
      
      const handleRoomList = (data: RoomListResponse) => {
        socket.off('room:list', handleRoomList);
        const lobby = data.rooms.find(room => room.isLobby);
        resolve(lobby?.id || null);
      };
      
      socket.on('room:list', handleRoomList);
      socket.emit('room:list');
      
      
      setTimeout(() => {
        socket.off('room:list', handleRoomList);
        resolve(null);
      }, 5000);
    };
    
    waitForConnection();
  });
}

