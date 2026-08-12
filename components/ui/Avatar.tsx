import { Bot, User } from "lucide-react";

export default function Avatar({ role }: { role: "user" | "assistant" }) {
  return (
    <div
      className="
h-8
w-8
rounded-full
flex
items-center
justify-center
bg-gray-700
"
    >
      {role === "assistant" ? <Bot size={18} /> : <User size={18} />}
    </div>
  );
}
