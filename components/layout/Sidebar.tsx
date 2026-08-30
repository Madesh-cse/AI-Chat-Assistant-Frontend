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

interface SidebarProps {
  // Controls the off-canvas drawer on small screens (< md). Owned by
  // the parent (ChatBox) so the mobile menu trigger can live in the
  // header row instead of floating over content.
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

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

export default function Sidebar({
  mobileOpen = false,
  onMobileClose = () => {},
}: SidebarProps) {
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

      // Close the mobile drawer after a successful create - no-op on
      // desktop where onMobileClose is a default noop / md overrides
      // the transform anyway.
      onMobileClose();
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setCreatingChat(false);
    }
  }

  function handleSelectChat(id: number) {
    setActiveChat(id);

    onMobileClose();
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

  // Elements that collapse away on desktop (md+) when `collapsed` is
  // true, but must always stay visible on mobile - since on mobile
  // the sidebar is a full-width overlay drawer, not an icon rail.
  // Default (no breakpoint prefix) = visible; md:hidden only kicks in
  // once we're at md+ and collapsed is true.
  const hideWhenCollapsed = collapsed ? "md:hidden" : "";

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

          ${isActive ? "bg-(--foreground)/10" : "hover:bg-(--foreground)/5"}
        `}
      >
        <button
          type="button"
          disabled={isDeleting}
          onClick={() => handleSelectChat(chat.id)}
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
                ? "text-(--foreground)"
                : "text-(--muted) group-hover:text-(--foreground)"
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
                ? "`text-(--foreground) opacity-100"
                : "text-(--muted) opacity-0 group-hover:opacity-100"
            }

            hover:bg-(--foreground)/10
            hover:text-(--foreground)
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
            text-(--muted)
            opacity-0
            group-hover:opacity-100
            hover:bg-(--foreground)/10
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
    <>
      {/* Backdrop - mobile only, closes the drawer on tap outside */}

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-40
          md:static
          md:z-auto
          h-screen
          flex
          flex-col
          bg-(--sidebar)
          text-(--foreground)
          border-r
          border-(--border)
          shrink-0
          transition-transform
          md:transition-[width]
          duration-200
          ease-in-out
          overflow-hidden

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0

          w-72
          ${collapsed ? "md:w-17" : "md:w-72"}
        `}
      >
        <div
          className="
            shrink-0
            p-3
            bg-(--sidebar)
            z-20
          "
        >
          <div
            className={`
              flex
              items-center
              mb-2
              justify-between

              ${collapsed ? "md:justify-center" : ""}
            `}
          >
            <div
              className={`flex items-center gap-2 min-w-0 px-1 ${hideWhenCollapsed}`}
            >
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

            {/* Desktop collapse toggle */}
            <button
              type="button"
              onClick={() => setCollapsed((current) => !current)}
              className="
                hidden
                md:flex
                p-2
                rounded-lg
                text-(--muted)
                hover:bg-(--foreground)/10
                hover:text-(--foreground)
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

            {/* Mobile close */}
            <button
              type="button"
              onClick={onMobileClose}
              className="
                md:hidden
                p-2
                rounded-lg
                text-(--muted)
                hover:bg-(--foreground)/10
                hover:text-(--foreground)
                transition
                shrink-0
              "
              title="Close sidebar"
            >
              <PanelLeftClose size={18} />
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
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-(--foreground)
              hover:bg-(--foreground)/10
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition
              text-sm

              ${collapsed ? "md:justify-center md:px-0" : ""}
            `}
          >
            <SquarePen size={18} className="shrink-0" />

            <span className={hideWhenCollapsed}>
              {creatingChat ? "Creating..." : "New chat"}
            </span>
          </button>

          <button
            type="button"
            title="Search chats"
            className={`
              w-full
              flex
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              hover:bg-(--foreground)/10
              transition
              text-sm
              text-(--foreground)

              ${collapsed ? "md:justify-center md:px-0" : ""}
            `}
          >
            <Search size={18} className="shrink-0" />

            <span
              className={`flex items-center gap-3 flex-1 ${hideWhenCollapsed}`}
            >
              <span>Search chats</span>
              <span className="ml-auto text-xs text-(--muted)">Ctrl K</span>
            </span>
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
                gap-3
                rounded-xl
                px-3
                py-2
                text-sm
                text-(--muted)
                hover:bg-(--foreground)/5
                hover:text-(--foreground)
                transition

                ${collapsed ? "md:justify-center md:px-0" : ""}
              `}
            >
              <FolderKanban size={17} className="shrink-0" />

              <span className={hideWhenCollapsed}>Projects</span>
            </button>
            <button
              type="button"
              title="Schedule"
              className={`
                w-full
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2
                text-sm
                text-(--muted)
                hover:bg-(--foreground)/5
                hover:text-(--foreground)
                transition

                ${collapsed ? "md:justify-center md:px-0" : ""}
              `}
            >
              <CalendarClock size={17} className="shrink-0" />

              <span className={hideWhenCollapsed}>Schedule</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPlugins(true)}
              title="Plugins"
              className={`
                w-full
                flex
                items-center
                gap-3
                rounded-xl
                px-3
                py-2
                text-sm
                transition

                ${collapsed ? "md:justify-center md:px-0" : ""}

                ${
                  showPlugins
                    ? "bg-(--foreground)/10 text-(--foreground)"
                    : "text-(--muted) hover:bg-(--foreground)/5 hover:text-(--foreground)"
                }
              `}
            >
              <Plug size={17} className="shrink-0" />

              <span className={hideWhenCollapsed}>Plugins</span>
            </button>
          </div>

          <div className={`mt-3 ${hideWhenCollapsed}`}>
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
                    text-(--muted)
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
                  text-(--muted)
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
                  text-(--muted)
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
                    text-(--muted)
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
              gap-2.5
              rounded-xl
              px-2
              py-2
              hover:bg-(--foreground)/10
              transition

              ${collapsed ? "md:justify-center md:px-0" : ""}
            `}
          >
            <div
              className="
                h-7
                w-7
                shrink-0
                rounded-full
                bg-(--foreground)/15
                flex
                items-center
                justify-center
                text-xs
                font-medium
                text-(--foreground)
              "
            >
              {userInitial}
            </div>

            <div
              className={`min-w-0 flex flex-1 items-center gap-2 ${hideWhenCollapsed}`}
            >
              <div className="min-w-0 flex flex-col items-start">
                <span className="text-sm text-(--foreground) truncate max-w-40">
                  {userName}
                </span>

                {userEmail && (
                  <span className="text-xs text-(--muted) truncate max-w-40">
                    {userEmail}
                  </span>
                )}
              </div>

              <Settings size={15} className="ml-auto shrink-0 text-(--muted)" />
            </div>
          </button>
        </div>
      </aside>

      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}

      {showPlugins && <PluginPanel onClose={() => setShowPlugins(false)} />}

      {chatPendingDelete && (
        <DeleteConversationModal
          title={chatPendingDelete.title}
          isDeleting={deletingChatId === chatPendingDelete.id}
          onConfirm={handleConfirmDelete}
          onCancel={() => setChatPendingDelete(null)}
        />
      )}
    </>
  );
}