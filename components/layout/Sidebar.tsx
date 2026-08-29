"use client";

import {
  SquarePen,
  MessageSquare,
  Search,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Trash2,
  FolderKanban,
  CalendarClock,
  Plug,
  Pin,
} from "lucide-react";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";

import { useChatStore } from "@/store/chatStore";
import { deleteConversation } from "@/services/conversation";
import SettingsModal from "../settings/SettingsModal";
import PluginPanel from "@/components/plugins/PluginPanel";
import DeleteConversationModal from "../Model/DeleteConversationModel";

import { togglePinConversation } from "@/services/conversation";

type Conversation = ReturnType<
  typeof useChatStore.getState
>["conversations"][number];

// RECENCY GROUPING
//
// Mirrors Claude's own "Today / Yesterday / Previous 7 Days / Older"
// grouping. Reads `updated_at`, falling back to `created_at` - rename
// this to match whatever field your actual Conversation type uses if
// it differs, or every chat will land in "Older".

function getConversationTimestamp(chat: Conversation): number {
  const raw =
    (chat as unknown as { updated_at?: string; created_at?: string })
      .updated_at ??
    (chat as unknown as { updated_at?: string; created_at?: string })
      .created_at;

  const parsed = raw ? new Date(raw).getTime() : NaN;

  return Number.isNaN(parsed) ? 0 : parsed;
}

function groupByRecency(chats: Conversation[]) {
  const now = new Date();

  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;

  const groups: { label: string; chats: Conversation[] }[] = [
    { label: "Today", chats: [] },
    { label: "Yesterday", chats: [] },
    { label: "Previous 7 Days", chats: [] },
    { label: "Older", chats: [] },
  ];

  for (const chat of chats) {
    const timestamp = getConversationTimestamp(chat);

    if (timestamp >= startOfToday) {
      groups[0].chats.push(chat);
    } else if (timestamp >= startOfYesterday) {
      groups[1].chats.push(chat);
    } else if (timestamp >= sevenDaysAgo) {
      groups[2].chats.push(chat);
    } else {
      groups[3].chats.push(chat);
    }
  }

  return groups.filter((group) => group.chats.length > 0);
}

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
  const [chatPendingDelete, setChatPendingDelete] = useState<
    (typeof conversations)[number] | null
  >(null);
  const [showPlugins, setShowPlugins] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);

      if (user?.name) {
        setUserName(user.name);
      }

      if (user?.email) {
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
    }
  }, []);

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

  function handleRequestDelete(
    event: MouseEvent<HTMLButtonElement>,
    chat: (typeof conversations)[number],
  ) {
    event.stopPropagation();

    if (deletingChatId !== null) {
      return;
    }

    setChatPendingDelete(chat);
  }

  async function handleConfirmDelete() {
    if (!chatPendingDelete) return;

    const id = chatPendingDelete.id;
    setDeletingChatId(id);

    try {
      await deleteConversation(id);

      deleteChat(id);
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    } finally {
      setDeletingChatId(null);
      setChatPendingDelete(null);
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
  const recencyGroups = groupByRecency(normalConversations);

  const userInitial = userName.trim().charAt(0).toUpperCase() || "U";

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
          rounded-xl
          transition

          ${isActive ? "bg-[#2a2a2a]" : "hover:bg-[#1e1e1e]"}
        `}
      >
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => setActiveChat(chat.id)}
          className={`
            flex
            items-center
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
          onClick={(event) => handleRequestDelete(event, chat)}
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
      className={`
        h-screen
        flex
        flex-col
        bg-[#171717]
        text-[#ececec]
        relative
        shrink-0
        transition-[width]
        duration-200
        ease-in-out
        overflow-hidden

        ${collapsed ? "w-17" : "w-72"}
      `}
    >
      <div
        className="
          shrink-0
          p-3
          bg-[#171717]
          z-20
        "
      >
        <div
          className={`
            flex
            items-center
            mb-2

            ${collapsed ? "justify-center" : "justify-between"}
          `}
        >
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0 px-1">
              <div
                className="
                  h-7
                  w-7
                  shrink-0
                  rounded-lg
                  bg-[#D97757]
                  flex
                  items-center
                  justify-center
                  font-semibold
                  text-sm
                  text-white
                "
              >
                C
              </div>
              <span className="font-medium text-sm truncate">CacheAI</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            className="
              p-2
              rounded-lg
              text-gray-400
              hover:bg-[#242424]
              hover:text-white
              transition
              shrink-0
            "
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
        </div>

        {/* Compose - borderless, matches Claude's plain "New chat" row */}

        <button
          type="button"
          onClick={handleCreateChat}
          disabled={creatingChat}
          title="New chat"
          className={`
            w-full
            flex
            items-center
            rounded-xl
            text-gray-200
            hover:bg-[#242424]
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
            text-sm

            ${collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"}
          `}
        >
          <SquarePen size={18} className="shrink-0" />

          {!collapsed && (
            <span>{creatingChat ? "Creating..." : "New chat"}</span>
          )}
        </button>

        <button
          type="button"
          title="Search chats"
          className={`
            w-full
            flex
            items-center
            rounded-xl
            hover:bg-[#242424]
            transition
            text-sm
            text-gray-200

            ${collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2.5"}
          `}
        >
          <Search size={18} className="shrink-0" />

          {!collapsed && (
            <>
              <span>Search chats</span>

              <span className="ml-auto text-xs text-gray-500">Ctrl K</span>
            </>
          )}
        </button>
      </div>

      <div
        className="
          flex-1
          min-h-0
          overflow-y-auto
          overflow-x-hidden
          px-3
          chat-scroll
        "
      >
        <div className="mt-1 space-y-1">
          <button
            type="button"
            title="Projects"
            className={`
              w-full
              flex
              items-center
              rounded-xl
              text-sm
              text-gray-300
              hover:bg-[#1e1e1e]
              hover:text-white
              transition

              ${collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2"}
            `}
          >
            <FolderKanban size={17} className="shrink-0" />

            {!collapsed && <span>Projects</span>}
          </button>
          <button
            type="button"
            title="Schedule"
            className={`
              w-full
              flex
              items-center
              rounded-xl
              text-sm
              text-gray-300
              hover:bg-[#1e1e1e]
              hover:text-white
              transition

              ${collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2"}
            `}
          >
            <CalendarClock size={17} className="shrink-0" />

            {!collapsed && <span>Schedule</span>}
          </button>
          <button
            type="button"
            onClick={() => setShowPlugins(true)}
            title="Plugins"
            className={`
              w-full
              flex
              items-center
              rounded-xl
              text-sm
              transition

              ${collapsed ? "justify-center py-2.5" : "gap-3 px-3 py-2"}

              ${
                showPlugins
                  ? "bg-[#2a2a2a] text-white"
                  : "text-gray-300 hover:bg-[#1e1e1e] hover:text-white"
              }
            `}
          >
            <Plug size={17} className="shrink-0" />

            {!collapsed && <span>Plugins</span>}
          </button>
        </div>

        {!collapsed && (
          <div className="mt-3">
            {pinnedConversations.length > 0 && (
              <div className="mb-4">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  <Pin size={12} className="fill-current" />
                  <span>Pinned</span>
                </div>
                <div className="space-y-0.5">
                  {pinnedConversations.map(renderConversation)}
                </div>
              </div>
            )}

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

            {recencyGroups.map((group) => (
              <div key={group.label} className="mb-4">
                <p
                  className="
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-gray-500
                  "
                >
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.chats.map(renderConversation)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Account row - anchors the bottom, opens Settings */}

      <div
        className="
          shrink-0
          p-3
        "
      >
        <button
          type="button"
          title="Settings"
          onClick={() => setSettingsOpen(true)}
          className={`
            w-full
            flex
            items-center
            rounded-xl
            hover:bg-[#242424]
            transition

            ${collapsed ? "justify-center py-2" : "gap-2.5 px-2 py-2"}
          `}
        >
          <div
            className="
              h-7
              w-7
              shrink-0
              rounded-full
              bg-[#3a3a3a]
              flex
              items-center
              justify-center
              text-xs
              font-medium
              text-white
            "
          >
            {userInitial}
          </div>

          {!collapsed && (
            <>
              <div className="min-w-0 flex flex-col items-start">
                <span className="text-sm text-gray-200 truncate max-w-40">
                  {userName}
                </span>

                {userEmail && (
                  <span className="text-xs text-gray-500 truncate max-w-40">
                    {userEmail}
                  </span>
                )}
              </div>

              <Settings size={15} className="ml-auto shrink-0 text-gray-500" />
            </>
          )}
        </button>

        {settingsOpen && (
          <SettingsModal onClose={() => setSettingsOpen(false)} />
        )}
      </div>

      {showPlugins && <PluginPanel onClose={() => setShowPlugins(false)} />}

      {chatPendingDelete && (
        <DeleteConversationModal
          title={chatPendingDelete.title}
          isDeleting={deletingChatId === chatPendingDelete.id}
          onConfirm={handleConfirmDelete}
          onCancel={() => setChatPendingDelete(null)}
        />
      )}
    </aside>
  );
}
