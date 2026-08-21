"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();

  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // -----------------------------
    // REGISTER
    // -----------------------------

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed.",
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#212121] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-105">

        {/* =========================================
            WORDMARK
        ========================================= */}

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2.5">

            <div className="w-8 h-8 rounded-full bg-[#D97757] flex items-center justify-center">
              <span
                className="text-white text-sm font-medium"
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                C
              </span>
            </div>

            <span className="text-white text-lg font-medium tracking-tight">
              CacheAI
            </span>

          </div>
        </div>

        {/* =========================================
            REGISTER CARD
        ========================================= */}

        <div className="bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-8 py-10 shadow-xl">

          {/* =========================================
              HEADER
          ========================================= */}

          <div className="text-center mb-8">

            <h1
              className="text-[28px] leading-tight text-white"
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Create your account
            </h1>

            <p className="text-gray-400 mt-2.5 text-[15px]">
              Start using CacheAI
            </p>

          </div>

          {/* =========================================
              ERROR
          ========================================= */}

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* =========================================
              GOOGLE SSO
          ========================================= */}

          <div className="flex flex-col gap-2.5 mb-6">

            <button
              type="button"
              className="
                w-full
                flex
                items-center
                justify-center
                gap-2.5
                rounded-lg
                border
                border-[#3a3a3a]
                bg-[#303030]
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#383838]
              "
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M15.68 8.18c0-.58-.05-1.13-.15-1.66H8v3.14h4.3a3.68 3.68 0 0 1-1.6 2.42v2h2.58c1.51-1.39 2.4-3.44 2.4-5.9z"
                />

                <path
                  fill="#34A853"
                  d="M8 16c2.16 0 3.97-.72 5.29-1.94l-2.58-2c-.72.48-1.63.77-2.71.77-2.08 0-3.85-1.41-4.48-3.3H.86v2.07A8 8 0 0 0 8 16z"
                />

                <path
                  fill="#FBBC05"
                  d="M3.52 9.53a4.8 4.8 0 0 1 0-3.06V4.4H.86a8 8 0 0 0 0 7.2l2.66-2.07z"
                />

                <path
                  fill="#EA4335"
                  d="M8 3.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A7.94 7.94 0 0 0 8 0 8 8 0 0 0 .86 4.4l2.66 2.07C4.15 4.59 5.92 3.18 8 3.18z"
                />
              </svg>

              Continue with Google
            </button>

          </div>

          {/* =========================================
              DIVIDER
          ========================================= */}

          <div className="flex items-center gap-3 mb-6">

            <div className="h-px flex-1 bg-[#3a3a3a]" />

            <span className="text-xs text-gray-500">
              or
            </span>

            <div className="h-px flex-1 bg-[#3a3a3a]" />

          </div>

          {/* =========================================
              FORM
          ========================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* NAME */}

            <div>

              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Naveen"
                autoComplete="name"
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#444]
                  bg-[#303030]
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  transition
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                "
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#444]
                  bg-[#303030]
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  transition
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                "
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete="new-password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#444]
                  bg-[#303030]
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  transition
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                "
              />

              <p className="text-xs text-gray-500 mt-1.5">
                Must contain at least 8 characters.
              </p>

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Confirm password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete="new-password"
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#444]
                  bg-[#303030]
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  transition
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                "
              />

            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-lg
                bg-[#D97757]
                py-2.5
                font-medium
                text-white
                text-[15px]
                transition
                hover:bg-[#c76a4c]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {loading
                ? "Creating account…"
                : "Create account"}
            </button>

          </form>

          {/* =========================================
              LOGIN LINK
          ========================================= */}

          <p className="text-center text-sm text-gray-400 mt-7">
            Already have an account?{" "}

            <Link
              href="/login"
              className="text-[#e08a68] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>

        {/* =========================================
            TERMS
        ========================================= */}

        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to CacheAI&apos;s{" "}

          <Link
            href="/terms"
            className="underline hover:text-gray-400"
          >
            Terms
          </Link>{" "}

          and{" "}

          <Link
            href="/privacy"
            className="underline hover:text-gray-400"
          >
            Privacy policy
          </Link>
          .
        </p>

      </div>
    </main>
  );
}