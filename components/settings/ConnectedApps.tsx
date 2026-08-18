"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Settings, Unplug } from "lucide-react";

import {
  connectApp,
  disconnectApp,
  getAppConnections,
  type AppConnection,
} from "../../services/appConnectionApi";

interface AppDefinition {
  id: string;
  name: string;
  description: string;
}

const AVAILABLE_APPS: AppDefinition[] = [
  {
    id: "notion",
    name: "Notion",
    description: "Search and read pages from your connected Notion workspace.",
  },
  {
    id: "stackoverflow",
    name: "Stack Overflow",
    description: "Search programming questions and community solutions.",
  },
];

export default function ConnectedApps() {
  const [apps, setApps] = useState<AppConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingApp, setProcessingApp] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // LOAD CONNECTIONS
  // ============================================

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAppConnections();

      setApps(data);
    } catch (error) {
      console.error("Failed to load app connections:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load connected apps.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CHECK CONNECTION
  // ============================================

  const isConnected = (appId: string) => {
    return apps.some((app) => app.app_id === appId && app.connected === true);
  };

  // ============================================
  // CONNECT
  // ============================================

  const handleConnect = async (appId: string) => {
    try {
      setProcessingApp(appId);
      setError(null);

      const connection = await connectApp(appId);

      setApps((current) => {
        const exists = current.some((app) => app.app_id === appId);

        if (exists) {
          return current.map((app) =>
            app.app_id === appId ? connection : app,
          );
        }

        return [...current, connection];
      });
    } catch (error) {
      console.error(`Failed to connect ${appId}:`, error);

      setError(
        error instanceof Error ? error.message : `Failed to connect ${appId}.`,
      );
    } finally {
      setProcessingApp(null);
    }
  };

  // ============================================
  // DISCONNECT
  // ============================================

  const handleDisconnect = async (appId: string) => {
    try {
      setProcessingApp(appId);
      setError(null);

      const connection = await disconnectApp(appId);

      setApps((current) =>
        current.map((app) => (app.app_id === appId ? connection : app)),
      );
    } catch (error) {
      console.error(`Failed to disconnect ${appId}:`, error);

      setError(
        error instanceof Error
          ? error.message
          : `Failed to disconnect ${appId}.`,
      );
    } finally {
      setProcessingApp(null);
    }
  };

  // ============================================
  // LOADING
  // ============================================

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-(--foreground)">
            Connected Apps
          </h2>

          <p className="mt-1 text-sm text-(--muted)">
            Manage the apps and services your assistant can access.
          </p>
        </div>

        <div className="rounded-xl border border-(--border) bg-(--card) p-6">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-(--border) border-t-blue-500" />

            <p className="text-sm text-(--muted)">Loading connected apps...</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <div>
        <h2 className="text-lg font-semibold text-(--foreground)">
          Connected Apps
        </h2>

        <p className="mt-1 text-sm text-(--muted)">
          Manage the apps and services your assistant can access.
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* APPS */}

      <div className="space-y-3">
        {AVAILABLE_APPS.map((app) => {
          const connected = isConnected(app.id);

          const processing = processingApp === app.id;

          return (
            <div
              key={app.id}
              className="
                flex items-center justify-between
                rounded-xl
                border border-(--border)
                bg-(--card)
                p-4
                transition
                hover:bg-black/3
                dark:hover:bg-white/3
              "
            >
              {/* LEFT */}

              <div className="flex items-center gap-4">
                {/* ICON */}

                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-xl
                    bg-black/5
                    dark:bg-white/10
                  "
                >
                  {app.id === "notion" ? (
                    <span className="text-lg font-bold">N</span>
                  ) : (
                    <span className="text-sm font-bold">SO</span>
                  )}
                </div>

                {/* INFO */}

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-(--foreground)">
                      {app.name}
                    </h3>

                    {connected && (
                      <span className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle2 size={14} />
                        Connected
                      </span>
                    )}
                  </div>

                  <p className="mt-1 max-w-md text-sm text-(--muted)">
                    {app.description}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="flex items-center gap-2">
                {connected ? (
                  <>
                    {/* MANAGE */}

                    <button
                      type="button"
                      disabled={processing}
                      className="
                        flex items-center gap-2
                        rounded-lg
                        px-3 py-2
                        text-sm
                        text-(--foreground)
                        transition
                        hover:bg-black/5
                        dark:hover:bg-white/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <Settings size={15} />
                      Manage
                    </button>

                    {/* DISCONNECT */}

                    <button
                      type="button"
                      disabled={processing}
                      onClick={() => handleDisconnect(app.id)}
                      className="
                        flex items-center gap-2
                        rounded-lg
                        px-3 py-2
                        text-sm
                        text-red-500
                        transition
                        hover:bg-red-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {processing ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500/30 border-t-red-500" />
                          Disconnecting...
                        </>
                      ) : (
                        <>
                          <Unplug size={15} />
                          Disconnect
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  /* CONNECT */

                  <button
                    type="button"
                    disabled={processing}
                    onClick={() => handleConnect(app.id)}
                    className="
                      flex items-center gap-2
                      rounded-lg
                      bg-black
                      px-4 py-2
                      text-sm
                      text-white
                      transition
                      hover:opacity-90
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      dark:bg-white
                      dark:text-black
                    "
                  >
                    {processing ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink size={15} />
                        Connect
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
