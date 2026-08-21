"use client";

import { create } from "zustand";

import { Conversation, Message } from "@/types/chat";

import {
  createConversation,
  getConversations,
  getConversation,
  updateConversationTitle,
  togglePinConversation,
  deleteConversation,
} from "@/services/conversation";

interface ChatStore {
  conversations: Conversation[];
  activeConversation: number | null;
  loadingConversations: boolean;

  createChat: () => Promise<void>;
  loadConversations: () => Promise<void>;
  selectConversation: (id: number) => Promise<void>;
  setActiveChat: (id: number) => void;

  deleteChat: (id: number) => Promise<void>;

  togglePinChat: (id: number) => Promise<void>;

  addMessage: (message: Message) => void;
  updateChatTitle: (id: number, title: string) => void;

  updateMessage: (messageId: number, content: string) => void;
  replaceMessage: (messageId: number, content: string) => void;
  clearMessage: (messageId: number) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // =====================================================
  // INITIAL STATE
  // =====================================================

  conversations: [],
  activeConversation: null,
  loadingConversations: false,

  // =====================================================
  // LOAD CONVERSATIONS
  // =====================================================

  loadConversations: async () => {
    set({
      loadingConversations: true,
    });

    try {
      const conversations = await getConversations();

      // -----------------------------------------------
      // EXISTING CONVERSATIONS
      // -----------------------------------------------

      if (conversations.length > 0) {
        set({
          conversations,
          activeConversation: conversations[0].id,
        });

        return;
      }

      // -----------------------------------------------
      // NO CONVERSATIONS
      // Create first conversation automatically
      // -----------------------------------------------

      console.log("No conversations found. Creating New Chat...");

      const newConversation = await createConversation("New Chat");

      set({
        conversations: [newConversation],
        activeConversation: newConversation.id,
      });

      console.log("New conversation created:", newConversation.id);
    } catch (error) {
      console.error("Failed to load conversations:", error);

      set({
        conversations: [],
        activeConversation: null,
      });
    } finally {
      set({
        loadingConversations: false,
      });
    }
  },

  // =====================================================
  // SELECT CONVERSATION
  // =====================================================

  selectConversation: async (id: number) => {
    // Immediately update active conversation
    set({
      activeConversation: id,
    });

    try {
      const conversation = await getConversation(id);

      set((state) => ({
        conversations: state.conversations.map((chat) =>
          chat.id === id ? conversation : chat,
        ),
      }));
    } catch (error) {
      console.error("Failed to load conversation:", error);
    }
  },

  // =====================================================
  // SET ACTIVE CHAT
  // =====================================================

  setActiveChat: (id: number) => {
    set({
      activeConversation: id,
    });
  },

  // =====================================================
  // CREATE CHAT
  // =====================================================

  createChat: async () => {
    try {
      const conversation = await createConversation("New Chat");

      set((state) => ({
        conversations: [...state.conversations, conversation],

        activeConversation: conversation.id,
      }));
    } catch (error) {
      console.error("Failed to create chat:", error);

      throw error;
    }
  },

  // =====================================================
  // ADD MESSAGE
  // =====================================================

  addMessage: (message: Message) => {
    const activeConversation = get().activeConversation;

    if (activeConversation === null) {
      console.error("Cannot add message: no active conversation.");

      return;
    }

    let newTitle: string | null = null;

    set((state) => ({
      conversations: state.conversations.map((chat) => {
        if (chat.id !== activeConversation) {
          return chat;
        }

        const isFirstUserMessage =
          message.role === "user" &&
          chat.messages.filter((msg) => msg.role === "user").length === 0;

        let title = chat.title;

        // -----------------------------------------
        // Generate title from first user message
        // -----------------------------------------

        if (isFirstUserMessage && (chat.title === "New Chat" || !chat.title)) {
          title = message.content.trim().slice(0, 40);

          if (message.content.trim().length > 40) {
            title += "...";
          }

          newTitle = title;
        }

        return {
          ...chat,

          title,

          messages: [...chat.messages, message],
        };
      }),
    }));

    // -----------------------------------------------
    // Persist generated title
    // -----------------------------------------------

    if (newTitle) {
      updateConversationTitle(activeConversation, newTitle).catch((error) => {
        console.error("Failed to persist conversation title:", error);
      });
    }
  },

  // =====================================================
  // UPDATE CHAT TITLE
  // =====================================================

  updateChatTitle: (id: number, title: string) => {
    set((state) => ({
      conversations: state.conversations.map((chat) =>
        chat.id === id
          ? {
              ...chat,
              title,
            }
          : chat,
      ),
    }));
  },

  // =====================================================
  // UPDATE MESSAGE
  // =====================================================

  updateMessage: (messageId: number, chunk: string) => {
    set((state) => ({
      conversations: state.conversations.map((chat) => {
        if (chat.id !== state.activeConversation) {
          return chat;
        }

        return {
          ...chat,

          messages: chat.messages.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content: message.content + chunk,
                }
              : message,
          ),
        };
      }),
    }));
  },

  // =====================================================
  // REPLACE MESSAGE
  // =====================================================

  replaceMessage: (messageId: number, content: string) => {
    set((state) => ({
      conversations: state.conversations.map((chat) => {
        if (chat.id !== state.activeConversation) {
          return chat;
        }

        return {
          ...chat,

          messages: chat.messages.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content,
                }
              : message,
          ),
        };
      }),
    }));
  },

  // =====================================================
  // CLEAR MESSAGE
  // =====================================================

  clearMessage: (messageId: number) => {
    set((state) => ({
      conversations: state.conversations.map((chat) => {
        if (chat.id !== state.activeConversation) {
          return chat;
        }

        return {
          ...chat,

          messages: chat.messages.map((message) =>
            message.id === messageId
              ? {
                  ...message,
                  content: "",
                }
              : message,
          ),
        };
      }),
    }));
  },

  // =====================================================
  // DELETE CHAT
  // =====================================================

  deleteChat: async (id: number) => {
    const state = get();

    // Check whether conversation exists in frontend
    const conversationExists = state.conversations.some(
      (chat) => chat.id === id,
    );

    if (!conversationExists) {
      console.warn(`Conversation ${id} does not exist in frontend state.`);

      return;
    }

    try {
      // -----------------------------------------------
      // Delete from backend
      // -----------------------------------------------

      await deleteConversation(id);
    } catch (error) {
      console.error("Backend delete failed:", error);

      // -----------------------------------------------
      // If backend says conversation doesn't exist,
      // remove it from frontend anyway.
      // -----------------------------------------------

      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("not found")
      ) {
        console.warn(`Conversation ${id} was already deleted from backend.`);
      } else {
        // Real backend error
        throw error;
      }
    }

    // -----------------------------------------------
    // Remove from Zustand
    // -----------------------------------------------

    set((state) => {
      const remainingChats = state.conversations.filter(
        (chat) => chat.id !== id,
      );

      let activeConversation = state.activeConversation;

      // ---------------------------------------------
      // If deleted chat was active
      // ---------------------------------------------

      if (activeConversation === id) {
        activeConversation =
          remainingChats.length > 0 ? remainingChats[0].id : null;
      }

      return {
        conversations: remainingChats,
        activeConversation,
      };
    });

    // -----------------------------------------------
    // If no conversations remain,
    // automatically create a new chat
    // -----------------------------------------------

    const remainingChats = get().conversations;

    if (remainingChats.length === 0) {
      try {
        const newConversation = await createConversation("New Chat");

        set({
          conversations: [newConversation],
          activeConversation: newConversation.id,
        });

        console.log("Created new conversation:", newConversation.id);
      } catch (error) {
        console.error("Failed to create new conversation:", error);
      }
    }
  },
  // =====================================================
  // PIN CHAT
  // =====================================================

  togglePinChat: async (id: number) => {
    try {
      const result = await togglePinConversation(id);

      set((state) => ({
        conversations: state.conversations
          .map((chat) =>
            chat.id === id
              ? {
                  ...chat,
                  is_pinned: result.is_pinned,
                }
              : chat,
          )
          .sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) {
              return -1;
            }

            if (!a.is_pinned && b.is_pinned) {
              return 1;
            }

            return (
              new Date(b.updated_at || "").getTime() -
              new Date(a.updated_at || "").getTime()
            );
          }),
      }));
    } catch (error) {
      console.error("Failed to toggle pin:", error);

      throw error;
    }
  },
}));
