"use client";

import { START_ELO } from "@/constants";
import { useEffect, useState } from "react";

export default function PublicEloPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(`/api/statistics/public_elo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        setPlayers(await response.json());
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <div>
      {players && players?.length > 0 && (
        <ul>
          <li className="flex flex-row items-center justify-between h-10">
            <div className="flex-[1] border border-gray-700 px-1 h-full text-center flex items-center justify-center">
              Loc
            </div>
            <div className="flex-[4] border border-gray-700 px-1 h-full text-center flex items-center justify-center">
              Nume
            </div>
            <div className="flex-[2] border border-gray-700 px-1 h-full text-center flex items-center justify-center">
              ELO
            </div>
            <div className="flex-[2] border border-gray-700 px-1 h-full text-center flex items-center justify-center">
              % Castig
            </div>
          </li>
          {players.map((player, index) => {
            return (
              <li
                key={player.id}
                className="flex flex-row items-center justify-between h-10"
              >
                <div className="flex-[1] border border-gray-700 px-1 h-full text-center flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-[4] border border-gray-700 px-1 h-full text-center flex items-center justify-start font-semibold">
                  <span className="ml-1">{player.name}</span>
                </div>
                <div className="flex-[2] border border-gray-700 px-1 h-full text-center flex items-center justify-center font-semibold">
                  <span
                    className={
                      player.elo === START_ELO
                        ? "text-white"
                        : player.elo < START_ELO
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {player.elo}
                  </span>
                </div>
                <div className="flex-[2] border border-gray-700 px-1 h-full text-center flex items-center justify-center font-semibold">
                  <span
                    className={
                      player.win === 50
                        ? "text-white"
                        : player.win < 50
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {player.win.toFixed(1)}%
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
