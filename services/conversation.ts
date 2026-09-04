import { Conversation } from "@/types/chat";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// CREATE CONVERSATION

export async function createConversation(
  title: string = "New Chat",
): Promise<Conversation> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/conversations/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/conversations/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

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
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
  const token = localStorage.getItem("access_token");
  const response = await fetch(`${API_URL}/conversations/${id}/title`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title,
    }),
  });

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
export async function togglePinConversation(conversationId: number): Promise<{
  id: number;
  is_pinned: boolean;
}> {
  const token = localStorage.getItem("access_token");
  const response = await fetch(
    `${API_URL}/conversations/${conversationId}/pin`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

// DELETE CONVERSATION

export async function deleteConversation(
  conversationId: number,
): Promise<void> {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // DELETE is effectively successful if the resource
  // has already been deleted.
  if (response.ok || response.status === 204) {
    return;
  }

  let message = "Failed to delete conversation.";

  try {
    const data = await response.json();

    if (typeof data.detail === "string") {
      message = data.detail;
    } else if (Array.isArray(data.detail)) {
      message = data.detail
        .map((item: { msg?: string }) => item.msg || "Validation error")
        .join(", ");
    }
  } catch {
    // Ignore JSON parsing errors
  }

  // A conversation that doesn't exist anymore
  // should not break the frontend.
  if (response.status === 404) {
    console.warn(`Conversation ${conversationId} was already deleted.`);

    return;
  }

  throw new Error(message);
}
