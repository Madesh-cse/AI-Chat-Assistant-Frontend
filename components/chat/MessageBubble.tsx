"use client";

import { useEffect, useState } from "react";
import { Message } from "@/types/chat";
import Avatar from "../ui/Avatar";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import ChatMarkdown from "../markdown/ChatMarkDown";
import VoiceOutput from "../voice/VoiceOutput";

interface Props {
  message: Message;
  voiceMode?: boolean;
}

function getRelativeTime(timestamp: string | number | Date): string {
  const then = new Date(timestamp).getTime();
  const seconds = Math.floor((Date.now() - then) / 1000);

  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function MessageBubble({
  message,
  voiceMode = false,
}: Props) {
  const isUser =
    message.role === "user";

  const [copied, setCopied] = useState(false);

  // Re-render every 30s so "1 minute ago" advances to "2 minutes ago" etc.
  // without a full page refresh.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!isUser || !message.created_at) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, [isUser, message.created_at]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied or unavailable — fail silently
    }
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        flex
        w-full
        mb-6
        ${isUser
          ? "justify-end"
          : "justify-start"}
      `}
    >
      {isUser ? (
        // User: right-aligned bubble, no avatar — matches ChatGPT's user turn
        <div className="group flex max-w-[75%] flex-col items-end">
          <div
            className="
              rounded-3xl
              bg-[#2f2f2f]
              text-[#ECECEC]
              px-4
              py-2.5
            "
          >
            <p className="whitespace-pre-wrap `wrap-break-word leading-7">
              {message.content}
            </p>
          </div>

          <div
            className="
              mt-1
              flex
              items-center
              gap-2
              opacity-0
              transition
              group-hover:opacity-100
              group-focus-within:opacity-100
            "
          >
            {message.created_at && (
              <span
                className="text-xs text-gray-500"
                title={new Date(message.created_at).toLocaleString()}
              >
                {getRelativeTime(message.created_at)}
              </span>
            )}

            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy message"}
              className="
                flex
                items-center
                gap-1
                rounded-md
                p-1.5
                text-gray-500
                transition
                hover:bg-[#2a2a2a]
                hover:text-gray-300
                focus:outline-none
              "
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      ) : (
        // Assistant: no bubble, full width, small avatar, plain text on the page background
        <div className="flex items-start gap-3 w-full max-w-5xl">
          <Avatar role={message.role} />

          <div className="min-w-0 flex-1 text-[#ECECEC] pt-1">
            <ChatMarkdown content={message.content} />

            {message.content.trim() && (
              <div className="mt-3">
                <VoiceOutput
                  text={message.content}
                  autoPlay={voiceMode}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}