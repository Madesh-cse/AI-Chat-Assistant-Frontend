"use client";

import { useEffect, useState } from "react";
import CopyButton from "./CopyButton";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  prism,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  language?: string;
  children: string;
}

export default function CodeBlock({
  language = "text",
  children,
}: Props) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="
        group
        relative
        my-6
        overflow-hidden
        rounded-2xl
        border
        border-(--border)
        bg-(--code-bg)
        shadow-lg
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-(--border)
          bg-(--code-header)
          px-4
          py-2
        "
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mac Dots */}
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          {/* Language Badge */}
          <span
            className="
              rounded-md
              bg-(--code-badge)
              px-2
              py-1
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-(--code-muted)
            "
          >
            {language}
          </span>
        </div>

        {/* Copy */}
        <CopyButton text={children} />
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={isDark ? vscDarkPlus : prism}
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "20px",
          background: "var(--code-bg)",
          fontSize: "14px",
          lineHeight: "1.8",
          borderRadius: 0,
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}