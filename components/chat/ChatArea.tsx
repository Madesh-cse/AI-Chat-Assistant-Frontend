"use client";

import { Message } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useAutoScroll } from "@/hooks/useAutoScroll";

interface Props {
  messages: Message[];
  loading: boolean;
  voiceMode: boolean;
  slowResponse?: boolean;
}

export default function ChatArea({
  messages,
  loading,
  voiceMode,
  slowResponse = false,
}: Props) {
  const bottomRef = useAutoScroll(messages);
  const lastMessage = messages[messages.length - 1];
  const showTypingIndicator =
    loading &&
    lastMessage?.role === "assistant" &&
    !lastMessage.content?.trim();

  const visibleMessages = showTypingIndicator
    ? messages.slice(0, -1)
    : messages;

  return (
    <div
      className="
        flex-1
        overflow-y-auto
      "
    >
      {/* Chat Container */}

      <div
        className="
          max-w-4xl
          mx-auto
          py-8
          px-6
        "
      >
        {/* Messages */}

        {visibleMessages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            voiceMode={voiceMode}
          />
        ))}

        {/* AI typing */}

        {showTypingIndicator && (
          <TypingIndicator
            label={
              slowResponse
                ? "Still thinking, this is taking longer than usual"
                : "Thinking"
            }
          />
        )}

        {/* Auto scroll target */}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}