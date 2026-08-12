import { create } from "zustand";

import {
  Conversation,
  Message,
} from "@/types/chat";

import {
  createConversation,
  getConversations,
  getConversation,
} from "@/services/conversation";


interface ChatStore {

  conversations: Conversation[];

  activeConversation: number | null;

  loadingConversations: boolean;

  createChat: () => Promise<void>;

  loadConversations: () => Promise<void>;

  selectConversation: (
    id: number,
  ) => Promise<void>;

  setActiveChat: (
    id: number,
  ) => void;

  deleteChat: (
    id: number,
  ) => void;

  addMessage: (
    message: Message,
  ) => void;

  updateChatTitle: (
    id: number,
    title: string,
  ) => void;

  updateMessage: (
    messageId: number,
    content: string,
  ) => void;

  replaceMessage: (
    messageId: number,
    content: string,
  ) => void;

  clearMessage: (
    messageId: number,
  ) => void;
}


export const useChatStore =
  create<ChatStore>((set, get) => ({

    // INITIAL STATE

    conversations: [],
    activeConversation: null,
    loadingConversations: false,

    // LOAD CONVERSATIONS

    loadConversations: async () => {
      set({
        loadingConversations: true,
      });

      try {

        const conversations =
          await getConversations();

        set({
          conversations,

          activeConversation:
            conversations.length > 0
              ? conversations[0].id
              : null,
        });

      } catch (error) {

        console.error(
          "Failed to load conversations:",
          error,
        );

      } finally {

        set({
          loadingConversations: false,
        });
      }
    },

    // SELECT CONVERSATION

    selectConversation: async (
      id: number,
    ) => {

      // Immediately switch UI
      set({
        activeConversation: id,
      });

      try {

        const conversation =
          await getConversation(id);

        set((state) => ({

          conversations:
            state.conversations.map(
              (chat) =>
                chat.id === id
                  ? conversation
                  : chat,
            ),

        }));

      } catch (error) {

        console.error(
          "Failed to load conversation:",
          error,
        );
      }
    },


    // SET ACTIVE CHAT

    setActiveChat: (
      id: number,
    ) => {

      set({
        activeConversation: id,
      });
    },

    // CREATE CHAT

    createChat: async () => {

      try {

        // PostgreSQL creates ID
        const conversation =
          await createConversation(
            "New Chat",
          );

        set((state) => ({

          conversations: [
            ...state.conversations,
            conversation,
          ],

          activeConversation:
            conversation.id,

        }));

      } catch (error) {

        console.error(
          "Failed to create chat:",
          error,
        );

        throw error;
      }
    },

    // ADD MESSAGE

    addMessage: (
      message: Message,
    ) => {

      set((state) => {

        if (
          state.activeConversation ===
          null
        ) {
          return state;
        }

        return {

          conversations:
            state.conversations.map(
              (chat) => {

                if (
                  chat.id !==
                  state.activeConversation
                ) {
                  return chat;
                }

                const isFirstUserMessage =
                  message.role === "user" &&
                  chat.messages.filter(
                    (msg) =>
                      msg.role === "user",
                  ).length === 0;

                let title =
                  chat.title;

                if (
                  isFirstUserMessage &&
                  chat.title === "New Chat"
                ) {

                  title =
                    message.content
                      .trim()
                      .slice(0, 40);

                  if (
                    message.content
                      .trim()
                      .length > 40
                  ) {
                    title += "...";
                  }
                }

                return {

                  ...chat,

                  title,

                  messages: [
                    ...chat.messages,
                    message,
                  ],
                };
              },
            ),
        };
      });
    },

    // UPDATE TITLE

    updateChatTitle: (
      id: number,
      title: string,
    ) => {

      set((state) => ({

        conversations:
          state.conversations.map(
            (chat) =>
              chat.id === id
                ? {
                    ...chat,
                    title,
                  }
                : chat,
          ),

      }));
    },

    // UPDATE MESSAGE / STREAK

    updateMessage: (
      messageId: number,
      chunk: string,
    ) => {

      set((state) => ({

        conversations:
          state.conversations.map(
            (chat) => {

              if (
                chat.id !==
                state.activeConversation
              ) {
                return chat;
              }

              return {

                ...chat,

                messages:
                  chat.messages.map(
                    (message) =>
                      message.id ===
                      messageId
                        ? {
                            ...message,
                            content:
                              message.content +
                              chunk,
                          }
                        : message,
                  ),
              };
            },
          ),
      }));
    },

    // REPLACE MESSAGE

    replaceMessage: (
      messageId: number,
      content: string,
    ) => {

      set((state) => ({

        conversations:
          state.conversations.map(
            (chat) => {

              if (
                chat.id !==
                state.activeConversation
              ) {
                return chat;
              }

              return {

                ...chat,

                messages:
                  chat.messages.map(
                    (message) =>
                      message.id ===
                      messageId
                        ? {
                            ...message,
                            content,
                          }
                        : message,
                  ),
              };
            },
          ),
      }));
    },

    // CLEAR MESSAGE

    clearMessage: (
      messageId: number,
    ) => {

      set((state) => ({

        conversations:
          state.conversations.map(
            (chat) => {

              if (
                chat.id !==
                state.activeConversation
              ) {
                return chat;
              }

              return {

                ...chat,

                messages:
                  chat.messages.map(
                    (message) =>
                      message.id ===
                      messageId
                        ? {
                            ...message,
                            content: "",
                          }
                        : message,
                  ),
              };
            },
          ),
      }));
    },

    // DELETE CHAT

    deleteChat: (
      id: number,
    ) => {

      set((state) => {

        const remainingChats =
          state.conversations.filter(
            (chat) =>
              chat.id !== id,
          );

        let activeConversation =
          state.activeConversation;

        if (
          activeConversation === id
        ) {

          activeConversation =
            remainingChats.length >
            0
              ? remainingChats[0].id
              : null;
        }

        return {

          conversations:
            remainingChats,

          activeConversation,
        };
      });
    },

  }));