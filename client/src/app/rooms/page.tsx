'use client';

import { ChatLayout } from '@/components/ChatLayout/ChatLayout';
import { AuthGuard } from '@/components/AuthGuard/AuthGuard';

export default function RoomsPage() {
  return (
    <AuthGuard>
      <ChatLayout />
    </AuthGuard>
  );
}

