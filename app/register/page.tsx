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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

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
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      setRegistered(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Registration failed."
      );
    }
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-(--background)
        px-4
        py-8
        text-(--foreground)
        transition-colors
        duration-200
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <div
          className="
            absolute
            left-1/2
            top-[-10%]
            h-120
            w-120
            -translate-x-1/2
            rounded-full
            bg-[#D97757]/10
            blur-[120px]
            dark:bg-[#D97757]/10
          "
        />

        <div
          className="
            absolute
            bottom-[-15%]
            right-[-10%]
            h-90
            w-90
            rounded-full
            bg-[#D97757]/5
            blur-[110px]
          "
        />
      </div>

      <div className="relative w-full max-w-105">
        <div
          className="
            rounded-2xl
            border
            border-(--border)
            bg-(--card)
            px-8
            pb-9
            pt-8
            shadow-2xl
            backdrop-blur-sm
            transition-colors
            duration-200
          "
        >
          <div className="mb-7 flex flex-col items-center text-center">
            <div
              className="
                mb-4
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-xl
                bg-[#D97757]
                shadow-[0_4px_16px_-2px_rgba(217,119,87,0.35)]
              "
            >
              <span
                className="text-lg font-medium text-white"
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                C
              </span>
            </div>

            <h1
              className="
                text-[26px]
                leading-tight
                text-(--foreground)
              "
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
              }}
            >
              Create your account
            </h1>

            <p className="mt-2 text-[14.5px] text-(--muted)">
              Start using{" "}
              <span className="font-medium text-(--foreground)">
                CacheAI
              </span>
            </p>
          </div>

          {error && (
            <div
              className="
                mb-5
                flex
                items-start
                gap-2
                rounded-lg
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-500
              "
            >
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6 flex flex-col gap-2.5">
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2.5
                rounded-lg
                border
                border-(--border)
                bg-(--input-bg)
                py-2.5
                text-sm
                font-medium
                text-(--foreground)
                transition
                hover:bg-(--hover)
                hover:border-(--border-hover)
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

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-(--border)" />
            <span className="text-xs text-(--muted)">or</span>
            <div className="h-px flex-1 bg-(--border)" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-(--foreground)
                "
              >
                Name
              </label>

              <input
                id="name"
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
                  border-(--border)
                  bg-(--input-bg)
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-(--foreground)
                  placeholder:text-(--muted)
                  outline-none
                  transition
                  hover:border-(--border-hover)
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-(--foreground)
                "
              >
                Email
              </label>

              <input
                id="email"
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
                  border-(--border)
                  bg-(--input-bg)
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-(--foreground)
                  placeholder:text-(--muted)
                  outline-none
                  transition
                  hover:border-(--border-hover)
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-(--foreground)
                "
              >
                Password
              </label>

              <input
                id="password"
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
                  border-(--border)
                  bg-(--input-bg)
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-(--foreground)
                  placeholder:text-(--muted)
                  outline-none
                  transition
                  hover:border-(--border-hover)
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <p className="mt-1.5 text-xs text-(--muted)">
                Must contain at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-(--foreground)
                "
              >
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={loading}
                className="
                  w-full
                  rounded-lg
                  border
                  border-(--border)
                  bg-(--input-bg)
                  px-3.5
                  py-2.5
                  text-[15px]
                  text-(--foreground)
                  placeholder:text-(--muted)
                  outline-none
                  transition
                  hover:border-(--border-hover)
                  focus:border-[#D97757]
                  focus:ring-2
                  focus:ring-[#D97757]/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

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

          <p className="mt-7 text-center text-sm text-(--muted)">
            Already have an account?{" "}
            <Link
              href="/login"
              className="
                font-medium
                text-[#D97757]
                transition
                hover:underline
              "
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-(--muted)">
          By continuing, you agree to CacheAI&apos;s{" "}
          <Link
            href="/terms"
            className="
              underline
              transition
              hover:text-(--foreground)
            "
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="
              underline
              transition
              hover:text-(--foreground)
            "
          >
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