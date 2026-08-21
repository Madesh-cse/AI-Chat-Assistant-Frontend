"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import ChatBox from "@/components/chat/ChatBox";

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatBox />
    </AuthGuard>
  );
}