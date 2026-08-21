"use client";

import { useState } from "react";
import { ChevronDown, Share, MoreVertical, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useChatStore } from "@/store/chatStore";

export default function Header() {
  const router = useRouter();

  const { conversations, activeConversation } = useChatStore();

  const [moreOpen, setMoreOpen] = useState(false);

  // Find currently active conversation
  const activeChat = conversations.find(
    (chat) => chat.id === activeConversation,
  );

  const chatTitle = activeChat?.title?.trim() || "New Chat";

  // =========================================
  // LOGOUT
  // =========================================

  function handleLogout() {
    // Remove authentication token
    localStorage.removeItem("access_token");

    // If you use another token name, remove it here too
    localStorage.removeItem("token");

    // Close menu
    setMoreOpen(false);

    // Redirect to login
    router.push("/login");
  }

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

      <div className="flex items-center gap-1">
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

        <div className="relative">
          <button
            type="button"
            title="More"
            onClick={() => setMoreOpen((current) => !current)}
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

          {/* More Menu */}

          {moreOpen && (
            <div
              className="
                absolute
                right-0
                top-11
                w-48
                rounded-xl
                border
                border-[#3f3f3f]
                bg-[#252525]
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              {/* Logout */}

              <button
                type="button"
                onClick={handleLogout}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  text-sm
                  text-red-400
                  hover:bg-[#303030]
                  hover:text-red-300
                  transition
                "
              >
                <LogOut size={17} />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}