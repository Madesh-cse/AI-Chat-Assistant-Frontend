"use client";

import { useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Settings,
  Unplug,
  AlertTriangle,
  X,
} from "lucide-react";

interface AppConnection {
  id: string;
  name: string;
  description: string;
  connected: boolean;
}

const initialApps: AppConnection[] = [
  {
    id: "notion",
    name: "Notion",
    description: "Search and read pages from your connected Notion workspace.",
    connected: true,
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    description: "Search programming questions and community solutions.",
    connected: true,
  },
];

export default function ConnectedApps() {
  const [apps, setApps] = useState<AppConnection[]>(initialApps);

  const [disconnectingApp, setDisconnectingApp] =
    useState<AppConnection | null>(null);

  const disconnectApp = () => {
    if (!disconnectingApp) return;

    setApps((current) =>
      current.map((app) =>
        app.id === disconnectingApp.id
          ? {
              ...app,
              connected: false,
            }
          : app,
      ),
    );

    setDisconnectingApp(null);
  };

  const connectApp = (id: string) => {
    setApps((current) =>
      current.map((app) =>
        app.id === id
          ? {
              ...app,
              connected: true,
            }
          : app,
      ),
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h2 className="text-lg font-semibold text-(--foreground)">
            Connected Apps
          </h2>

          <p className="mt-1 max-w-xl text-sm leading-6 text-(--muted)">
            Connect external apps and services so your assistant can access
            information and perform useful tasks on your behalf.
          </p>
        </div>

        {/* APPS */}
        <div className="space-y-3">
          {apps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onConnect={() => connectApp(app.id)}
              onDisconnect={() => setDisconnectingApp(app)}
            />
          ))}
        </div>

        {/* ADD MORE APPS */}
        <div
          className="
            rounded-xl
            border border-dashed border-(--border)
            bg-(--card)
            p-5
          "
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-(--foreground)">
                More integrations
              </h3>

              <p className="mt-1 text-sm text-(--muted)">
                Additional integrations can be connected as they become
                available.
              </p>
            </div>

            <button
              type="button"
              disabled
              className="
                rounded-lg
                border border-(--border)
                px-3 py-2
                text-sm
                text-(--muted)
                opacity-60
                cursor-not-allowed
              "
            >
              Coming soon
            </button>
          </div>
        </div>

        {/* SECURITY NOTE */}
        <div
          className="
            flex gap-3
            rounded-xl
            border border-(--border)
            bg-(--card)
            p-4
          "
        >
          <div className="mt-0.5">
            <CheckCircle2 size={18} className="text-green-500" />
          </div>

          <div>
            <h3 className="text-sm font-medium text-(--foreground)">
              Your connections are controlled by you
            </h3>

            <p className="mt-1 text-xs leading-5 text-(--muted)">
              Connected apps can be disconnected at any time. Your assistant
              only accesses services that you explicitly connect.
            </p>
          </div>
        </div>
      </div>

      {/* DISCONNECT CONFIRMATION */}
      {disconnectingApp && (
        <DisconnectDialog
          app={disconnectingApp}
          onCancel={() => setDisconnectingApp(null)}
          onConfirm={disconnectApp}
        />
      )}
    </>
  );
}

function AppCard({
  app,
  onConnect,
  onDisconnect,
}: {
  app: AppConnection;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        rounded-xl
        border
        border-(--border)
        bg-(--card)
        p-4
        transition
        hover:bg-black/3
        dark:hover:bg-white/3
      "
    >
      {/* APP INFORMATION */}
      <div className="flex min-w-0 items-center gap-4">
        <AppIcon id={app.id} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium text-(--foreground)">{app.name}</h3>

            {app.connected && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-green-500/10
                  px-2
                  py-0.5
                  text-xs
                  font-medium
                  text-green-500
                "
              >
                <CheckCircle2 size={12} />
                Connected
              </span>
            )}
          </div>

          <p className="mt-1 max-w-lg text-sm leading-5 text-(--muted)">
            {app.description}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex shrink-0 items-center gap-2">
        {app.connected ? (
          <>
            <button
              type="button"
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-(--border)
                px-3
                py-2
                text-sm
                text-(--foreground)
                transition
                hover:bg-black/5
                dark:hover:bg-white/10
              "
            >
              <Settings size={15} />
              <span className="hidden sm:inline">Manage</span>
            </button>

            <button
              type="button"
              onClick={onDisconnect}
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                px-3
                py-2
                text-sm
                text-red-500
                transition
                hover:bg-red-500/10
              "
            >
              <Unplug size={15} />

              <span className="hidden sm:inline">Disconnect</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onConnect}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-black
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
              dark:bg-white
              dark:text-black
            "
          >
            <ExternalLink size={15} />
            Connect
          </button>
        )}
      </div>
    </div>
  );
}

function AppIcon({ id }: { id: string }) {
  if (id === "notion") {
    return (
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-(--border)
          bg-(--background)
          text-(--foreground)
        "
      >
        <span className="text-lg font-bold">N</span>
      </div>
    );
  }

  if (id === "stackoverflow") {
    return (
      <div
        className="
          flex
          h-11
          w-11
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-(--border)
          bg-(--background)
          text-(--foreground)
        "
      >
        <span className="text-xs font-bold">SO</span>
      </div>
    );
  }

  return (
    <div
      className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-xl
        border
        border-(--border)
        bg-(--background)
        text-(--foreground)
      "
    >
      ?
    </div>
  );
}

function DisconnectDialog({
  app,
  onCancel,
  onConfirm,
}: {
  app: AppConnection;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-200
        flex
        items-center
        justify-center
        bg-black/60
        px-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-(--border)
          bg-(--background)
          shadow-2xl
        "
      >
        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-(--border)
            px-5
            py-4
          "
        >
          <h3 className="font-semibold text-(--foreground)">
            Disconnect {app.name}?
          </h3>

          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-lg
              p-2
              text-(--muted)
              transition
              hover:bg-black/5
              hover:text-(--foreground)
              dark:hover:bg-white/10
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <div
            className="
              mb-4
              flex
              items-start
              gap-3
              rounded-xl
              border
              border-yellow-500/20
              bg-yellow-500/5
              p-4
            "
          >
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-yellow-500"
            />

            <p className="text-sm leading-5 text-(--muted)">
              Your assistant will no longer be able to access
              {` ${app.name}`} through this connection.
            </p>
          </div>

          <p className="text-sm leading-6 text-(--muted)">
            You can reconnect this app later if you want to use it again.
          </p>
        </div>

        {/* ACTIONS */}
        <div
          className="
            flex
            justify-end
            gap-2
            border-t
            border-(--border)
            px-5
            py-4
          "
        >
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-lg
              border
              border-(--border)
              px-4
              py-2
              text-sm
              text-(--foreground)
              transition
              hover:bg-black/5
              dark:hover:bg-white/10
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              rounded-lg
              bg-red-500
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:bg-red-600
            "
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
