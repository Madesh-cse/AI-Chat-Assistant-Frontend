"use client";

import {
  Plus,
  MessageSquare,
  Search,
  Settings,
  PanelLeftClose,
  Trash2,
  FolderKanban,
  CalendarClock,
  Plug,
  Pin,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useChatStore } from "@/store/chatStore";
import {
  deleteConversation,
} from "@/services/chat";

import {
  togglePinConversation,
} from "@/services/conversation";

import PluginPanel from "@/components/plugins/PluginPanel";

export default function Sidebar() {
  const {
    conversations,
    activeConversation,
    createChat,
    setActiveChat,
    deleteChat,
    loadConversations,
    loadingConversations,
    togglePinChat,
  } = useChatStore();

  const [creatingChat, setCreatingChat] = useState(false);

  const [deletingChatId, setDeletingChatId] =
    useState<number | null>(null);

  const [showPlugins, setShowPlugins] =
    useState(false);

  // =========================================
  // LOAD CONVERSATIONS
  // =========================================

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // =========================================
  // CREATE CHAT
  // =========================================

  async function handleCreateChat() {
    if (creatingChat) {
      return;
    }

    setCreatingChat(true);

    try {
      await createChat();
    } catch (error) {
      console.error(
        "Failed to create chat:",
        error,
      );
    } finally {
      setCreatingChat(false);
    }
  }

  // =========================================
  // DELETE CHAT
  // =========================================

  async function handleDeleteChat(
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) {
    event.stopPropagation();

    if (deletingChatId !== null) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingChatId(id);

    try {
      await deleteConversation(id);

      deleteChat(id);
    } catch (error) {
      console.error(
        "Failed to delete conversation:",
        error,
      );
    } finally {
      setDeletingChatId(null);
    }
  }

  // =========================================
  // TOGGLE PIN
  // =========================================

  async function handleTogglePin(
    event: React.MouseEvent<HTMLButtonElement>,
    id: number,
  ) {
    event.stopPropagation();

    try {
      await togglePinChat(id);
    } catch (error) {
      console.error(
        "Failed to pin conversation:",
        error,
      );
    }
  }

  // =========================================
  // SPLIT CONVERSATIONS
  // =========================================

  const pinnedConversations =
    conversations.filter(
      (chat) => chat.is_pinned,
    );

  const normalConversations =
    conversations.filter(
      (chat) => !chat.is_pinned,
    );

  // =========================================
  // CONVERSATION ITEM
  // =========================================

  function renderConversation(
    chat: (typeof conversations)[number],
  ) {
    const isActive =
      activeConversation === chat.id;

    const isDeleting =
      deletingChatId === chat.id;

    return (
      <div
        key={chat.id}
        className={`
          group
          w-full
          flex
          items-center
          rounded-lg
          transition

          ${
            isActive
              ? "bg-[#2a2a2a]"
              : "hover:bg-[#242424]"
          }
        `}
      >
        {/* Conversation */}

        <button
          type="button"
          disabled={isDeleting}
          onClick={() =>
            setActiveChat(chat.id)
          }
          className={`
            flex
            items-center
            gap-3
            min-w-0
            flex-1
            text-left
            px-3
            py-2.5
            text-sm
            transition
            disabled:opacity-50

            ${
              isActive
                ? "text-white"
                : "text-gray-400 group-hover:text-gray-200"
            }
          `}
        >
          <MessageSquare
            size={16}
            className="shrink-0"
          />

          <span className="truncate">
            {chat.title || "New chat"}
          </span>
        </button>

        {/* Pin */}

        <button
          type="button"
          disabled={isDeleting}
          onClick={(event) =>
            handleTogglePin(
              event,
              chat.id,
            )
          }
          title={
            chat.is_pinned
              ? "Unpin conversation"
              : "Pin conversation"
          }
          className={`
            shrink-0
            p-2
            rounded-md
            transition

            ${
              chat.is_pinned
                ? "text-white opacity-100"
                : "text-gray-500 opacity-0 group-hover:opacity-100"
            }

            hover:bg-[#3a3a3a]
            hover:text-white
            disabled:opacity-50
          `}
        >
          <Pin
            size={14}
            className={
              chat.is_pinned
                ? "fill-current"
                : ""
            }
          />
        </button>

        {/* Delete */}

        <button
          type="button"
          disabled={isDeleting}
          onClick={(event) =>
            handleDeleteChat(
              event,
              chat.id,
            )
          }
          title="Delete conversation"
          className="
            shrink-0
            mr-1
            p-2
            rounded-md
            text-gray-500
            opacity-0
            group-hover:opacity-100
            hover:bg-[#3a3a3a]
            hover:text-red-400
            disabled:opacity-50
            transition
          "
        >
          {isDeleting ? (
            <span className="text-xs">
              ...
            </span>
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <aside
      className="
        w-72
        h-screen
        flex
        flex-col
        bg-[#171717]
        text-[#ececec]
        border-r
        border-[#2f2f2f]
        relative
      "
    >
      {/* =========================================
          TOP
      ========================================= */}

      <div className="p-3">

        {/* BRAND */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-3
          "
        >
          <div className="flex items-center gap-2">

            <div
              className="
                h-8
                w-8
                rounded-lg
                bg-[#303030]
                flex
                items-center
                justify-center
                font-semibold
                text-sm
              "
            >
              C
            </div>

            <span className="font-semibold text-sm">
              CacheAI
            </span>
          </div>

          <button
            type="button"
            className="
              p-2
              rounded-lg
              text-gray-400
              hover:bg-[#2a2a2a]
              hover:text-white
              transition
            "
            title="Collapse sidebar"
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        {/* NEW CHAT */}

        <button
          type="button"
          onClick={handleCreateChat}
          disabled={creatingChat}
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-3
            rounded-lg
            border
            border-[#444]
            hover:bg-[#2a2a2a]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            text-sm
          "
        >
          <Plus size={18} />

          <span>
            {creatingChat
              ? "Creating..."
              : "New chat"}
          </span>
        </button>

        {/* NAVIGATION */}

        <div className="mt-3 space-y-1">

          {/* PROJECTS */}

          <button
            type="button"
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              text-gray-300
              hover:bg-[#242424]
              hover:text-white
              transition
            "
          >
            <FolderKanban size={17} />

            <span>Projects</span>
          </button>

          {/* SCHEDULE */}

          <button
            type="button"
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              text-gray-300
              hover:bg-[#242424]
              hover:text-white
              transition
            "
          >
            <CalendarClock size={17} />

            <span>Schedule</span>
          </button>

          {/* PLUGINS */}

          <button
            type="button"
            onClick={() =>
              setShowPlugins(true)
            }
            className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-lg
              text-sm
              transition

              ${
                showPlugins
                  ? "bg-[#2a2a2a] text-white"
                  : "text-gray-300 hover:bg-[#242424] hover:text-white"
              }
            `}
          >
            <Plug size={17} />

            <span>Plugins</span>
          </button>
        </div>

        {/* SEARCH */}

        <button
          type="button"
          className="
            w-full
            flex
            items-center
            gap-3
            px-3
            py-3
            mt-2
            rounded-lg
            hover:bg-[#2a2a2a]
            transition
            text-sm
            text-gray-300
          "
        >
          <Search size={18} />

          <span>Search chats</span>

          <span className="ml-auto text-xs text-gray-500">
            Ctrl K
          </span>
        </button>
      </div>

      {/* =========================================
          CONVERSATIONS
      ========================================= */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-3
          chat-scroll
        "
      >

        {/* =====================================
            PINNED
        ===================================== */}

        {pinnedConversations.length > 0 && (
          <div className="mb-4">

            <div
              className="
                flex
                items-center
                gap-2
                px-3
                py-2
                text-xs
                font-medium
                text-gray-500
              "
            >
              <Pin
                size={13}
                className="fill-current"
              />

              <span>Pinned</span>
            </div>

            <div className="space-y-1">
              {pinnedConversations.map(
                renderConversation,
              )}
            </div>
          </div>
        )}

        {/* =====================================
            CHATS
        ===================================== */}

        <div>

          <p
            className="
              px-3
              py-2
              text-xs
              font-medium
              text-gray-500
            "
          >
            Chats
          </p>

          {loadingConversations && (
            <div className="px-3 py-3 text-sm text-gray-500">
              Loading conversations...
            </div>
          )}

          {!loadingConversations &&
            normalConversations.length === 0 && (
              <div className="px-3 py-3 text-sm text-gray-500">
                No conversations yet.
              </div>
            )}

          <div className="space-y-1">
            {normalConversations.map(
              renderConversation,
            )}
          </div>
        </div>
      </div>

      {/* =========================================
          BOTTOM
      ========================================= */}

      <div
        className="
          p-3
          border-t
          border-[#2f2f2f]
        "
      >

        {/* AI MODEL */}

        <div
          className="
            flex
            items-center
            gap-2.5
            px-2
            py-2
            rounded-lg
            hover:bg-[#242424]
            transition
            cursor-pointer
          "
        >
        </div>

        {/* SETTINGS */}

        <button
          type="button"
          className="
            w-full
            flex
            items-center
            gap-2.5
            px-2
            py-2
            rounded-lg
            hover:bg-[#242424]
            transition
            text-xs
            text-gray-400
          "
        >
          <Settings size={15} />

          <span>Settings</span>
        </button>
      </div>

      {/* PLUGIN PANEL */}

      {showPlugins && (
        <PluginPanel
          onClose={() =>
            setShowPlugins(false)
          }
        />
      )}
    </aside>
  );
}