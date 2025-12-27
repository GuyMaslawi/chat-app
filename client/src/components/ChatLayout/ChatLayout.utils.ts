export const DRAWER_WIDTH = 320;

export async function initializeLobbyRoom(initialRoomId?: string): Promise<string | null> {
  if (initialRoomId) {
    return initialRoomId;
  }
  const { getLobbyRoomId } = await import('@/lib/lobby');
  return getLobbyRoomId();
}
