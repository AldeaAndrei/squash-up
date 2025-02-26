"use client";

import { useState, useEffect } from "react";

export default function LeaderboardList() {
  const [games, setGames] = useState([]);
  const [players, setPlayers] = useState([]);

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const storedGames = localStorage.getItem("games");
    const storedPlayers = localStorage.getItem("players");

    if (storedGames) {
      try {
        setGames(JSON.parse(storedGames));
      } catch (error) {
        setGames([]);
      }
    }

    if (storedPlayers) {
      try {
        setPlayers(JSON.parse(storedPlayers));
      } catch (error) {
        setPlayers([]);
      }
    }
  }, []);

  useEffect(() => {
    if (!players || !games) return;

    let newLeaderboard = [];

    players.forEach((player) => {
      let wins = 0;
      let total = 0;

      games.forEach((game) => {
        game.matches.forEach((match) => {
          if (match.player1Name == player.name) {
            wins += match.player1Score > match.player2Score ? 1 : 0;
            total += parseInt(match.player1Score);
          }
          if (match.player2Name == player.name) {
            wins += match.player2Score > match.player1Score ? 1 : 0;
            total += parseInt(match.player2Score);
          }
        });
      });

      newLeaderboard.push({ player: player.name, total: total, wins: wins });
    });

    newLeaderboard.sort((a, b) => b.wins - a.wins);

    setLeaderboard(newLeaderboard);
  }, [players, games]);

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
              {row.player}
            </div>
            <div className="flex-[1] flex justify-end pr-2 items-center">
              <span className="text-gray-500 text-xs mr-1">Total</span>{" "}
              {row.total}
            </div>
            <div className="flex-[1] flex justify-end pr-2 items-center">
              <span className="text-gray-500 text-xs mr-1">Meciuri</span>{" "}
              {row.wins}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
