"use client";

import { useEffect, useRef } from "react";

export function useAutoScroll(messages: any[]) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return bottomRef;
}
