"use client";

import { X, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface PluginPanelProps {
  onClose: () => void;
}

export default function PluginPanel({ onClose }: PluginPanelProps) {
  const { t } = useLanguage();

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
        flex
        flex-col
        bg-(--background)
        text-(--foreground)
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
          border-(--border)
          bg-(--background)
        "
      >
        <div>
          <h2 className="text-sm font-semibold text-(--foreground)">
            {t("plugins")}
          </h2>

          <p className="mt-1 text-xs text-(--muted)">
            Connect tools to CacheAI.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            rounded-lg
            p-2
            text-(--muted)
            hover:bg-(--hover)
            hover:text-(--foreground)
            transition
          "
          title="Close plugins"
          aria-label="Close plugins"
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
          bg-(--background)
        "
      >
        {/* =======================================
            STACK OVERFLOW
        ======================================= */}

        <PluginCard
          name="Stack Overflow"
          description="Search developer questions"
          icon={
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
          }
          enabled={stackOverflowEnabled}
          onToggle={toggleStackOverflow}
          enabledClassName="bg-orange-500 text-white hover:bg-orange-600"
        />

        {/* =======================================
            NOTION
        ======================================= */}

        <PluginCard
          name="Notion"
          description="Search your Notion workspace"
          icon={
            <div
              className="
                h-10
                w-10
                shrink-0
                rounded-lg
                bg-(--foreground)
                flex
                items-center
                justify-center
                text-(--background)
                text-sm
                font-bold
              "
            >
              N
            </div>
          }
          enabled={notionEnabled}
          onToggle={toggleNotion}
          enabledClassName="
            bg-(--foreground)
            text-(--background)
            hover:opacity-80
          "
        />
      </div>

      {/* =========================================
          FOOTER
      ========================================= */}

      <div
        className="
          shrink-0
          px-4
          py-3
          border-t
          border-(--border)
          bg-(--background)
        "
      >
        <p className="text-[11px] text-(--muted)">
          Enabled plugins can be used by CacheAI when answering your questions.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Plugin Card */
/* -------------------------------- */

function PluginCard({
  name,
  description,
  icon,
  enabled,
  onToggle,
  enabledClassName,
}: {
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
  onToggle: () => void;
  enabledClassName: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-(--border)
        bg-(--card)
        p-3
        transition
        hover:bg-(--hover)
      "
    >
      {/* Icon */}
      {icon}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-(--foreground)">{name}</p>

        <p className="mt-0.5 text-xs text-(--muted)">{description}</p>
      </div>

      {/* Enable Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={enabled}
        className={`
          shrink-0
          flex
          items-center
          gap-1.5
          rounded-lg
          px-3
          py-1.5
          text-xs
          font-medium
          transition

          ${
            enabled
              ? enabledClassName
              : `
                bg-(--active)
                text-(--foreground)
                hover:bg-(--hover)
              `
          }
        `}
      >
        {enabled && <Check size={13} />}

        {enabled ? "Enabled" : "Enable"}
      </button>
    </div>
  );
}
