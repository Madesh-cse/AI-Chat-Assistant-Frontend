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
import type { MouseEvent } from "react";

import { useChatStore } from "@/store/chatStore";
import { deleteConversation } from "@/services/chat";
import SettingsModal from "../settings/SettingsModal";
import PluginPanel from "@/components/plugins/PluginPanel";

import { togglePinConversation } from "@/services/conversation";

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
  const [deletingChatId, setDeletingChatId] = useState<number | null>(null);
  const [showPlugins, setShowPlugins] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  async function handleCreateChat() {
    if (creatingChat) {
      return;
    }

    setCreatingChat(true);

    try {
      await createChat();
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setCreatingChat(false);
    }
  }

  async function handleDeleteChat(
    event: MouseEvent<HTMLButtonElement>,
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
      console.error("Failed to delete conversation:", error);
    } finally {
      setDeletingChatId(null);
    }
  }

  async function handleTogglePin(
    event: MouseEvent<HTMLButtonElement>,
    id: number,
  ) {
    event.stopPropagation();

    try {
      await togglePinChat(id);
    } catch (error) {
      console.error("Failed to pin conversation:", error);
    }
  }

  const pinnedConversations = conversations.filter((chat) => chat.is_pinned);
  const normalConversations = conversations.filter((chat) => !chat.is_pinned);

  function renderConversation(chat: (typeof conversations)[number]) {
    const isActive = activeConversation === chat.id;

    const isDeleting = deletingChatId === chat.id;

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

          ${isActive ? "bg-[#2a2a2a]" : "hover:bg-[#242424]"}
        `}
      >
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => setActiveChat(chat.id)}
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
          <MessageSquare size={16} className="shrink-0" />

          <span className="truncate">{chat.title || "New chat"}</span>
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={(event) => handleTogglePin(event, chat.id)}
          title={chat.is_pinned ? "Unpin conversation" : "Pin conversation"}
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
          <Pin size={14} className={chat.is_pinned ? "fill-current" : ""} />
        </button>
        <button
          type="button"
          disabled={isDeleting}
          onClick={(event) => handleDeleteChat(event, chat.id)}
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
            <span className="text-xs">...</span>
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    );
  }
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
      <div
        className="
          shrink-0
          p-3
          bg-[#171717]
          border-b
          border-[#2f2f2f]
          z-20
        "
      >
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
            <span className="font-semibold text-sm">CacheAI</span>
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

          <span>{creatingChat ? "Creating..." : "New chat"}</span>
        </button>
      </div>
      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          px-3
          chat-scroll
        "
      >
        <div className="mt-3 space-y-1">
          <button
            type="button"
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2
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
          <button
            type="button"
            className="
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2
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
          <button
            type="button"
            onClick={() => setShowPlugins(true)}
            className={`
              w-full
              flex
              items-center
              gap-3
              px-3
              py-2
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

          <span className="ml-auto text-xs text-gray-500">Ctrl K</span>
        </button>

        <div className="mt-2">
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
                <Pin size={13} className="fill-current" />
                <span>Pinned</span>
              </div>
              <div className="space-y-1">
                {pinnedConversations.map(renderConversation)}
              </div>
            </div>
          )}

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
              <div
                className="
                  px-3
                  py-3
                  text-sm
                  text-gray-500
                "
              >
                Loading conversations...
              </div>
            )}
            {!loadingConversations && normalConversations.length === 0 && (
              <div
                className="
                    px-3
                    py-3
                    text-sm
                    text-gray-500
                  "
              >
                No conversations yet.
              </div>
            )}
            <div className="space-y-1">
              {normalConversations.map(renderConversation)}
            </div>
          </div>
        </div>
      </div>
      <div
        className="
          shrink-0
          p-3
          border-t
          border-[#2f2f2f]
          bg-[#171717]
        "
      >
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
          onClick={() => setSettingsOpen(true)}
        >
          <Settings size={15} />

          <span>Settings</span>
        </button>
        {settingsOpen && (
          <SettingsModal onClose={() => setSettingsOpen(false)} />
        )}
      </div>
      {showPlugins && <PluginPanel onClose={() => setShowPlugins(false)} />}
    </aside>
  );
}
