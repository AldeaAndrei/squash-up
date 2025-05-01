"use client";

import { useState, useEffect } from "react";

export default function LeaderboardList({ tournamentId }) {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(
          `/api/tournaments/${tournamentId}/leaderboard`,
          { cache: "no-store" }
        );

        if (response.ok) {
          const data = await response.json();
          setLeaderboard(data.leaderboard);
        } else {
          console.error("Failed to fetch tournament data");
        }
      } catch (error) {
        console.error("Error fetching tournament data:", error);
      }
    };

    fetchTournament();
  }, []);

  const indexSize = (index) => {
    if (index === 0) return "text-[26px] font-bold";
    if (index === 1) return "text-[24px] font-bold";
    if (index === 2) return "text-[22px] font-bold";
    return "text-[18px]";
  };

  const indexColor = (index) => {
    if (index === 0) return "text-[#feda15]";
    if (index === 1) return "text-[#a7b1c9]";
    if (index === 2) return "text-[#d89142]";
    return "";
  };

  const indexBg = (index) => {
    if (index === 0) return "bg-gradient-to-r from-[#feda15] to-transparent";
    if (index === 1) return "bg-gradient-to-r from-[#a7b1c9] to-transparent";
    if (index === 2) return "bg-gradient-to-r from-[#d89142] to-transparent";
    return "";
  };

  return (
    <ul className="flex flex-col gap-3">
      {leaderboard.map((row, index) => {
        return (
          <li
            key={index}
            className="flex flex-row justify-evenly bg-[#1e2021] h-16"
          >
            <div className={`flex-[0.3] ${indexBg(index)}`} />
            <div className="flex-[1] flex justify-center items-center">
              <span className={`${indexSize(index)} ${indexColor(index)}`}>
                {index + 1}
              </span>
            </div>
            <div className="flex-[3] flex justify-start items-center">
              {row.name}
            </div>
            <div className="flex-[1] flex justify-end pr-2 items-center">
              <span className="text-gray-500 text-xs mr-1">Total</span>{" "}
              {row.total}
            </div>
            <div className="flex-[1] flex justify-end pr-2 items-center">
              <span className="text-gray-500 text-xs mr-1">Meciuri</span>{" "}
              {row.rounds}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
