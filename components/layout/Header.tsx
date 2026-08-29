"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Share, MoreVertical, LogOut, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import { useChatStore } from "@/store/chatStore";

const CURRENT_MODEL = "qwen2.5:3b";

export default function Header() {
  const router = useRouter();

  useChatStore(); // kept for parity - conversation state no longer read here

  const [moreOpen, setMoreOpen] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);

  const modelMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close either dropdown on an outside click.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        modelMenuRef.current &&
        !modelMenuRef.current.contains(target)
      ) {
        setModelMenuOpen(false);
      }

      if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
        setMoreOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token");
    setMoreOpen(false);
    router.push("/login");
  }

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
        px-4
      "
    >
      {/* =========================================
          LEFT - NAME / MODEL DROPDOWN
      ========================================= */}

      <div className="relative" ref={modelMenuRef}>
        <button
          type="button"
          onClick={() => setModelMenuOpen((current) => !current)}
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            px-2
            py-1.5
            font-medium
            text-sm
            text-gray-200
            hover:bg-[#2a2a2a]
            transition
          "
        >
          CacheAI
          <ChevronDown
            size={15}
            className={`transition-transform ${
              modelMenuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {modelMenuOpen && (
          <div
            className="
              absolute
              left-0
              top-11
              w-56
              rounded-xl
              border
              border-[#3f3f3f]
              bg-[#252525]
              shadow-2xl
              overflow-hidden
              z-50
            "
          >
            <div
              className="
                px-4
                py-2.5
                text-xs
                font-medium
                text-gray-500
              "
            >
              Model
            </div>

            <button
              type="button"
              onClick={() => setModelMenuOpen(false)}
              className="
                w-full
                flex
                items-center
                justify-between
                gap-3
                px-4
                py-2.5
                text-left
                text-sm
                text-white
                hover:bg-[#303030]
                transition
              "
            >
              <div className="flex flex-col items-start">
                <span>{CURRENT_MODEL}</span>
                <span className="text-xs text-gray-500">Local AI</span>
              </div>

              <Check size={15} className="text-[#D97757]" />
            </button>
          </div>
        )}
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

        <div className="relative" ref={moreMenuRef}>
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