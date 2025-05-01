"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { usePathname } from "next/navigation";

export default function AuthProvider({ children }) {
  const { setPlayer } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchPlayer() {
      const res = await fetch("/api/session", { cache: "no-store" });
      const data = await res.json();

      if (data.playerId) {
        setPlayer(data.playerId);
      } else {
        setPlayer(null);
      }
    }

    fetchPlayer();
  }, [pathname, setPlayer]);

  return children;
}
