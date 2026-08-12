"use client";

import {
  Volume2,
  VolumeX,
  Pause,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VoiceOutputProps {
  text: string;
  autoPlay?: boolean;
}

export default function VoiceOutput({
  text,
  autoPlay = false,
}: VoiceOutputProps) {
  const [speaking, setSpeaking] =
    useState(false);

  const [paused, setPaused] =
    useState(false);

  const [supported, setSupported] =
    useState(true);

  const lastTextRef =
    useRef("");

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      setSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!autoPlay) {
      return;
    }

    if (!text.trim()) {
      return;
    }

    if (text === lastTextRef.current) {
      return;
    }

    lastTextRef.current = text;

    speak(text);
  }, [text, autoPlay]);

  function speak(value: string) {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(
        value,
      );

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };

    utterance.onend = () => {
      setSpeaking(false);
      setPaused(false);
    };

    utterance.onerror = () => {
      setSpeaking(false);
      setPaused(false);
    };

    window.speechSynthesis.speak(
      utterance,
    );
  }

  function toggleSpeech() {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    if (speaking && !paused) {
      window.speechSynthesis.pause();
      setPaused(true);
      return;
    }

    if (speaking && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
      return;
    }

    if (text.trim()) {
      speak(text);
    }
  }

  function stopSpeech() {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    setSpeaking(false);
    setPaused(false);
  }

  if (!supported) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={toggleSpeech}
        title={
          speaking
            ? paused
              ? "Resume"
              : "Pause"
            : "Read aloud"
        }
        className="
          flex
          items-center
          justify-center
          w-8
          h-8
          rounded-lg
          text-gray-400
          hover:bg-[#404040]
          hover:text-white
          transition
        "
      >
        {speaking ? (
          paused ? (
            <Volume2 size={16} />
          ) : (
            <Pause size={16} />
          )
        ) : (
          <Volume2 size={16} />
        )}
      </button>

      {speaking && (
        <button
          type="button"
          onClick={stopSpeech}
          title="Stop"
          className="
            flex
            items-center
            justify-center
            w-8
            h-8
            rounded-lg
            text-gray-400
            hover:bg-[#404040]
            hover:text-white
            transition
          "
        >
          <VolumeX size={16} />
        </button>
      )}
    </div>
  );
}