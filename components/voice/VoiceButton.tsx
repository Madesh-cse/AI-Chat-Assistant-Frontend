"use client";

import { Mic, MicOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  autoStart?: boolean;
}

interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;

  start: () => void;
  stop: () => void;
  abort: () => void;

  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function VoiceButton({
  onTranscript,
  disabled = false,
  autoStart = false,
}: VoiceButtonProps) {
  const recognitionRef =
    useRef<SpeechRecognitionLike | null>(null);

  const onTranscriptRef =
    useRef(onTranscript);

  const isListeningRef =
    useRef(false);

  const isStartingRef =
    useRef(false);

  const isMountedRef =
    useRef(false);

  const autoStartRef =
    useRef(autoStart);

  const [isListening, setIsListening] =
    useState(false);

  const [supported, setSupported] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // Keep latest callbacks and mode.

  useEffect(() => {
    onTranscriptRef.current =
      onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    autoStartRef.current =
      autoStart;
  }, [autoStart]);

  // Initialize speech recognition.

  useEffect(() => {
    isMountedRef.current = true;

    if (typeof window === "undefined") {
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      console.log(
        "🎤 Speech recognition started",
      );

      isStartingRef.current = false;
      isListeningRef.current = true;

      if (isMountedRef.current) {
        setIsListening(true);
        setError(null);
      }
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results[0]?.[0]?.transcript?.trim();

      console.log(
        "🎤 Transcript:",
        transcript,
      );

      if (transcript) {
        onTranscriptRef.current(
          transcript,
        );
      }
    };

    recognition.onerror = (event) => {
      console.log(
        "Speech recognition:",
        event.error,
      );

      /*
       * "aborted" normally means recognition
       * was stopped intentionally.
       */
      if (event.error === "aborted") {
        isStartingRef.current = false;
        isListeningRef.current = false;

        if (isMountedRef.current) {
          setIsListening(false);
        }

        return;
      }

      if (event.error === "not-allowed") {
        setError(
          "Microphone permission denied.",
        );
      } else if (
        event.error === "no-speech"
      ) {
        setError(
          "No speech detected.",
        );
      } else if (
        event.error === "audio-capture"
      ) {
        setError(
          "Microphone could not be accessed.",
        );
      } else if (
        event.error === "network"
      ) {
        setError(
          "Speech recognition network error.",
        );
      } else {
        setError(
          "Voice recognition failed.",
        );
      }

      isStartingRef.current = false;
      isListeningRef.current = false;

      if (isMountedRef.current) {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      console.log(
        "🎤 Speech recognition ended",
      );

      isStartingRef.current = false;
      isListeningRef.current = false;

      if (isMountedRef.current) {
        setIsListening(false);
      }
    };

    recognitionRef.current =
      recognition;

    return () => {
      isMountedRef.current = false;

      isStartingRef.current = false;
      isListeningRef.current = false;

      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.abort();
      } catch {
        // Recognition may already be stopped.
      }

      recognitionRef.current = null;
    };
  }, []);

  // Auto-start voice mode.

  useEffect(() => {
    if (!autoStart) {
      return;
    }

    if (disabled) {
      return;
    }

    const timer =
      window.setTimeout(() => {
        startListening();
      }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoStart, disabled]);

  // Stop when voice mode is disabled.

  useEffect(() => {
    if (autoStart) {
      return;
    }

    if (!isListeningRef.current) {
      return;
    }

    stopListening();
  }, [autoStart]);

  function startListening() {
    if (disabled) {
      return;
    }

    const recognition =
      recognitionRef.current;

    if (!recognition) {
      setError(
        "Speech recognition is unavailable.",
      );

      return;
    }

    if (isListeningRef.current) {
      return;
    }

    if (isStartingRef.current) {
      return;
    }

    isStartingRef.current = true;

    setError(null);

    try {
      recognition.start();

      console.log(
        "🎤 Starting microphone...",
      );
    } catch (error) {
      isStartingRef.current = false;

      console.error(
        "Failed to start speech recognition:",
        error,
      );
    }
  }

  function stopListening() {
    const recognition =
      recognitionRef.current;

    if (!recognition) {
      return;
    }

    if (
      !isListeningRef.current &&
      !isStartingRef.current
    ) {
      return;
    }

    try {
      recognition.stop();

      console.log(
        "🎤 Stopping microphone...",
      );
    } catch (error) {
      console.error(
        "Failed to stop speech recognition:",
        error,
      );
    }
  }

  function toggleListening() {
    if (disabled) {
      return;
    }

    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }

  if (!supported) {
    return (
      <button
        type="button"
        disabled
        title="Voice input is not supported in this browser"
        className="
          flex
          items-center
          justify-center
          w-9
          h-9
          rounded-lg
          text-gray-500
          cursor-not-allowed
        "
      >
        <MicOff size={18} />
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        title={
          isListening
            ? "Stop listening"
            : "Voice input"
        }
        className={`
          flex
          items-center
          justify-center
          w-9
          h-9
          rounded-lg
          transition

          ${
            isListening
              ? `
                bg-red-500
                text-white
                hover:bg-red-600
              `
              : `
                text-gray-300
                hover:bg-[#404040]
                hover:text-white
              `
          }

          disabled:opacity-40
          disabled:cursor-not-allowed
        `}
      >
        <Mic
          size={18}
          className={
            isListening
              ? "animate-pulse"
              : ""
          }
        />
      </button>

      {isListening && (
        <div
          className="
            absolute
            bottom-11
            right-0
            whitespace-nowrap
            bg-[#303030]
            border
            border-[#444]
            rounded-lg
            px-3
            py-2
            text-xs
            text-gray-300
            shadow-lg
            z-50
          "
        >
          🎤 Listening...
        </div>
      )}

      {error && (
        <div
          className="
            absolute
            bottom-11
            right-0
            whitespace-nowrap
            bg-[#303030]
            border
            border-red-500/30
            rounded-lg
            px-3
            py-2
            text-xs
            text-red-300
            shadow-lg
            z-50
          "
        >
          {error}
        </div>
      )}
    </div>
  );
}