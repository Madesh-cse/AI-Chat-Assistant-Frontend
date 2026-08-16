"use client";

import { Message } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import { useAutoScroll } from "@/hooks/useAutoScroll";

interface Props {
  messages: Message[];
  loading: boolean;
  voiceMode: boolean;
}

export default function ChatArea({ messages, loading, voiceMode,}: Props) {
  const bottomRef = useAutoScroll(messages);

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

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} voiceMode={voiceMode} />
        ))}

        {/* AI typing */}

        {loading && <TypingIndicator />}

        {/* Auto scroll target */}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
