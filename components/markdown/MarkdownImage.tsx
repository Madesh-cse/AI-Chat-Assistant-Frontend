"use client";

import { useState } from "react";

interface Props {
  src?: string;
  alt?: string;
}

export default function MarkdownImage({
  src,
  alt,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src || ""}
        alt={alt}
        onClick={() => setOpen(true)}
        className="
          rounded-2xl
          cursor-pointer
          my-8
          shadow-xl
          hover:scale-[1.02]
          transition
        "
      />

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            bg-black/80
            flex
            items-center
            justify-center
            z-50
          "
        >
          <img
            src={src || ""}
            className="max-h-[90vh] rounded-xl"
          />
        </div>
      )}
    </>
  );
}