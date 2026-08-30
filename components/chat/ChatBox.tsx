"use client";

import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Message } from "@/types/chat";
import { streamMessage } from "@/services/chat";
import { useChatStore } from "@/store/chatStore";
import  { useSettings } from "../../context/SettingsContext"

const API_URL = "http://localhost:8000";

interface PDFUploadResponse {
  success: boolean;
  id: number;
  filename: string;
  conversation_id: number;
  pages: number;
  chunks: number;
  message: string;
}

interface PDFQuestionResponse {
  success: boolean;
  pdf_id: number;
  filename: string;
  question: string;
  answer: string;
}

export default function ChatBox() {
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
  // LOAD DATABASE CONVERSATIONS

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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
    console.log("Message:", text);
    console.log("File:", file);
    console.log("Stack Overflow:", stackOverflowEnabled);
    console.log("notion enable", notionEnabled)
    console.log("LANGUAGE:", language);
    if (loading) {
      return;
    }

    if (!text.trim() && !file) {
      return;
    }

    if (file) {
      await handlePDFUpload(text, file);

      return;
    }

    await handleNormalChat(text,  stackOverflowEnabled, notionEnabled,language,);
  }
  // PDF UPLOAD

  async function handlePDFUpload(text: string, file: File) {
    const conversationId = getConversationId();

    if (conversationId === null) {
      console.error("Invalid conversation ID:", activeConversation);

      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      console.error("Only PDF files are supported.");

      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      console.error("PDF must be smaller than 10 MB.");

      return;
    }

    // Temporary frontend message ID
    const userMessage: Message = {
      id: createTempMessageId(),

      conversation_id: conversationId,

      role: "user",

      content: text.trim()
        ? `${text.trim()}\n\n📄 ${file.name}`
        : `📄 ${file.name}`,
    };

    addMessage(userMessage);

    // Temporary frontend AI message ID
    const aiMessageId = createTempMessageId();

    const aiMessage: Message = {
      id: aiMessageId,

      conversation_id: conversationId,

      role: "assistant",

      content: "📄 Uploading and understanding your PDF...",
    };

    addMessage(aiMessage);

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("conversation_id", String(conversationId));

      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      const response = await fetch(`${API_URL}/pdf/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = "PDF upload failed.";

        try {
          const errorData = await response.json();

          errorMessage = getErrorMessage(errorData, errorMessage);
        } catch {
          try {
            const errorText = await response.text();

            if (errorText) {
              errorMessage = errorText;
            }
          } catch {
            // Ignore
          }
        }

        throw new Error(errorMessage);
      }

      const data = (await response.json()) as PDFUploadResponse;

      if (
        !Number.isInteger(data.id) ||
        !Number.isInteger(data.conversation_id)
      ) {
        throw new Error("Invalid PDF upload response from server.");
      }

      const successMessage = `
📄 **${data.filename} uploaded successfully.**

- Pages: ${data.pages}
- Chunks: ${data.chunks}

You can now ask questions about this PDF.
      `.trim();

      replaceMessage(aiMessageId, successMessage);

      if (text.trim()) {
        await askPDFQuestion(data.id, text.trim(), aiMessageId);
      }
    } catch (error) {
      console.error("PDF upload error:", error);

      const errorMessage =
        error instanceof Error ? error.message : "PDF upload failed.";

      replaceMessage(aiMessageId, `❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }
  // PDF QUESTION
  async function askPDFQuestion(
    pdfId: number,
    question: string,
    messageId: number,
  ) {
    try {
      replaceMessage(messageId, "🤔 Searching the PDF...");
      const token = localStorage.getItem("access_token");

      if (!token) {
        throw new Error("Not authenticated");
      }
      const response = await fetch(`${API_URL}/pdf/ask`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          pdf_id: pdfId,
          question: question.trim(),
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to ask PDF question.";

        try {
          const errorData = await response.json();

          errorMessage = getErrorMessage(errorData, errorMessage);
        } catch {
          try {
            const errorText = await response.text();

            if (errorText) {
              errorMessage = errorText;
            }
          } catch {
            // Ignore
          }
        }

        throw new Error(errorMessage);
      }

      const data = (await response.json()) as PDFQuestionResponse;

      replaceMessage(messageId, data.answer);
    } catch (error) {
      console.error("PDF question error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to answer the question.";

      replaceMessage(messageId, `❌ ${errorMessage}`);
    }
  }

  // NORMAL CHAT

  async function handleNormalChat(text: string, stackOverflowEnabled: boolean,notionEnabled: boolean,language: string,) {
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
      await streamMessage(cleanText, conversationId,  stackOverflowEnabled,notionEnabled,(chunk) => {
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
      }, language);
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