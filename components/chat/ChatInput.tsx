"use client";

import { useRef, useState } from "react";
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
    useRef<HTMLInputElement>(null);

  function submit() {
    const cleanText = text.trim();

    if (!cleanText && !file) {
      return;
    }

    onSend(cleanText, file);

    setText("");
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleVoiceTranscript(
    transcript: string,
  ) {
    const cleanTranscript =
      transcript.trim();

    if (!cleanTranscript) {
      return;
    }

    if (voiceMode) {
      onSend(cleanTranscript, null);
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

    textInputRef.current?.focus();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

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

    const maxSize =
      10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert(
        "PDF must be smaller than 10 MB.",
      );

      event.target.value = "";

      return;
    }

    setFile(selectedFile);
  }

  function removeFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="pt-2 pb-3 bg-[#1e1e1e]">
      <div className="max-w-3xl mx-auto px-3">

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

        <div
          className="
            flex
            gap-2
            items-center
            bg-[#303030]
            rounded-xl
            p-2
            border
            border-[#3f3f3f]
          "
        >

          {/* PDF */}

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

          {/* Text */}

          <input
            ref={textInputRef}
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder={
              file
                ? "Ask something about this PDF..."
                : voiceMode
                  ? "Voice mode is active..."
                  : "Message AI..."
            }
            disabled={loading}
            className="
              flex-1
              bg-transparent
              text-white
              p-2
              outline-none
              placeholder:text-gray-500
              min-w-0
            "
          />

          {/* Voice mode */}

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

          {/* Microphone */}

          <VoiceButton
            onTranscript={
              handleVoiceTranscript
            }
            disabled={loading}
            autoStart={voiceMode}
          />

          {/* Send */}

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
              flex
              items-center
              justify-center
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition
            "
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}