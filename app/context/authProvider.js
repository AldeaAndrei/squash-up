"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function AuthProvider({ children }) {
  const { setPlayer } = useAuthStore();

  useEffect(() => {
    async function fetchPlayer() {
      const res = await fetch("/api/session");
      const data = await res.json();

      if (data.playerId) {
        setPlayer(data.playerId);
      }
    }
    fetchPlayer();
  }, [setPlayer]);

  return children;
}
