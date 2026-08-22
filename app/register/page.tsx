"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";
import RegistrationSuccessModal from "@/components/Model/Registrationsuccessmodal";

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3.5"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M22 12c0-5.52-4.48-10-10-10v3.5C16.14 5.5 18.5 8.36 18.5 12H22z"
      />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

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

      // Show the success modal instead of redirecting immediately —
      // the redirect now happens when the user confirms it.
      setRegistered(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Registration failed.",
      );
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#171717] flex items-center justify-center px-4 py-8">
      {/* Ambient glow — purely decorative, sits behind everything */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-10%] h-120 w-120 -translate-x-1/2 rounded-full bg-[#D97757]/1200 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-90 w-90 rounded-full bg-[#D97757]/6 blur-[110px]" />
      </div>

      <div className="relative w-full max-w-105">

        {/* =========================================
            REGISTER CARD
        ========================================= */}

        <div className="rounded-2xl border border-[#333] bg-[#212121]/90 px-8 pb-9 pt-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-sm">

          {/* =========================================
              HEADER — logo inline with the heading
          ========================================= */}

          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D97757] shadow-[0_4px_16px_-2px_rgba(217,119,87,0.5)]">
              <span
                className="text-white text-lg font-medium"
                style={{ fontFamily: "Georgia, serif" }}
              >
                C
              </span>
            </div>

            <h1
              className="text-[26px] leading-tight text-white"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Create your account
            </h1>

            <p className="mt-2 text-[14.5px] text-gray-400">
              Start using <span className="text-gray-300">CacheAI</span>
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
                bg-[#2a2a2a]
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#323232]
                hover:border-[#454545]
                active:scale-[0.99]
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
            <div className="h-px flex-1 bg-[#333]" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-[#333]" />
          </div>

          {/* =========================================
              FORM
          ========================================= */}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}

            <div>
              <label className="block text-sm text-gray-300 mb-1.5 font-medium">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Naveen"
                autoComplete="name"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#3d3d3d]
                  bg-[#2a2a2a]
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
                  disabled:opacity-60
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#3d3d3d]
                  bg-[#2a2a2a]
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
                  disabled:opacity-60
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
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#3d3d3d]
                  bg-[#2a2a2a]
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
                  disabled:opacity-60
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
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-[#3d3d3d]
                  bg-[#2a2a2a]
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
                  disabled:opacity-60
                "
              />
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-[#D97757]
                py-2.5
                text-[15px]
                font-medium
                text-white
                shadow-[0_4px_14px_-4px_rgba(217,119,87,0.45)]
                transition
                hover:bg-[#c76a4c]
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-70
                disabled:active:scale-100
              "
            >
              {loading && <Spinner />}
              {loading ? "Creating account…" : "Create account"}
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
          <Link href="/terms" className="underline hover:text-gray-400">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-gray-400">
            Privacy policy
          </Link>
          .
        </p>
      </div>

      {registered && (
        <RegistrationSuccessModal
          name={name}
          onConfirm={() => router.push("/login")}
        />
      )}
    </main>
  );
}