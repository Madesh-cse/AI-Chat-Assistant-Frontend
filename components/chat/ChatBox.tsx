"use client";

import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";

import { useEffect, useState } from "react";
import { Message } from "@/types/chat";
import { streamMessage } from "@/services/chat";
import { useChatStore } from "@/store/chatStore";

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

  const [loading, setLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
  // TEMP MESSAGE ID
  function createTempMessageId(): number {
    return -Date.now() - Math.floor(Math.random() * 1000);
  }
  // LOAD DATABASE CONVERSATIONS

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

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

  // SEND

  async function handleSend(
    text: string,
    file: File | null = null,
    stackOverflowEnabled: boolean,
  ) {
    console.log("Message:", text);
    console.log("File:", file);
    console.log("Stack Overflow:", stackOverflowEnabled);
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

    await handleNormalChat(text);
  }

  // ==================================================
  // PDF UPLOAD
  // ==================================================

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

      const response = await fetch(`${API_URL}/pdf/upload`, {
        method: "POST",
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

  // ==================================================
  // PDF QUESTION
  // ==================================================

  async function askPDFQuestion(
    pdfId: number,
    question: string,
    messageId: number,
  ) {
    try {
      replaceMessage(messageId, "🤔 Searching the PDF...");

      const response = await fetch(`${API_URL}/pdf/ask`, {
        method: "POST",

        headers: {
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

  // ==================================================
  // NORMAL CHAT
  // ==================================================

  async function handleNormalChat(text: string) {
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

    try {
      await streamMessage(cleanText, conversationId, (chunk) => {
        useChatStore.getState().updateMessage(aiMessageId, chunk);
      });
    } catch (error) {
      console.error("Chat streaming error:", error);

      replaceMessage(aiMessageId, "❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col">
        <Header />

        {hasMessages ? (
          <>
            <ChatArea
              messages={messages}
              loading={loading}
              voiceMode={voiceMode}
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
            <div className="w-full max-w-3xl -mt-16">
              <h1 className="text-3xl font-semibold text-center mb-8">
                Welcome Madesh, what do you want to do?
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
