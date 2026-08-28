interface TypingIndicatorProps {
  label?: string;
}

export default function TypingIndicator({
  label = "Thinking",
}: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2.5 px-1 py-2">
      {/* Sparkle mark */}

      <div className="relative h-4 w-4 shrink-0">
        {/* Soft glow behind the mark */}

        <span
          className="
            absolute
            inset-0
            rounded-full
            bg-[#D97757]
            opacity-40
            blur-[6px]
            animate-pulse
          "
          style={{ animationDuration: "1.6s" }}
        />

        {/* Four-point sparkle, built from two overlapping bars */}

        <svg
          viewBox="0 0 24 24"
          className="
            relative
            h-4
            w-4
            text-[#D97757]
            animate-spin
          "
          style={{ animationDuration: "2.4s" }}
          fill="currentColor"
        >
          <path d="M12 0c0 4.97 1.5 8.5 3.5 10.5S20.97 12 24 12c-4.97 0-8.5 1.5-10.5 3.5S12 19.03 12 24c0-4.97-1.5-8.5-3.5-10.5S0 12 0 12c4.97 0 8.5-1.5 10.5-3.5S12 0.97 12 0z" />
        </svg>
      </div>

      {/* Label + animated ellipsis */}

      <span className="flex items-center text-sm text-gray-400">
        {label}

        <span
          className="ml-0.5 animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "1s" }}
        >
          .
        </span>

        <span
          className="animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "1s" }}
        >
          .
        </span>

        <span
          className="animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "1s" }}
        >
          .
        </span>
      </span>
    </div>
  );
}