"use client";

import { create } from "zustand";

import {
  login as loginRequest,
  register as registerRequest,
} from "@/services/auth";

import {
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth";

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: false,
  initialized: false,

  // ------------------------------------------
  // INITIALIZE AUTH
  // ------------------------------------------

  initialize: () => {
    if (typeof window === "undefined") {
      return;
    }

    const token = localStorage.getItem("access_token");
    const userString = localStorage.getItem("user");

    let user: User | null = null;

    if (userString) {
      try {
        user = JSON.parse(userString);
      } catch {
        user = null;
      }
    }

    set({
      token,
      user,
      initialized: true,
    });
  },

  // ------------------------------------------
  // LOGIN
  // ------------------------------------------

  login: async (data) => {
    set({
      loading: true,
    });

    try {
      const response = await loginRequest(data);

      localStorage.setItem(
        "access_token",
        response.access_token,
      );

      if (response.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.user),
        );
      }

      set({
        token: response.access_token,
        user: response.user ?? null,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ------------------------------------------
  // REGISTER
  // ------------------------------------------

  register: async (data) => {
    set({
      loading: true,
    });

    try {
      const response = await registerRequest(data);

      localStorage.setItem(
        "access_token",
        response.access_token,
      );

      if (response.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.user),
        );
      }

      set({
        token: response.access_token,
        user: response.user ?? null,
      });
    } finally {
      set({
        loading: false,
      });
    }
  },

  // ------------------------------------------
  // LOGOUT
  // ------------------------------------------

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
    });
  },
}));