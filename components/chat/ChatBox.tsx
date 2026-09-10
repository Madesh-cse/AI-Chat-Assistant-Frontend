"use client";

import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Message } from "@/types/chat";
import { streamMessage } from "@/services/chat";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { useSettings } from "../../context/SettingsContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

export default function ChatBox() {
  const router = useRouter();

  // AUTH STATE
  const token = useAuthStore((state) => state.token);
  const authInitialized = useAuthStore((state) => state.initialized);

  const {
    conversations,
    activeConversation,
    addMessage,
    replaceMessage,
    loadConversations,
  } = useChatStore();
  const { language } = useSettings();

  const [loading, setLoading] = useState(false);
  const [slowResponse, setSlowResponse] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  const [userName, setUserName] = useState("User");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // TEMP MESSAGE ID
  function createTempMessageId(): number {
    return -Date.now() - Math.floor(Math.random() * 1000);
  }

  // REDIRECT IF NOT AUTHENTICATED
  // Waits for the auth store to finish hydrating from localStorage
  // before deciding there's no token — avoids a false redirect on
  // first paint.
  useEffect(() => {
    if (authInitialized && !token) {
      router.replace("/login");
    }
  }, [authInitialized, token, router]);

  // LOAD DATABASE CONVERSATIONS
  // Only fires once we know auth has hydrated AND a token exists.
  // This is what was previously firing unconditionally on mount and
  // causing 401s when the token wasn't ready yet (or didn't exist).
  useEffect(() => {
    if (authInitialized && token) {
      loadConversations();
    }
  }, [authInitialized, token, loadConversations]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;
    try {
      const user = JSON.parse(storedUser);

      if (user?.name) {
        setUserName(user.name);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }, []);

  // CURRENT CHAT

  const currentChat = conversations.find(
    (chat) => chat.id === activeConversation,
  );

  // Dynmaic Web Page Title
  useEffect(() => {
    const title = currentChat?.title?.trim();

    document.title = title ? `${title} | AI Chat` : "AI Chat";
  }, [currentChat?.title]);

  const messages = currentChat?.messages ?? [];
  const hasMessages = messages.length > 0;

  // GET CONVERSATION ID

  function getConversationId(): number | null {
    if (activeConversation === null) {
      return null;
    }

    if (!Number.isInteger(activeConversation)) {
      return null;
    }

    if (activeConversation <= 0) {
      return null;
    }

    return activeConversation;
  }

  // ERROR MESSAGE

  function getErrorMessage(errorData: unknown, fallback: string): string {
    if (!errorData || typeof errorData !== "object") {
      return fallback;
    }

    const data = errorData as {
      detail?: unknown;
      message?: unknown;
    };

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (typeof item === "object" && item !== null && "msg" in item) {
            return String(
              (
                item as {
                  msg?: unknown;
                }
              ).msg,
            );
          }

          return JSON.stringify(item);
        })
        .join(", ");
    }

    if (data.detail && typeof data.detail === "object") {
      return JSON.stringify(data.detail);
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    return fallback;
  }

  // TIME-BASED GREETING

  function getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 2 && hour < 5) {
      return "Burning the midnight oil";
    }

    if (hour >= 5 && hour < 8) {
      return "You're up early";
    }

    if (hour >= 8 && hour < 12) {
      return "Good morning";
    }

    if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    }

    if (hour >= 17 && hour < 21) {
      return "Good evening";
    }

    // 21:00 - 02:00
    return "Good night";
  }

  // SEND

  async function handleSend(
    text: string,
    file: File | null = null,
    stackOverflowEnabled: boolean,
    notionEnabled: boolean,
    language: string,
  ) {
    if (loading) {
      return;
    }

    if (!text.trim() && !file) {
      return;
    }

    if (file) {
      console.warn("File upload is currently disabled.");
      return;
    }

    await handleNormalChat(text, stackOverflowEnabled, notionEnabled, language);
  }

  // NORMAL CHAT

  async function handleNormalChat(
    text: string,
    stackOverflowEnabled: boolean,
    notionEnabled: boolean,
    language: string,
  ) {
    const cleanText = text.trim();

    if (!cleanText) {
      return;
    }

    const conversationId = getConversationId();

    if (conversationId === null) {
      console.error("No active conversation.");
      return;
    }

    // Temporary user message
    const userMessage: Message = {
      id: createTempMessageId(),
      conversation_id: conversationId,
      role: "user",
      content: cleanText,
    };

    addMessage(userMessage);

    // Temporary AI message
    const aiMessageId = createTempMessageId();
    const aiMessage: Message = {
      id: aiMessageId,
      conversation_id: conversationId,
      role: "assistant",
      content: "",
    };

    addMessage(aiMessage);

    setLoading(true);

    setSlowResponse(false);

    let hasReceivedResponse = false;
    const slowResponseTimer = setTimeout(() => {
      if (!hasReceivedResponse) {
        setSlowResponse(true);
      }
    }, 10000);

    try {
      await streamMessage(
        cleanText,
        conversationId,
        stackOverflowEnabled,
        notionEnabled,
        (chunk) => {
          if (!chunk) {
            return;
          }

          // First chunk arrived
          if (!hasReceivedResponse) {
            hasReceivedResponse = true;

            setSlowResponse(false);
            useChatStore.getState().replaceMessage(aiMessageId, chunk);

            return;
          }
          useChatStore.getState().updateMessage(aiMessageId, chunk);
        },
        language,
      );
      const state = useChatStore.getState();
      const currentChat = state.conversations.find(
        (chat) => chat.id === conversationId,
      );

      const finalMessage = currentChat?.messages.find(
        (message) => message.id === aiMessageId,
      );

      if (!hasReceivedResponse || !finalMessage?.content?.trim()) {
        state.replaceMessage(
          aiMessageId,
          "⚠️ I couldn't generate a response. Please try again.",
        );
      }
    } catch (error) {
      console.error("Chat streaming error:", error);

      useChatStore
        .getState()
        .replaceMessage(
          aiMessageId,
          "❌ Something went wrong while generating the response. Please try again.",
        );
    } finally {
      clearTimeout(slowResponseTimer);
      setLoading(false);
      setSlowResponse(false);
    }
  }

  // Don't render the chat UI until we know auth has hydrated and a
  // token exists. Prevents a flash of the chat screen (and any API
  // calls) before the redirect to /login kicks in.
  if (!authInitialized || !token) {
    return (
      <div className="flex h-screen items-center justify-center bg-(--background) text-(--foreground)">
        <span className="text-sm text-(--muted)">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-(--background) text-(--foreground)">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            title="Open menu"
            className="
              md:hidden
              shrink-0
              m-2
              p-2
              rounded-lg
              text-(--muted)
              hover:bg-(--foreground)/10
              hover:text-(--foreground)
              transition
            "
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 min-w-0">
            <Header />
          </div>
        </div>

        {hasMessages ? (
          <>
            <ChatArea
              messages={messages}
              loading={loading}
              voiceMode={voiceMode}
              slowResponse={slowResponse}
            />

            <ChatInput
              onSend={handleSend}
              loading={loading}
              voiceMode={voiceMode}
              onVoiceModeChange={setVoiceMode}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <div className="w-full max-w-3xl -mt-10 sm:-mt-16">
              <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6 sm:mb-8 px-2">
                {getGreeting()}, {userName}. What do you want to do?
              </h1>

              <ChatInput
                onSend={handleSend}
                loading={loading}
                voiceMode={voiceMode}
                onVoiceModeChange={setVoiceMode}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}