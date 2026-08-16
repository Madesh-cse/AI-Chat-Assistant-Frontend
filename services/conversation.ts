import { Conversation } from "@/types/chat";
const API_URL = "http://localhost:8000";

// CREATE CONVERSATION

export async function createConversation(
  title: string = "New Chat",
): Promise<Conversation> {
  const response = await fetch(`${API_URL}/conversations/`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      title,
    }),
  });

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
  const response = await fetch(`${API_URL}/conversations/`, {
    method: "GET",

    cache: "no-store",
  });

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
  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "GET",

    cache: "no-store",
  });

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

// Update a conversation Title

export async function updateConversationTitle(
  id: number,
  title: string,
): Promise<Conversation> {
  const response = await fetch(
    `${API_URL}/conversations/${id}/title`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error("UPDATE TITLE FAILED", {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      conversationId: id,
      title,
    });

    throw new Error(
      `Failed to update conversation title: ${response.status} ${errorText}`,
    );
  }

  return response.json();
}

// PIN CHAT
export async function togglePinConversation(
  conversationId: number,
): Promise<{
  id: number;
  is_pinned: boolean;
}> {
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/pin`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    let message = "Failed to update pinned conversation.";

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

