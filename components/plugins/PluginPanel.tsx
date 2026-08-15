"use client";

import {
  X,
  Check,
  Plug,
} from "lucide-react";

import { usePluginStore } from "@/store/pluginStore";

interface PluginPanelProps {
  onClose: () => void;
}

export default function PluginPanel({
  onClose,
}: PluginPanelProps) {
  const {
    stackOverflowEnabled,
    toggleStackOverflow,
  } = usePluginStore();

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-lg
          mx-4
          bg-[#212121]
          border
          border-[#3a3a3a]
          rounded-2xl
          shadow-2xl
          text-white
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            px-5
            py-4
            border-b
            border-[#333]
          "
        >
          <div>
            <h2 className="text-lg font-semibold">
              Plugins
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Connect tools to your AI assistant
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              p-2
              rounded-lg
              text-gray-400
              hover:bg-[#303030]
              hover:text-white
              transition
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Plugin List */}

        <div className="p-4">

          {/* Stack Overflow */}

          <div
            className="
              rounded-xl
              border
              border-[#3a3a3a]
              bg-[#181818]
              p-4
            "
          >
            <div className="flex items-start gap-3">

              {/* Icon */}

              <div
                className="
                  w-10
                  h-10
                  rounded-lg
                  bg-[#303030]
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
              >
                <Plug size={19} />
              </div>

              {/* Information */}

              <div className="flex-1 min-w-0">

                <div className="flex items-center gap-2">

                  <h3 className="font-medium">
                    Stack Overflow
                  </h3>

                  {stackOverflowEnabled && (
                    <span
                      className="
                        text-xs
                        px-2
                        py-0.5
                        rounded-full
                        bg-green-500/10
                        text-green-400
                      "
                    >
                      Enabled
                    </span>
                  )}

                </div>

                <p
                  className="
                    text-sm
                    text-gray-400
                    mt-1
                    leading-relaxed
                  "
                >
                  Search programming questions,
                  answers, and developer solutions
                  from Stack Overflow.
                </p>

                {/* Toggle */}

                <button
                  type="button"
                  onClick={toggleStackOverflow}
                  className={`
                    mt-4
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-lg
                    text-sm
                    transition

                    ${
                      stackOverflowEnabled
                        ? "bg-[#303030] text-gray-200 hover:bg-[#3a3a3a]"
                        : "bg-white text-black hover:bg-gray-200"
                    }
                  `}
                >
                  {stackOverflowEnabled ? (
                    <>
                      <Check size={16} />
                      Enabled
                    </>
                  ) : (
                    <>
                      <Plug size={16} />
                      Enable
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}