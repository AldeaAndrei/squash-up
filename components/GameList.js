"use client";

import { useEffect, useState } from "react";
import GameListElement from "./GameListElement";

export default function GameList() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const storedGames = localStorage.getItem("games");
    if (storedGames) {
      try {
        setGames(JSON.parse(storedGames));
      } catch (error) {
        setGames([]);
      }
    }
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      localStorage.setItem("games", JSON.stringify(games));
    }
  }, [games]);

  const setScores = (player1Name, player1Score, player2Name, player2Score) => {
    if (games == null) return;

    setGames((prevGames) =>
      prevGames.map((game) =>
        game.player1Name === player1Name && game.player2Name === player2Name
          ? { ...game, player1Score: player1Score, player2Score: player2Score }
          : game
      )
    );
  };

  return (
    <div>
      <ul className="overflow-scroll-y flex flex-col gap-2">
        {games.map((game, index) => {
          return (
            <GameListElement key={index} game={game} setScores={setScores} />
          );
        })}
      </ul>
    </div>
  );
}
