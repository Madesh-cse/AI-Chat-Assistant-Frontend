import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/backend";

export async function login(
  data: LoginRequest,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      error || "Invalid email or password",
    );
  }

  return response.json();
}

export async function register(
  data: RegisterRequest,
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      error || "Registration failed",
    );
  }

  return response.json();
}