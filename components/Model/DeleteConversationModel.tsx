"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  title: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConversationModal({
  title,
  isDeleting,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-conversation-title"
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
      onClick={onCancel}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="
          w-full
          max-w-sm
          rounded-2xl
          border
          border-[#3a3a3a]
          bg-[#2a2a2a]
          p-6
          shadow-xl
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-red-500/10
              text-red-400
            "
          >
            <AlertTriangle size={18} />
          </div>
          <div className="min-w-0">
            <h2
              id="delete-conversation-title"
              className="text-sm font-semibold text-white"
            >
              Delete conversation?
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              This will delete{" "}
              <span className="text-gray-300">
                &ldquo;{title || "New chat"}&rdquo;
              </span>
              . This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="
              rounded-lg
              px-3.5
              py-2
              text-sm
              text-gray-300
              transition
              hover:bg-[#3a3a3a]
              disabled:opacity-50
            "
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="
              rounded-lg
              bg-red-500
              px-3.5
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-red-600
              disabled:opacity-50
            "
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}