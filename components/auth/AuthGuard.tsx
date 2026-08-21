"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function AuthGuard({
  children,
}: Props) {
  const router = useRouter();

  const token = useAuthStore(
    (state) => state.token,
  );

  const initialized = useAuthStore(
    (state) => state.initialized,
  );

  const initialize = useAuthStore(
    (state) => state.initialize,
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (initialized && !token) {
      router.replace("/login");
    }
  }, [
    initialized,
    token,
    router,
  ]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
}