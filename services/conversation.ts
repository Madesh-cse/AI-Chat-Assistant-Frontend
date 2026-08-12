import { Conversation } from "@/types/chat";
const API_URL = "http://localhost:8000";

// CREATE CONVERSATION

export async function createConversation(
  title: string = "New Chat",
): Promise<Conversation> {
  const response = await fetch(
    `${API_URL}/conversations/`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title,
      }),
    },
  );

  if (!response.ok) {
    let message = "Failed to create conversation.";

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

  return response.json();
}

// GET ALL CONVERSATIONS

export async function getConversations(): Promise<Conversation[]> {
  const response = await fetch(
    `${API_URL}/conversations/`,
    {
      method: "GET",

      cache: "no-store",
    },
  );

  if (!response.ok) {
    let message = "Failed to load conversations.";

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

  return response.json();
}

// GET SINGLE CONVERSATION

export async function getConversation(
  conversationId: number,
): Promise<Conversation> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "GET",

      cache: "no-store",
    },
  );

  if (!response.ok) {
    let message = "Failed to load conversation.";

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

  return response.json();
}

// DELETE CONVERSATION

export async function deleteConversation(
  conversationId: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}`,
    {
      method: "DELETE",
    },
  );

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