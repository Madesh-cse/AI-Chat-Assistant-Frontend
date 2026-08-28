"use client";

import { useRef, useState, useEffect } from "react";
import {
  Send,
  Plus,
  FileText,
  X,
  AudioLines,
  Plug,
  ChevronDown,
  Check,
} from "lucide-react";

import VoiceButton from "../voice/VoiceButton";

interface ChatInputProps {
  onSend: (
    text: string,
    file: File | null,
    stackOverflowEnabled: boolean,
    notionEnabled: boolean,
  ) => void;

  loading: boolean;
  voiceMode: boolean;
  onVoiceModeChange: (enabled: boolean) => void;
}

// FILE SIZE FORMATTER

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;

  if (kb < 1024) {
    return `${kb.toFixed(0)} KB`;
  }

  const mb = kb / 1024;

  return `${mb.toFixed(1)} MB`;
}

// PASTE-TO-ATTACHMENT THRESHOLDS
//
// Pasting more than this many characters, or this many lines, turns
// the paste into a "Pasted text" card instead of inserting it inline
// into the textarea - mirrors Claude's behavior for large pastes.
// Small snippets (a few lines, a short paragraph) stay as normal
// inline text in the textarea - only genuinely large content becomes
// a card.

const PASTE_CHAR_THRESHOLD = 1500;
const PASTE_LINE_THRESHOLD = 15;

interface PastedContent {
  text: string;
  lineCount: number;
  looksLikeCode: boolean;
}

// Light heuristic to label the card "Pasted code" vs "Pasted text" -
// not meant to be a real language detector, just a nicer label.

function analyzePastedText(raw: string): PastedContent {
  const lineCount = raw.split("\n").length;

  const codeSignals = [
    /[{};]/, // braces / semicolons
    /^\s*(import|export|function|const|let|var|class|def|return)\b/m,
    /=>/,
    /^\s{2,}\S/m, // indentation
  ];

  const looksLikeCode = codeSignals.some((pattern) => pattern.test(raw));

  return {
    text: raw,
    lineCount,
    looksLikeCode,
  };
}

export default function ChatInput({
  onSend,
  loading,
  voiceMode,
  onVoiceModeChange,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pastedContent, setPastedContent] = useState<PastedContent | null>(
    null,
  );
  const [pastedPreviewOpen, setPastedPreviewOpen] = useState(false);
  const [pluginOpen, setPluginOpen] = useState(false);
  const [stackOverflowEnabled, setStackOverflowEnabled] = useState(false);
  const [notionEnabled, setnotionEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  function resizeTextarea() {
    const textarea = textInputRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const maxHeight = 200;

    const newHeight = Math.min(textarea.scrollHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }

  useEffect(() => {
    resizeTextarea();
  }, [text]);

  function submit() {
    const cleanText = text.trim();

    if (!cleanText && !file && !pastedContent) {
      return;
    }

    // Fold the pasted block back into the outgoing message (wrapped
    // as a fenced block) so the backend still just sees plain text -
    // only the composer UI treats it as a separate attachment.
    const finalText = pastedContent
      ? [cleanText, "```\n" + pastedContent.text + "\n```"]
          .filter(Boolean)
          .join("\n\n")
      : cleanText;

    onSend(finalText, file, stackOverflowEnabled, notionEnabled);

    setText("");

    setFile(null);

    setPastedContent(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    requestAnimationFrame(() => {
      const textarea = textInputRef.current;

      if (!textarea) {
        return;
      }

      textarea.style.height = "auto";

      textarea.style.overflowY = "hidden";
    });
  }

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);

    requestAnimationFrame(() => {
      resizeTextarea();
    });
  }

  function handlePaste(event: React.ClipboardEvent<HTMLTextAreaElement>) {
    const pastedText = event.clipboardData.getData("text");

    if (!pastedText) {
      return;
    }

    const lineCount = pastedText.split("\n").length;

    const isLargePaste =
      pastedText.length > PASTE_CHAR_THRESHOLD ||
      lineCount > PASTE_LINE_THRESHOLD;

    if (!isLargePaste) {
      // Small paste - let the browser insert it inline as normal.
      return;
    }

    // Large paste - keep it out of the textarea and show it as a
    // collapsed attachment card instead.
    event.preventDefault();

    setPastedContent(analyzePastedText(pastedText));

    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  }

  function removePastedContent() {
    setPastedContent(null);

    setPastedPreviewOpen(false);

    textInputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!loading) {
        submit();
      }

      return;
    }
  }

  function handleVoiceTranscript(transcript: string) {
    const cleanTranscript = transcript.trim();

    if (!cleanTranscript) {
      return;
    }

    if (voiceMode) {
      onSend(cleanTranscript, null, stackOverflowEnabled, notionEnabled);

      return;
    }

    setText((currentText) => {
      const current = currentText.trim();

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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");

      event.target.value = "";

      return;
    }

    const maxSize = 10 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      alert("PDF must be smaller than 10 MB.");

      event.target.value = "";

      return;
    }

    setFile(selectedFile);

    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  }

  function removeFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    textInputRef.current?.focus();
  }

  return (
    <div className="bg-[#212121] pt-2">
      <div className="max-w-3xl mx-auto px-3">
        {(file || pastedContent) && (
          <div className="mb-2 flex flex-wrap gap-2">
            {file && (
              <div
                className="
                  inline-flex
                  items-center
                  gap-3
                  bg-[#2a2a2a]
                  rounded-xl
                  px-3
                  py-2.5
                  border
                  border-[#3f3f3f]
                  shadow-sm
                  max-w-full
                "
              >
                {/* File type icon */}

                <div
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-lg
                    bg-[#c0392b]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText size={18} className="text-white" />
                </div>

                {/* Name + type/size label */}

                <div className="min-w-0 flex flex-col">
                  <span
                    className="
                      text-sm
                      text-white
                      font-medium
                      truncate
                      max-w-52
                    "
                    title={file.name}
                  >
                    {file.name}
                  </span>

                  <span className="text-xs text-gray-400">
                    PDF · {formatFileSize(file.size)}
                  </span>
                </div>

                {/* Remove button */}

                <button
                  type="button"
                  onClick={removeFile}
                  disabled={loading}
                  title="Remove PDF"
                  className="
                    ml-1
                    h-6
                    w-6
                    shrink-0
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    hover:bg-[#3a3a3a]
                    hover:text-white
                    transition
                    disabled:opacity-50
                  "
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {pastedContent && (
              <div
                onClick={() => setPastedPreviewOpen(true)}
                className="
                  inline-flex
                  items-center
                  gap-3
                  bg-[#2a2a2a]
                  rounded-xl
                  px-3
                  py-2.5
                  border
                  border-[#3f3f3f]
                  shadow-sm
                  max-w-full
                  cursor-pointer
                  hover:border-[#555]
                  transition
                "
              >
                {/* Pasted content icon */}

                <div
                  className="
                    h-10
                    w-10
                    shrink-0
                    rounded-lg
                    bg-[#2f5d8a]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText size={18} className="text-white" />
                </div>

                {/* Label + line count */}

                <div className="min-w-0 flex flex-col">
                  <span className="text-sm text-white font-medium truncate max-w-52">
                    {pastedContent.looksLikeCode
                      ? "Pasted code"
                      : "Pasted text"}
                  </span>

                  <span className="text-xs text-gray-400">
                    {pastedContent.lineCount} lines ·{" "}
                    {pastedContent.text.length.toLocaleString()} chars
                  </span>
                </div>

                {/* Remove button */}

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();

                    removePastedContent();
                  }}
                  disabled={loading}
                  title="Remove pasted content"
                  className="
                    ml-1
                    h-6
                    w-6
                    shrink-0
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    hover:bg-[#3a3a3a]
                    hover:text-white
                    transition
                    disabled:opacity-50
                  "
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {pastedPreviewOpen && pastedContent && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-center
              justify-center
              bg-black/60
              px-4
            "
            onClick={() => setPastedPreviewOpen(false)}
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="
                w-full
                max-w-2xl
                max-h-[70vh]
                flex
                flex-col
                bg-[#252525]
                rounded-xl
                border
                border-[#3f3f3f]
                shadow-2xl
                overflow-hidden
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  border-b
                  border-[#3a3a3a]
                "
              >
                <p className="text-sm font-medium text-white">
                  {pastedContent.looksLikeCode ? "Pasted code" : "Pasted text"}
                </p>

                <button
                  type="button"
                  onClick={() => setPastedPreviewOpen(false)}
                  className="
                    h-7
                    w-7
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-gray-400
                    hover:bg-[#3a3a3a]
                    hover:text-white
                    transition
                  "
                >
                  <X size={16} />
                </button>
              </div>

              <pre
                className="
                  overflow-auto
                  px-4
                  py-3
                  text-xs
                  text-gray-200
                  font-mono
                  whitespace-pre-wrap
                "
              >
                {pastedContent.text}
              </pre>
            </div>
          </div>
        )}

        <div
          className="
            relative
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            title="Upload PDF"
            aria-disabled
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
            "
          >
            <Plus size={22} />
          </button>

          <button
            type="button"
            onClick={() => setPluginOpen((current) => !current)}
            disabled={loading}
            title="Plugins"
            className={`
              flex
              items-center
              justify-center
              gap-1
              h-9
              px-2
              shrink-0
              rounded-lg
              transition
              text-sm

              ${
                stackOverflowEnabled
                  ? "bg-[#404040] text-white"
                  : "text-gray-300 hover:bg-[#404040] hover:text-white"
              }

              disabled:opacity-40
            `}
          >
            <Plug size={17} />

            <ChevronDown
              size={14}
              className={`
                transition-transform
                ${pluginOpen ? "rotate-180" : ""}
              `}
            />
          </button>

          {pluginOpen && (
            <div
              className="
                absolute
                bottom-full
                left-2
                mb-2
                w-72
                rounded-xl
                border
                border-[#3f3f3f]
                bg-[#252525]
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              {/* Header */}

              <div
                className="
                  px-4
                  py-3
                  border-b
                  border-[#3a3a3a]
                "
              >
                <p className="text-sm font-medium text-white">Plugins</p>

                <p className="text-xs text-gray-500 mt-1">
                  Give CacheAI access to useful tools.
                </p>
              </div>

              {/* Stack Overflow */}

              <button
                type="button"
                onClick={() => setStackOverflowEnabled((current) => !current)}
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  hover:bg-[#303030]
                  transition
                "
              >
                {/* SO icon */}

                <div
                  className="
                    h-9
                    w-9
                    shrink-0
                    rounded-lg
                    bg-[#f48024]
                    flex
                    items-center
                    justify-center
                    text-white
                    text-xs
                    font-bold
                  "
                >
                  SO
                </div>

                {/* Information */}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">
                    Stack Overflow
                  </p>

                  <p className="text-xs text-gray-500">
                    Search developer questions
                  </p>
                </div>

                {/* Toggle */}

                <div
                  className={`
                    relative
                    w-9
                    h-5
                    rounded-full
                    transition

                    ${stackOverflowEnabled ? "bg-orange-500" : "bg-[#4a4a4a]"}
                  `}
                >
                  <div
                    className={`
                      absolute
                      top-0.5
                      h-4
                      w-4
                      rounded-full
                      bg-white
                      transition-all

                      ${stackOverflowEnabled ? "left-4.5" : "left-0.5"}
                    `}
                  />
                </div>
              </button>

              {/* Notion Plugin */}
              <button
                type="button"
                onClick={() => setnotionEnabled((current) => !current)}
                className="
    w-full
    flex
    items-center
    gap-3
    px-4
    py-3
    text-left
    hover:bg-[#303030]
    transition
  "
              >
                {/* Notion icon */}

                <div
                  className="
      h-9
      w-9
      shrink-0
      rounded-lg
      bg-white
      flex
      items-center
      justify-center
      text-black
      text-sm
      font-bold
    "
                >
                  N
                </div>

                {/* Information */}

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium">Notion</p>

                  <p className="text-xs text-gray-500">
                    Search your Notion workspace
                  </p>
                </div>

                {/* Toggle */}

                <div
                  className={`
      relative
      w-9
      h-5
      rounded-full
      transition

      ${notionEnabled ? "bg-white" : "bg-[#4a4a4a]"}
    `}
                >
                  <div
                    className={`
        absolute
        top-0.5
        h-4
        w-4
        rounded-full
        bg-black
        transition-all

        ${notionEnabled ? "left-4.5" : "left-0.5"}
      `}
                  />
                </div>
              </button>
              {/* Footer */}
              <div
                className="
                  px-4
                  py-2
                  border-t
                  border-[#3a3a3a]
                "
              >
                <p className="text-[11px] text-gray-500">
                  {stackOverflowEnabled && notionEnabled
                    ? "Stack Overflow and Notion are enabled."
                    : stackOverflowEnabled
                      ? "Stack Overflow is enabled."
                      : notionEnabled
                        ? "Notion is enabled."
                        : "No plugins enabled."}
                </p>
              </div>
            </div>
          )}

          <textarea
            ref={textInputRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={loading}
            rows={1}
            placeholder={
              file
                ? "Ask something about this PDF..."
                : voiceMode
                  ? "Voice mode is active..."
                  : "Message CacheAI..."
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
              max-h-50
              overflow-y-hidden
            "
          />

          <button
            type="button"
            onClick={() => onVoiceModeChange(!voiceMode)}
            disabled={loading}
            title={voiceMode ? "Turn off voice mode" : "Turn on voice mode"}
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
            `}
          >
            <AudioLines size={18} />
          </button>

          <VoiceButton
            onTranscript={handleVoiceTranscript}
            disabled={loading}
            autoStart={voiceMode}
          />

          <button
            type="button"
            onClick={submit}
            disabled={loading || (!text.trim() && !file)}
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
