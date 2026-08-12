"use client";

import { Message } from "@/types/chat";
import Avatar from "../ui/Avatar";
import { motion } from "framer-motion";
import ChatMarkdown from "../markdown/ChatMarkDown";
import VoiceOutput from "../voice/VoiceOutput";

interface Props {
  message: Message;
  voiceMode?: boolean;
}

export default function MessageBubble({
  message,
  voiceMode = false,
}: Props) {
  const isUser =
    message.role === "user";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className={`
        flex
        w-full
        mb-8
        ${isUser
          ? "justify-end"
          : "justify-start"}
      `}
    >
      <div
        className={`
          flex
          items-start
          gap-4
          w-full
          max-w-5xl
          ${
            isUser
              ? "flex-row-reverse ml-auto"
              : "flex-row"
          }
        `}
      >
        <Avatar role={message.role} />

        <div
          className={`
            rounded-2xl
            px-5
            py-4
            shadow-sm

            ${
              isUser
                ? `
                  bg-[#303030]
                  text-[#ECECEC]
                  max-w-[70%]
                  ml-auto
                `
                : `
                  bg-[#303030]
                  text-[#ECECEC]
                  w-full
                `
            }
          `}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-7">
              {message.content}
            </p>
          ) : (
            <>
              <ChatMarkdown
                content={message.content}
              />

              {message.content.trim() && (
                <div className="mt-3">
                  <VoiceOutput
                    text={message.content}
                    autoPlay={voiceMode}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}