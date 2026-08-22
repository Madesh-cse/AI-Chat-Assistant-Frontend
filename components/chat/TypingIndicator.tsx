export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#D97757] animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "1s" }}
      />
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#D97757] animate-bounce"
        style={{ animationDelay: "150ms", animationDuration: "1s" }}
      />
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#D97757] animate-bounce"
        style={{ animationDelay: "300ms", animationDuration: "1s" }}
      />
    </div>
  );
}