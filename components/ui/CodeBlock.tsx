"use client";

import CopyButton from "./CopyButton";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  language?: string;
  children: string;
}

export default function CodeBlock({ language = "text", children }: Props) {
  return (
    <div
      className="
        group
        relative
        my-6
        overflow-hidden
        rounded-2xl
        border
        border-[#3a3a3a]
        bg-[#181818]
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
          border-[#333]
          bg-[#111111]
          px-4
          py-2
        "
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          {/* Mac Dots */}
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>

          {/* Language Badge */}
          <span
            className="
              rounded-md
              bg-[#2a2a2a]
              px-2
              py-1
              text-xs
              font-medium
              uppercase
              tracking-wide
              text-gray-300
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
        style={vscDarkPlus}
        wrapLongLines
        customStyle={{
          margin: 0,
          padding: "20px",
          background: "#181818",
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
