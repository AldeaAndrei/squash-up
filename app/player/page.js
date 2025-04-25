"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export default function PlayerPage() {
  const { player } = useAuthStore();
  const [playerData, setPlayerData] = useState({});
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState();

  useEffect(() => {
    async function fetchPlayer() {
      if (!player) return;

      const res = await fetch(`/api/players/${player}`);
      const data = await res.json();

      setPlayerData(data.player);
    }

    async function fetchStatistics() {
      if (!player) return;

      const res = await fetch(`/api/statistics/player/${player}`);
      const data = await res.json();

      setStats(data);
    }

    async function fetchHistory() {
      if (!player) return;

      const res = await fetch(`/api/elo/history/player/${player}`);
      const data = await res.json();

      setHistory(data);
    }

    fetchPlayer();
    fetchHistory();
    fetchStatistics();
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
          <div className="">
            {playerData?.elo && (
              <div>
                <p>
                  ELO <span className="font-semibold">{playerData.elo}</span>
                </p>
                {stats && (
                  <p>
                    ↑{" "}
                    <span className="font-semibold text-sm">
                      {stats.bestElo}
                    </span>
                  </p>
                )}
                {stats && (
                  <p>
                    ↓{" "}
                    <span className="font-semibold text-sm">
                      {stats.worstElo}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
          {stats && (
            <div>
              <div></div>
              <div>
                Total: {stats.gamesPlayed} - C:{" "}
                {(stats.percentWon * 100).toFixed(1)}% / P:{" "}
                {(stats.percentLost * 100).toFixed(1)}%
              </div>
              <div>
                Cele mai multe victorii:{" "}
                <span className="font-semibold">
                  {stats.mostWinsAgainstName} ({stats.mostWinsAgainstCount})
                </span>
              </div>
              <div>
                Cele mai multe infrangeri:{" "}
                <span className="font-semibold">
                  {stats.mostLossesAgainstName} ({stats.mostLossesAgainstCount})
                </span>
              </div>
            </div>
          )}
          <div className="py-1">
            {history?.length > 0 && (
              <ul>
                {history.map((h) => {
                  return (
                    <li
                      key={h.round_id}
                      className="flex items-center justify-start h-14 my-3"
                    >
                      <div
                        className={`h-full w-2 rounded-2xl mr-2 ${
                          h.won ? "bg-green-600" : "bg-red-600"
                        }`}
                      />
                      <div className="h-full">
                        <div>
                          {h.won
                            ? `Castigat contra ${h.opponent}`
                            : `Pierdut contra ${h.opponent}`}
                        </div>
                        <div>ELO final: {h.elo}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
