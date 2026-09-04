
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
} from "lucide-react";

import VoiceButton from "../voice/VoiceButton";
import { useSettings } from "@/context/SettingsContext";

interface ChatInputProps {
  onSend: (
    text: string,
    file: File | null,
    stackOverflowEnabled: boolean,
    notionEnabled: boolean,
    language: string,
  ) => void;

  loading: boolean;
  voiceMode: boolean;
  onVoiceModeChange: (enabled: boolean) => void;
}

// --------------------------------------------------
// FILE SIZE FORMATTER
// --------------------------------------------------

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

// --------------------------------------------------
// PASTE CONFIG
// --------------------------------------------------

const PASTE_CHAR_THRESHOLD = 1500;
const PASTE_LINE_THRESHOLD = 15;

interface PastedContent {
  text: string;
  lineCount: number;
  looksLikeCode: boolean;
}

function analyzePastedText(raw: string): PastedContent {
  const lineCount = raw.split("\n").length;

  const codeSignals = [
    /[{};]/,
    /^\s*(import|export|function|const|let|var|class|def|return)\b/m,
    /=>/,
    /^\s{2,}\S/m,
  ];

  const looksLikeCode = codeSignals.some((pattern) =>
    pattern.test(raw),
  );

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
  const { language } = useSettings();

  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [pastedContent, setPastedContent] =
    useState<PastedContent | null>(null);

  const [pastedPreviewOpen, setPastedPreviewOpen] =
    useState(false);

  const [pluginOpen, setPluginOpen] = useState(false);

  const [stackOverflowEnabled, setStackOverflowEnabled] =
    useState(false);

  const [notionEnabled, setNotionEnabled] =
    useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);


  function resizeTextarea() {
    const textarea = textInputRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";

    const maxHeight = 200;

    const newHeight = Math.min(
      textarea.scrollHeight,
      maxHeight,
    );

    textarea.style.height = `${newHeight}px`;

    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight
        ? "auto"
        : "hidden";
  }

  useEffect(() => {
    resizeTextarea();
  }, [text]);


  function submit() {
    const cleanText = text.trim();

    if (!cleanText && !file && !pastedContent) {
      return;
    }

    const finalText = pastedContent
      ? [
          cleanText,
          "```\n" + pastedContent.text + "\n```",
        ]
          .filter(Boolean)
          .join("\n\n")
      : cleanText;

    onSend(
      finalText,
      file,
      stackOverflowEnabled,
      notionEnabled,
      language,
    );

    setText("");
    setFile(null);
    setPastedContent(null);
    setPastedPreviewOpen(false);

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

  function handleTextChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setText(event.target.value);

    requestAnimationFrame(() => {
      resizeTextarea();
    });
  }

  function handlePaste(
    event: React.ClipboardEvent<HTMLTextAreaElement>,
  ) {
    const pastedText =
      event.clipboardData.getData("text");

    if (!pastedText) {
      return;
    }

    const lineCount = pastedText.split("\n").length;

    const isLargePaste =
      pastedText.length > PASTE_CHAR_THRESHOLD ||
      lineCount > PASTE_LINE_THRESHOLD;

    if (!isLargePaste) {
      return;
    }

    event.preventDefault();

    setPastedContent(
      analyzePastedText(pastedText),
    );

    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  }


  function removePastedContent() {
    setPastedContent(null);
    setPastedPreviewOpen(false);

    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  }
-

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
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
  }

  // --------------------------------------------------
  // VOICE TRANSCRIPT
  // --------------------------------------------------

  function handleVoiceTranscript(
    transcript: string,
  ) {
    const cleanTranscript = transcript.trim();

    if (!cleanTranscript) {
      return;
    }

    if (voiceMode) {
      onSend(
        cleanTranscript,
        null,
        stackOverflowEnabled,
        notionEnabled,
        language,
      );

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

  // --------------------------------------------------
  // FILE
  // --------------------------------------------------

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

  // --------------------------------------------------
  // REMOVE FILE
  // --------------------------------------------------

  function removeFile() {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    requestAnimationFrame(() => {
      textInputRef.current?.focus();
    });
  }

  const canSend =
    !loading &&
    (!!text.trim() ||
      !!file ||
      !!pastedContent);


  return (
    <div className="bg-(--background) pt-2 pb-2">
      <div className="w-full max-w-3xl mx-auto px-2 sm:px-3">

        {(file || pastedContent) && (
          <div
            className="
              mb-2
              flex
              gap-2
              overflow-x-auto
              scrollbar-none
              pb-0.5
            "
          >
            {/* PDF */}
            {file && (
              <div
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-3
                  bg-(--foreground)/8
                  rounded-xl
                  px-3
                  py-2.5
                  border
                  border-(--border)
                  shadow-sm
                  max-w-[85vw]
                  sm:max-w-full
                "
              >
                <div
                  className="
                    h-9
                    w-9
                    sm:h-10
                    sm:w-10
                    shrink-0
                    rounded-lg
                    bg-[#c0392b]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText
                    size={18}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0 flex flex-col">
                  <span
                    className="
                      text-sm
                      text-(--foreground)
                      font-medium
                      truncate
                      max-w-45
                      sm:max-w-52
                    "
                    title={file.name}
                  >
                    {file.name}
                  </span>

                  <span className="text-xs text-(--muted)">
                    PDF · {formatFileSize(file.size)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={removeFile}
                  disabled={loading}
                  title="Remove PDF"
                  className="
                    ml-1
                    h-7
                    w-7
                    shrink-0
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-(--muted)
                    hover:bg-(--foreground)/10
                    hover:text-(--foreground)
                    transition
                    disabled:opacity-50
                    touch-manipulation
                  "
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* PASTED CONTENT */}
            {pastedContent && (
              <div
                onClick={() =>
                  setPastedPreviewOpen(true)
                }
                className="
                  inline-flex
                  shrink-0
                  items-center
                  gap-3
                  bg-(--foreground)/8
                  rounded-xl
                  px-3
                  py-2.5
                  border
                  border-(--border)
                  shadow-sm
                  max-w-[85vw]
                  sm:max-w-full
                  cursor-pointer
                  hover:border-(--foreground)/20
                  transition
                  touch-manipulation
                "
              >
                <div
                  className="
                    h-9
                    w-9
                    sm:h-10
                    sm:w-10
                    shrink-0
                    rounded-lg
                    bg-[#2f5d8a]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FileText
                    size={18}
                    className="text-white"
                  />
                </div>

                <div className="min-w-0 flex flex-col">
                  <span
                    className="
                      text-sm
                      text-(--foreground)
                      font-medium
                      truncate
                      max-w-45
                      sm:max-w-52
                    "
                  >
                    {pastedContent.looksLikeCode
                      ? "Pasted code"
                      : "Pasted text"}
                  </span>

                  <span className="text-xs text-(--muted)">
                    {pastedContent.lineCount} lines ·{" "}
                    {pastedContent.text.length.toLocaleString()}{" "}
                    chars
                  </span>
                </div>

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
                    h-7
                    w-7
                    shrink-0
                    flex
                    items-center
                    justify-center
                    rounded-full
                    text-(--muted)
                    hover:bg-(--foreground)/10
                    hover:text-(--foreground)
                    transition
                    disabled:opacity-50
                    touch-manipulation
                  "
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {pastedPreviewOpen &&
          pastedContent && (
            <div
              className="
                fixed
                inset-0
                z-100
                flex
                items-center
                justify-center
                bg-black/60
                px-3
                sm:px-4
              "
              onClick={() =>
                setPastedPreviewOpen(false)
              }
            >
              <div
                onClick={(event) =>
                  event.stopPropagation()
                }
                className="
                  w-full
                  max-w-2xl
                  max-h-[80vh]
                  flex
                  flex-col
                  bg-(--card)
                  rounded-xl
                  border
                  border-(--border)
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
                    border-(--border)
                    shrink-0
                  "
                >
                  <p className="text-sm font-medium text-(--foreground)">
                    {pastedContent.looksLikeCode
                      ? "Pasted code"
                      : "Pasted text"}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setPastedPreviewOpen(false)
                    }
                    className="
                      h-8
                      w-8
                      flex
                      items-center
                      justify-center
                      rounded-full
                      text-(--muted)
                      hover:bg-(--foreground)/10
                      hover:text-(--foreground)
                      transition
                      touch-manipulation
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
                    text-(--foreground)
                    font-mono
                    whitespace-pre-wrap
                    wrap-break-words
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
            flex-col
            gap-1
            bg-(--foreground)/8
            rounded-2xl
            px-2
            py-2
            border
            border-(--border)
            focus-within:border-(--foreground)/30
            transition
          "
        >
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <textarea
            ref={textInputRef}
            value={text}
            onChange={handleTextChange}
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
              w-full
              min-w-0
              bg-transparent
              text-(--foreground)
              resize-none
              outline-none
              border-none
              px-2
              py-2
              leading-6
              placeholder:text-(--muted)
              max-h-50
              overflow-y-hidden
              text-[15px]
              sm:text-sm
            "
          />

          <div
            className="
              flex
              items-center
              justify-between
              gap-1
              px-0.5
              sm:px-1
            "
          >

            <div className="flex items-center gap-0.5 sm:gap-1">

              {/* PLUS / PDF */}
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={loading}
                title="Upload PDF"
                aria-label="Upload PDF"
                className="
                  flex
                  items-center
                  justify-center
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  shrink-0
                  rounded-full
                  text-(--muted)
                  hover:bg-(--foreground)/10
                  hover:text-(--foreground)
                  transition
                  disabled:opacity-40
                  touch-manipulation
                "
              >
                <Plus size={21} />
              </button>

              <button
                type="button"
                onClick={() =>
                  setPluginOpen(
                    (current) => !current,
                  )
                }
                disabled={loading}
                title="Plugins"
                aria-label="Plugins"
                className={`
                  flex
                  items-center
                  justify-center
                  gap-1
                  h-9
                  sm:h-10
                  px-2
                  sm:px-2.5
                  shrink-0
                  rounded-full
                  transition
                  text-sm

                  ${
                    stackOverflowEnabled ||
                    notionEnabled
                      ? "bg-(--foreground)/10 text-(--foreground)"
                      : "text-(--muted) hover:bg-(--foreground)/10 hover:text-(--foreground)"
                  }

                  disabled:opacity-40
                  touch-manipulation
                `}
              >
                <Plug size={17} />

                <ChevronDown
                  size={14}
                  className={`
                    hidden
                    sm:block
                    transition-transform
                    ${
                      pluginOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1">

              {/* VOICE MODE */}
              <button
                type="button"
                onClick={() =>
                  onVoiceModeChange(!voiceMode)
                }
                disabled={loading}
                title={
                  voiceMode
                    ? "Turn off voice mode"
                    : "Turn on voice mode"
                }
                aria-label={
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
                  sm:w-10
                  sm:h-10
                  shrink-0
                  rounded-full
                  transition

                  ${
                    voiceMode
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "text-(--muted) hover:bg-(--foreground)/10 hover:text-(--foreground)"
                  }

                  disabled:opacity-40
                  touch-manipulation
                `}
              >
                <AudioLines size={18} />
              </button>

              {/* VOICE BUTTON */}
              <VoiceButton
                onTranscript={
                  handleVoiceTranscript
                }
                disabled={loading}
                autoStart={voiceMode}
              />

              {/* SEND */}
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                title="Send"
                aria-label="Send message"
                className="
                  bg-(--foreground)
                  text-(--background)
                  rounded-full
                  w-9
                  h-9
                  sm:w-10
                  sm:h-10
                  shrink-0
                  flex
                  items-center
                  justify-center
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  transition
                  hover:opacity-90
                  touch-manipulation
                "
              >
                <Send size={18} />
              </button>
            </div>
          </div>


          {pluginOpen && (
            <div
              className="
                absolute
                bottom-full
                left-0
                mb-2
                w-[calc(100vw-1rem)]
                max-w-72
                rounded-xl
                border
                border-(--border)
                bg-(--card)
                shadow-2xl
                overflow-hidden
                z-50
              "
            >
              {/* HEADER */}

              <div
                className="
                  px-4
                  py-3
                  border-b
                  border-(--border)
                "
              >
                <p className="text-sm font-medium text-(--foreground)">
                  Plugins
                </p>

                <p className="text-xs text-(--muted) mt-1">
                  Give CacheAI access to useful tools.
                </p>
              </div>

              {/* STACK OVERFLOW */}

              <button
                type="button"
                onClick={() =>
                  setStackOverflowEnabled(
                    (current) => !current,
                  )
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  hover:bg-(--foreground)/8
                  transition
                  touch-manipulation
                "
              >
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

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-(--foreground) font-medium">
                    Stack Overflow
                  </p>

                  <p className="text-xs text-(--muted)">
                    Search developer questions
                  </p>
                </div>

                <div
                  className={`
                    relative
                    w-9
                    h-5
                    rounded-full
                    transition

                    ${
                      stackOverflowEnabled
                        ? "bg-orange-500"
                        : "bg-(--foreground)/20"
                    }
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

                      ${
                        stackOverflowEnabled
                          ? "left-4.5"
                          : "left-0.5"
                      }
                    `}
                  />
                </div>
              </button>

              {/* NOTION */}

              <button
                type="button"
                onClick={() =>
                  setNotionEnabled(
                    (current) => !current,
                  )
                }
                className="
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  text-left
                  hover:bg-(--foreground)/8
                  transition
                  touch-manipulation
                "
              >
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

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-(--foreground) font-medium">
                    Notion
                  </p>

                  <p className="text-xs text-(--muted)">
                    Search your Notion workspace
                  </p>
                </div>

                <div
                  className={`
                    relative
                    w-9
                    h-5
                    rounded-full
                    transition

                    ${
                      notionEnabled
                        ? "bg-white"
                        : "bg-(--foreground)/20"
                    }
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

                      ${
                        notionEnabled
                          ? "left-4.5"
                          : "left-0.5"
                      }
                    `}
                  />
                </div>
              </button>

              {/* FOOTER */}

              <div
                className="
                  px-4
                  py-2
                  border-t
                  border-(--border)
                "
              >
                <p className="text-[11px] text-(--muted)">
                  {stackOverflowEnabled &&
                  notionEnabled
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
        </div>

        {/* ==========================================
            DESKTOP HELP TEXT
        ========================================== */}

        <p
          className="
            hidden
            sm:block
            text-center
            text-[11px]
            text-(--muted)
            mt-2
          "
        >
          Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}