"use client";

import { useState } from "react";
import {
  Code2,
  GraduationCap,
  PenLine,
  Coffee,
  Sparkles,
  LucideIcon,
} from "lucide-react";


interface QuickAction {
  key: string;
  label: string;
  icon: LucideIcon;
  prompt: string;
}

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}


const ACTIONS: QuickAction[] = [
  {
    key: "code",
    label: "Code",
    icon: Code2,
    prompt: "Help me debug this piece of code:\n\n",
  },
  {
    key: "learn",
    label: "Learn",
    icon: GraduationCap,
    prompt: "Explain this concept to me like I'm new to it:\n\n",
  },
  {
    key: "write",
    label: "Write",
    icon: PenLine,
    prompt: "Help me write ",
  },
  {
    key: "life",
    label: "Life stuff",
    icon: Coffee,
    prompt: "I need advice about ",
  },
  {
    key: "choice",
    label: "Claude's choice",
    icon: Sparkles,
    prompt: "Surprise me with something interesting to explore today.",
  },
];


export default function QuickActions({
  onSelect,
  disabled = false,
}: QuickActionsProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  function handleClick(action: QuickAction) {
    setActiveKey(action.key);
    onSelect(action.prompt);
  }

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
        mt-4
        px-2
      "
    >
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        const isActive = activeKey === action.key;

        return (
          <button
            key={action.key}
            type="button"
            onClick={() => handleClick(action)}
            disabled={disabled}
            className={`
              inline-flex
              items-center
              gap-1.5
              px-3.5
              py-2
              rounded-full
              text-sm
              border
              border-(--border)
              transition
              touch-manipulation
              disabled:opacity-40
              disabled:cursor-not-allowed

              ${
                isActive
                  ? "bg-(--foreground)/10 text-(--foreground)"
                  : "bg-(--foreground)/5 text-(--muted) hover:bg-(--foreground)/10 hover:text-(--foreground)"
              }
            `}
          >
            <Icon size={15} />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}