export interface User {
  userId: string;
  username: string;
  name?: string;
  photoUrl?: string;
  isOnline: boolean;
}

export function buildUsersList(
  participants: string[],
  onlineUsers: { userId: string; username: string; name?: string; photoUrl?: string }[],
  isLobby: boolean
): User[] {
  const onlineUserIds = new Set(onlineUsers.map((u) => u.userId));

  if (isLobby) {
    return onlineUsers.map((onlineUser) => ({
      userId: onlineUser.userId,
      username: onlineUser.username,
      name: onlineUser.name,
      photoUrl: onlineUser.photoUrl,
      isOnline: true,
    }));
  }

  return participants.map((participantId) => {
    const onlineUser = onlineUsers.find((u) => u.userId === participantId);
    return {
      userId: participantId,
      username: onlineUser?.username || `User ${participantId.slice(0, 6)}`,
      name: onlineUser?.name,
      photoUrl: onlineUser?.photoUrl,
      isOnline: onlineUserIds.has(participantId),
    };
  });
}

