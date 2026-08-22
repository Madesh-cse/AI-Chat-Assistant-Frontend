"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

interface Props {
  name: string;
  onConfirm: () => void;
}

export default function RegistrationSuccessModal({
  name,
  onConfirm,
}: Props) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === "Escape") onConfirm();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm]);

  const firstName = name.trim().split(" ")[0] || name;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-success-title"
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
    >
      <div
        className="
          relative
          w-full
          max-w-sm
          overflow-hidden
          rounded-2xl
          border
          border-[#3a3a3a]
          bg-[#212121]
          px-7
          pb-7
          pt-8
          text-center
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]
        "
      >
        {/* Ambient glow, same language as the auth pages */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[-40%] h-55 w-55 -translate-x-1/2 rounded-full bg-[#D97757]/20 blur-[80px]"
        />

        <div className="relative">
          <div
            className="
              mx-auto
              mb-5
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-full
              bg-[#D97757]
              shadow-[0_4px_20px_-2px_rgba(217,119,87,0.55)]
            "
          >
            <Check size={26} className="text-white" strokeWidth={2.5} />
          </div>

          <h2
            id="registration-success-title"
            className="text-[22px] leading-tight text-white"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            You're all set{firstName ? `, ${firstName}` : ""}!
          </h2>

          <p className="mt-2.5 text-[14.5px] leading-relaxed text-gray-400">
            Your CacheAI account has been created. Sign in with your new
            credentials to start chatting.
          </p>

          <button
            type="button"
            onClick={onConfirm}
            autoFocus
            className="
              mt-7
              w-full
              rounded-lg
              bg-[#D97757]
              py-2.5
              text-[15px]
              font-medium
              text-white
              shadow-[0_4px_14px_-4px_rgba(217,119,87,0.45)]
              transition
              hover:bg-[#c76a4c]
              active:scale-[0.99]
            "
          >
            Continue to sign in
          </button>
        </div>
      </div>
    </div>
  );
}