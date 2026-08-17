"use client";

import { X, Check } from "lucide-react";

import { useState } from "react";

interface PluginPanelProps {
  onClose: () => void;
}

export default function PluginPanel({ onClose }: PluginPanelProps) {
  const [stackOverflowEnabled, setStackOverflowEnabled] = useState(false);

  const [notionEnabled, setNotionEnabled] = useState(false);

  function toggleStackOverflow() {
    setStackOverflowEnabled((current) => !current);
  }

  function toggleNotion() {
    setNotionEnabled((current) => !current);
  }

  return (
    <div
      className="
        absolute
        inset-0
        z-50
        bg-[#171717]
        flex
        flex-col
      "
    >
      {/* =========================================
          HEADER
      ========================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          px-4
          py-4
          border-b
          border-[#2f2f2f]
        "
      >
        <div>
          <h2 className="text-sm font-semibold text-white">Plugins</h2>

          <p className="text-xs text-gray-500 mt-1">
            Connect tools to CacheAI.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            p-2
            rounded-lg
            text-gray-400
            hover:bg-[#2a2a2a]
            hover:text-white
            transition
          "
          title="Close plugins"
        >
          <X size={18} />
        </button>
      </div>

      {/* =========================================
          PLUGIN LIST
      ========================================= */}

      <div
        className="
          flex-1
          overflow-y-auto
          p-3
          space-y-2
        "
      >
        {/* =======================================
            STACK OVERFLOW
        ======================================= */}

        <div
          className="
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            border
            border-[#333]
            bg-[#202020]
            hover:bg-[#252525]
            transition
          "
        >
          {/* ICON */}

          <div
            className="
              h-10
              w-10
              shrink-0
              rounded-lg
              bg-[#f48024]
              flex
              items-center
              justify-center
              text-white
              text-xs
              font-bold
            "
          >
            SO
          </div>

          {/* INFO */}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Stack Overflow</p>

            <p className="text-xs text-gray-500 mt-0.5">
              Search developer questions
            </p>
          </div>

          {/* ENABLE BUTTON */}

          <button
            type="button"
            onClick={toggleStackOverflow}
            className={`
              shrink-0
              flex
              items-center
              gap-1.5
              px-3
              py-1.5
              rounded-lg
              text-xs
              font-medium
              transition

              ${
                stackOverflowEnabled
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : "bg-[#303030] text-gray-300 hover:bg-[#404040] hover:text-white"
              }
            `}
          >
            {stackOverflowEnabled && <Check size={13} />}

            {stackOverflowEnabled ? "Enabled" : "Enable"}
          </button>
        </div>

        {/* =======================================
            NOTION
        ======================================= */}

        <div
          className="
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            border
            border-[#333]
            bg-[#202020]
            hover:bg-[#252525]
            transition
          "
        >
          {/* ICON */}

          <div
            className="
              h-10
              w-10
              shrink-0
              rounded-lg
              bg-white
              flex
              items-center
              justify-center
              text-black
              text-sm
              font-bold
            "
          >
            N
          </div>

          {/* INFO */}

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">Notion</p>

            <p className="text-xs text-gray-500 mt-0.5">
              Search your Notion workspace
            </p>
          </div>

          {/* ENABLE BUTTON */}

          <button
            type="button"
            onClick={toggleNotion}
            className={`
              shrink-0
              flex
              items-center
              gap-1.5
              px-3
              py-1.5
              rounded-lg
              text-xs
              font-medium
              transition

              ${
                notionEnabled
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-[#303030] text-gray-300 hover:bg-[#404040] hover:text-white"
              }
            `}
          >
            {notionEnabled && <Check size={13} />}

            {notionEnabled ? "Enabled" : "Enable"}
          </button>
        </div>
      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div
        className="
          px-4
          py-3
          border-t
          border-[#2f2f2f]
        "
      >
        <p className="text-[11px] text-gray-500">
          Enabled plugins can be used by CacheAI when answering your questions.
        </p>
      </div>
    </div>
  );
}
