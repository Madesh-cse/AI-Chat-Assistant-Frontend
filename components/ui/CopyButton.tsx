"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  text: string;
}

export default function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="
        flex
        items-center
        gap-2
        rounded-md
        px-3
        py-1.5
        text-xs
        text-gray-300
        hover:bg-[#404040]
        transition-all
      "
    >
      {copied ? (
        <>
          <Check size={16} className="text-green-400" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={16} />
          Copy
        </>
      )}
    </button>
  );
}