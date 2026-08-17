import { ChatResponse, Conversation } from "../types/chat";

const API_URL = "http://localhost:8000";


export async function sendMessage(
  message: string,
  conversationId?: number,
  stackOverflowEnabled: boolean = false,
  notionEnabled: boolean = false,
): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
      conversation_id: conversationId,
      stack_overflow_enabled: stackOverflowEnabled,
      notion_enabled: notionEnabled
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
  onChunk: (chunk: string) => void,
) {
  if (conversationId === null) {
    throw new Error("Conversation ID is required");
  }

  const response = await fetch(`${API_URL}/chat/stream`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      message,
      conversation_id: conversationId,
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

// DELETE CONVERSATION

export async function deleteConversation(
  conversationId: number,
): Promise<void> {
  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let message = "Failed to delete conversation.";

    try {
      const data = await response.json();

      if (typeof data.detail === "string") {
        message = data.detail;
      }
    } catch {
      // Ignore
    }

    throw new Error(message);
  }
}
