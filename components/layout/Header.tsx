"use client";

import { ChevronDown, Share, MoreVertical } from "lucide-react";

import { useChatStore } from "@/store/chatStore";

export default function Header() {
  const { conversations, activeConversation } = useChatStore();

  // Find currently active conversation
  const activeChat = conversations.find(
    (chat) => chat.id === activeConversation,
  );

  // Same title used in sidebar
  const chatTitle = activeChat?.title?.trim() || "New Chat";

  return (
    <header
      className="
        relative
        h-14
        border-b
        border-[#2f2f2f]
        bg-[#212121]
        text-white
        flex
        items-center
        justify-between
        px-6
      "
    >
      {/* =========================================
          LEFT - AI ASSISTANT
      ========================================= */}

      <div className="flex items-center gap-3">
        {/* AI Logo */}

        <div
          className="
            h-8
            w-8
            rounded-full
            bg-[#303030]
            border
            border-[#444]
            flex
            items-center
            justify-center
            text-sm
            font-semibold
          "
        >
          C
        </div>

        {/* Assistant Name */}

        <div>
          <button
            type="button"
            className="
              flex
              items-center
              gap-1
              font-semibold
              text-sm
              hover:text-gray-300
              transition
            "
          >
            CacheAI
            <ChevronDown size={15} />
          </button>

          <p
            className="
              text-xs
              text-gray-400
            "
          >
            qwen2.5:3b • Local AI
          </p>
        </div>
      </div>

      {/* =========================================
          CENTER - CONVERSATION TITLE
      ========================================= */}

      <div
        className="
          absolute
          left-1/2
          -translate-x-1/2
          max-w-[40%]
          px-4
          text-sm
          font-medium
          text-gray-300
          truncate
        "
        title={chatTitle}
      >
        {chatTitle}
      </div>

      {/* =========================================
          RIGHT ACTIONS
      ========================================= */}

      <div
        className="
          flex
          items-center
          gap-1
        "
      >
        {/* Share */}

        <button
          type="button"
          title="Share"
          className="
            p-2
            rounded-lg
            text-gray-300
            hover:bg-[#303030]
            hover:text-white
            transition
          "
        >
          <Share size={18} />
        </button>

        {/* More */}

        <button
          type="button"
          title="More"
          className="
            p-2
            rounded-lg
            text-gray-300
            hover:bg-[#303030]
            hover:text-white
            transition
          "
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
}
