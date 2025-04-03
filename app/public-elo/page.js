"use client";

import { useEffect, useState } from "react";

export default function PublicEloPage() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch(`/api/players`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
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
          {players.map((player) => {
            return (
              <li
                key={player.id}
                className="flex flex-row items-center justify-between h-10"
              >
                <div className="flex-[1] border border-gray-700 px-1 h-full text-center flex items-center justify-center">
                  {player.rank}
                </div>
                <div className="flex-[4] border border-gray-700 px-1 h-full text-center flex items-center justify-start">
                  {player.name}
                </div>
                <div className="flex-[3] border border-gray-700 px-1 h-full text-center flex items-center justify-center">
                  {player.elo}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
