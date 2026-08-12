export default function TypingIndicator() {
  return (
    <div className="flex gap-2">

      <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500" />

      <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500 delay-100" />

      <span className="h-3 w-3 animate-bounce rounded-full bg-gray-500 delay-200" />

    </div>
  );
}