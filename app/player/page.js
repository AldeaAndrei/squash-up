"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function PlayerPage() {
  const { player } = useAuthStore();
  const [playerData, setPlayerData] = useState({});

  useEffect(() => {
    async function fetchPlayer() {
      if (!player) return;

      const res = await fetch(`/api/players/${player}`);
      const data = await res.json();

      setPlayerData(data.player);
    }
    fetchPlayer();
  }, [player]);

  return (
    <div className="p-3">
      {playerData ? (
        <div className="flex flex-col gap-3">
          <h1 className="flex gap-2 font-bold text-3xl items-center justify-start">
            <span>{playerData.name}</span>
            {/* TODO: fix */}
            {/* {playerData?.rank && (
              <span className="font-semibold text-2xl">#{playerData.rank}</span>
            )} */}
          </h1>
          {playerData?.elo && (
            <p>
              ELO <span className="font-semibold">{playerData.elo}</span>
            </p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
