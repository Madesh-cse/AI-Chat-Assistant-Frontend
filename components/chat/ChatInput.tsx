"use client";

import { useRef, useState, useEffect } from "react";
import {
  Send,
  Plus,
  FileText,
  X,
  AudioLines,
} from "lucide-react";

import VoiceButton from "../voice/VoiceButton";

interface ChatInputProps {
  onSend: (text: string, file: File | null) => void;
  loading: boolean;
  voiceMode: boolean;
  onVoiceModeChange: (enabled: boolean) => void;
}

export default function ChatInput({
  onSend,
  loading,
  voiceMode,
  onVoiceModeChange,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const textInputRef =
    useRef<HTMLTextAreaElement>(null);

  // ==========================================
  // AUTO RESIZE TEXTAREA
  // ==========================================

  function resizeTextarea() {
    const textarea =
      textInputRef.current;

    if (!textarea) {
      return;
    }

    // Reset height first so shrinking works
    textarea.style.height = "auto";

    // Maximum height
    const maxHeight = 200;

    const newHeight = Math.min(
      textarea.scrollHeight,
      maxHeight,
    );

    textarea.style.height =
      `${newHeight}px`;

    // Enable scrolling only after max height
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight
        ? "auto"
        : "hidden";
  }

  // Resize whenever text changes
  useEffect(() => {
    resizeTextarea();
  }, [text]);

  // ==========================================
  // SUBMIT
  // ==========================================

  function submit() {
    const cleanText =
      text.trim();

    if (!cleanText && !file) {
      return;
    }

    onSend(
      cleanText,
      file,
    );

    setText("");
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Reset textarea after sending
    requestAnimationFrame(() => {
      const textarea =
        textInputRef.current;

      if (!textarea) {
        return;
      }

      textarea.style.height =
        "auto";

      textarea.style.overflowY =
        "hidden";
    });
  }

  // ==========================================
  // TEXT CHANGE
  // ==========================================

  function handleTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setText(event.target.value);

    // Resize immediately for typing/pasting
    requestAnimationFrame(() => {
      resizeTextarea();
    });
  }

  // ==========================================
  // KEYBOARD
  // ==========================================

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    // Enter = send
    // Shift + Enter = new line

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      if (!loading) {
        submit();
      }

      return;
    }

    // Shift + Enter
    // Let browser insert newline normally
  }

  // ==========================================
  // VOICE TRANSCRIPT
  // ==========================================

  function handleVoiceTranscript(
    transcript: string,
  ) {
    const cleanTranscript =
      transcript.trim();

    if (!cleanTranscript) {
      return;
    }

    if (voiceMode) {
      onSend(
        cleanTranscript,
        null,
      );

      return;
    }

    setText((currentText) => {
      const current =
        currentText.trim();

      if (!current) {
        return cleanTranscript;
      }

      return `${current} ${cleanTranscript}`;
    });

    requestAnimationFrame(() => {
      textInputRef.current?.focus();
      resizeTextarea();
    });
  }

  // ==========================================
  // FILE CHANGE
  // ==========================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    // PDF only
    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      alert(
        "Please upload a PDF file.",
      );

      event.target.value = "";

      return;
    }

    // 10 MB limit
    const maxSize =
      10 * 1024 * 1024;

    if (
      selectedFile.size >
      maxSize
    ) {
      alert(
        "PDF must be smaller than 10 MB.",
      );

      event.target.value = "";

      return;
    }

    setFile(selectedFile);

    // Focus textarea
    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  }

  // ==========================================
  // REMOVE FILE
  // ==========================================

  function removeFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    textInputRef.current?.focus();
  }

  return (
    <div className="pt-2 pb-3 bg-[#1e1e1e]">
      <div className="max-w-3xl mx-auto px-3">

        {/* ======================================
            FILE PREVIEW
        ====================================== */}

        {file && (
          <div className="mb-2">
            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-[#303030]
                text-white
                rounded-lg
                px-3
                py-2
                text-sm
                border
                border-[#444]
              "
            >
              <FileText
                size={18}
                className="text-gray-300"
              />

              <span
                className="
                  max-w-[250px]
                  truncate
                "
              >
                {file.name}
              </span>

              <button
                type="button"
                onClick={removeFile}
                disabled={loading}
                title="Remove PDF"
                className="
                  ml-1
                  text-gray-400
                  hover:text-white
                  transition
                  disabled:opacity-50
                "
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ======================================
            CHAT INPUT
        ====================================== */}

        <div
          className="
            flex
            gap-2
            items-end
            bg-[#303030]
            rounded-2xl
            px-2
            py-2
            border
            border-[#3f3f3f]
            focus-within:border-[#555]
            transition
          "
        >

          {/* ====================================
              PDF INPUT
          ==================================== */}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={loading}
            title="Upload PDF"
            className="
              flex
              items-center
              justify-center
              w-9
              h-9
              shrink-0
              rounded-lg
              text-gray-300
              hover:bg-[#404040]
              hover:text-white
              transition
              disabled:opacity-40
              disabled:cursor-not-allowed
            "
          >
            <Plus size={22} />
          </button>

          {/* ====================================
              AUTO GROW TEXTAREA
          ==================================== */}

          <textarea
            ref={textInputRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            placeholder={
              file
                ? "Ask something about this PDF..."
                : voiceMode
                  ? "Voice mode is active..."
                  : "Message AI..."
            }
            className="
              flex-1
              min-w-0
              bg-transparent
              text-white
              resize-none
              outline-none
              border-none
              px-2
              py-2
              leading-6
              placeholder:text-gray-500
              max-h-[200px]
              overflow-y-hidden

              scrollbar-thin
              scrollbar-thumb-[#555]
              scrollbar-track-transparent
            "
          />

          {/* ====================================
              VOICE MODE
          ==================================== */}

          <button
            type="button"
            onClick={() =>
              onVoiceModeChange(
                !voiceMode,
              )
            }
            disabled={loading}
            title={
              voiceMode
                ? "Turn off voice mode"
                : "Turn on voice mode"
            }
            className={`
              flex
              items-center
              justify-center
              w-9
              h-9
              shrink-0
              rounded-lg
              transition

              ${
                voiceMode
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "text-gray-300 hover:bg-[#404040] hover:text-white"
              }

              disabled:opacity-40
              disabled:cursor-not-allowed
            `}
          >
            <AudioLines size={18} />
          </button>

          {/* ====================================
              MICROPHONE
          ==================================== */}

          <VoiceButton
            onTranscript={
              handleVoiceTranscript
            }
            disabled={loading}
            autoStart={voiceMode}
          />

          {/* ====================================
              SEND
          ==================================== */}

          <button
            type="button"
            onClick={submit}
            disabled={
              loading ||
              (!text.trim() && !file)
            }
            title="Send"
            className="
              bg-white
              text-black
              rounded-lg
              w-9
              h-9
              shrink-0
              flex
              items-center
              justify-center
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition
              hover:bg-gray-200
            "
          >
            <Send size={18} />
          </button>

        </div>

        {/* ======================================
            HELPER TEXT
        ====================================== */}

        <p
          className="
            text-center
            text-[11px]
            text-gray-600
            mt-2
          "
        >
          Enter to send · Shift + Enter for new line
        </p>

      </div>
    </div>
  );
}