export interface AppConnection {
  id: number;
  app_id: string;
  connected: boolean;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function getAppConnections(): Promise<AppConnection[]> {
  const response = await fetch(
    `${API_URL}/api/settings/apps`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch app connections");
  }

  return response.json();
}

export async function connectApp(
  appId: string,
): Promise<AppConnection> {
  const response = await fetch(
    `${API_URL}/api/settings/apps/${appId}/connect`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to connect ${appId}`);
  }

  return response.json();
}

export async function disconnectApp(
  appId: string,
): Promise<AppConnection> {
  const response = await fetch(
    `${API_URL}/api/settings/apps/${appId}/disconnect`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to disconnect ${appId}`);
  }

  return response.json();
}