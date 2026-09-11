"use client";

import { useEffect, useRef, useState } from "react";
import {
  Code2,
  GraduationCap,
  PenLine,
  Coffee,
  Sparkles,
  X,
  LucideIcon,
} from "lucide-react";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

interface QuickActionSuggestion {
  label: string;
  prompt: string;
}

interface QuickAction {
  key: string;
  label: string;
  icon: LucideIcon;
  suggestions: QuickActionSuggestion[];
}

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

// --------------------------------------------------
// CONFIG - edit freely
// --------------------------------------------------

const ACTIONS: QuickAction[] = [
  {
    key: "code",
    label: "Code",
    icon: Code2,
    suggestions: [
      {
        label: "Create debugging workflows",
        prompt: "Help me create a debugging workflow for ",
      },
      {
        label: "Create monitoring solutions",
        prompt: "Help me design a monitoring solution for ",
      },
      {
        label: "Debug my code and give me tips",
        prompt: "Help me debug this piece of code and give me tips:\n\n",
      },
      {
        label: "Create dependency maps",
        prompt: "Help me create a dependency map for ",
      },
      {
        label: "Create technical specifications",
        prompt: "Help me write a technical specification for ",
      },
    ],
  },
  {
    key: "learn",
    label: "Learn",
    icon: GraduationCap,
    suggestions: [
      {
        label: "Explain a concept simply",
        prompt: "Explain this concept to me like I'm new to it:\n\n",
      },
      {
        label: "Create a study plan",
        prompt: "Help me create a study plan for ",
      },
      {
        label: "Quiz me on a topic",
        prompt: "Quiz me on ",
      },
      {
        label: "Summarize an article or paper",
        prompt: "Summarize this for me:\n\n",
      },
      {
        label: "Compare two ideas",
        prompt: "Compare and contrast ",
      },
    ],
  },
  {
    key: "write",
    label: "Write",
    icon: PenLine,
    suggestions: [
      {
        label: "Draft an email",
        prompt: "Help me write an email about ",
      },
      {
        label: "Improve my writing",
        prompt: "Help me improve this piece of writing:\n\n",
      },
      {
        label: "Write a blog post",
        prompt: "Write a blog post about ",
      },
      {
        label: "Brainstorm ideas",
        prompt: "Help me brainstorm ideas for ",
      },
      {
        label: "Write a cover letter",
        prompt: "Help me write a cover letter for ",
      },
    ],
  },
  {
    key: "life",
    label: "Life stuff",
    icon: Coffee,
    suggestions: [
      {
        label: "Plan my week",
        prompt: "Help me plan my week. Here's what's on my plate:\n\n",
      },
      {
        label: "Get advice on a decision",
        prompt: "I need advice about ",
      },
      {
        label: "Plan a trip",
        prompt: "Help me plan a trip to ",
      },
      {
        label: "Suggest a recipe",
        prompt: "Suggest a recipe using ",
      },
      {
        label: "Help me budget",
        prompt: "Help me put together a budget for ",
      },
    ],
  },
  {
    key: "choice",
    label: "Veronica's choice",
    icon: Sparkles,
    suggestions: [
      {
        label: "Surprise me with something interesting",
        prompt: "Surprise me with something interesting to explore today.",
      },
      {
        label: "Teach me something new",
        prompt: "Teach me something new I probably don't know.",
      },
      {
        label: "Give me a fun challenge",
        prompt: "Give me a small, fun challenge to try right now.",
      },
    ],
  },
];

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

export default function QuickActions({
  onSelect,
  disabled = false,
}: QuickActionsProps) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openAction = ACTIONS.find((action) => action.key === openKey) ?? null;

  // Close the panel on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenKey(null);
      }
    }

    if (openKey) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openKey]);

  // Close the panel on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenKey(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handlePillClick(action: QuickAction) {
    setOpenKey((current) => (current === action.key ? null : action.key));
  }

  function handleSuggestionClick(prompt: string) {
    onSelect(prompt);
    setOpenKey(null);
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* PILL ROW */}
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
          const isOpen = openKey === action.key;

          return (
            <button
              key={action.key}
              type="button"
              onClick={() => handlePillClick(action)}
              disabled={disabled}
              aria-expanded={isOpen}
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
                  isOpen
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

      {/* SUGGESTIONS PANEL */}
      {openAction && (() => {
        const OpenIcon = openAction.icon;

        return (
        <div
          className="
            absolute
            left-1/2
            -translate-x-1/2
            top-full
            mt-2
            w-full
            max-w-3xl
            rounded-xl
            border
            border-(--border)
            bg-(--card)
            shadow-2xl
            overflow-hidden
            z-40
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              items-center
              justify-between
              gap-2
              px-4
              py-3
              border-b
              border-(--border)
            "
          >
            <div className="flex items-center gap-2 text-sm text-(--muted)">
              <OpenIcon size={15} />
              <span>{openAction.label}</span>
            </div>

            <button
              type="button"
              onClick={() => setOpenKey(null)}
              title="Close"
              aria-label="Close"
              className="
                h-7
                w-7
                flex
                items-center
                justify-center
                rounded-full
                text-(--muted)
                hover:bg-(--foreground)/10
                hover:text-(--foreground)
                transition
                touch-manipulation
              "
            >
              <X size={14} />
            </button>
          </div>

          {/* SUGGESTIONS */}
          <div className="max-h-72 overflow-y-auto">
            {openAction.suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion.prompt)}
                className="
                  w-full
                  text-left
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-(--foreground)
                  border-b
                  border-(--border)
                  last:border-b-0
                  hover:bg-(--foreground)/8
                  transition
                  touch-manipulation
                "
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
        );
      })()}
    </div>
  );
}