import { ChatResponse, Conversation } from "../types/chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";


export async function sendMessage(
  message: string,
  conversationId?: number,
  stackOverflowEnabled: boolean = false,
  notionEnabled: boolean = false,
  language: string = "English"
): Promise<ChatResponse> {

  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/chat/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,

    },

    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      stack_overflow_enabled: stackOverflowEnabled,
      notion_enabled: notionEnabled,
      language,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Failed to send message");
  }

  return response.json();
}
// STREAMING CHAT

export async function streamMessage(
  message: string,
  conversationId: number | null,
  stackOverflowEnabled: boolean,
  notionEnabled: boolean,
  onChunk: (chunk: string) => void,
  language: string = "English",
) {
  if (conversationId === null) {
    throw new Error("Conversation ID is required");
  }

  const token = localStorage.getItem("access_token");

  const response = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      stack_overflow_enabled: stackOverflowEnabled,
      notion_enabled: notionEnabled,
      language,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(errorText || "Streaming failed");
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    const chunk = decoder.decode(value, {
      stream: true,
    });

    if (chunk) {
      onChunk(chunk);
    }
  }

  // Flush decoder
  const remaining = decoder.decode();

  if (remaining) {
    onChunk(remaining);
  }
}

