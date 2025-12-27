'use client';

import { ChatRoom } from '@/components/ChatRoom';
import { AuthGuard } from '@/components/AuthGuard/AuthGuard';

export default function RoomPage({ params }: { params: { id: string } }) {
  return (
    <AuthGuard>
      <ChatRoom roomId={params.id} />
    </AuthGuard>
  );
}

