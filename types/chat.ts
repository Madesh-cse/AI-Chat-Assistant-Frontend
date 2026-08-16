export interface Message {
  id: number;
  conversation_id?: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface ChatResponse {
  response: string;
}

export interface Conversation {
  id: number;
  title: string;
  user_id?: number;
  is_pinned: boolean;
  created_at?: string;
  updated_at?: string;
  messages: Message[];
}