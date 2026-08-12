"use client";

import { ChevronDown, Share, MoreVertical } from "lucide-react";

export default function Header() {
  return (
    <header
      className="
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
      {/* Left - Model */}
      <div className="flex items-center gap-3">
        <div
          className="
            h-8
            w-8
            rounded-full
            bg-[#303030]
            flex
            items-center
            justify-center
            text-sm
            font-semibold
          "
        >
          AI
        </div>

        <div>
          <button
            className="
              flex
              items-center
              gap-1
              font-semibold
              text-sm
              hover:text-gray-300
            "
          >
            Ollama AI
            <ChevronDown size={16} />
          </button>

          <p className="text-xs text-gray-400">qwen2.5:3b • Local Model</p>
        </div>
      </div>

      {/* Center - Chat Title */}
      <div
        className="
          absolute
          left-1/2
          -translate-x-1/2
          text-sm
          font-medium
          text-gray-300
        "
      >
        New Chat
      </div>

      {/* Right Actions */}
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <button
          className="
            p-2
            rounded-lg
            hover:bg-[#303030]
            transition
          "
        >
          <Share size={18} />
        </button>

        <button
          className="
            p-2
            rounded-lg
            hover:bg-[#303030]
            transition
          "
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
}
