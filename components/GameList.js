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

  const setScores = (
    player1Name,
    player1Score,
    player2Name,
    player2Score,
    round
  ) => {
    if (!games) return;

    setGames((prevGames) =>
      prevGames.map((game) => {
        if (game.round !== round) return game;

        return {
          ...game,
          matches: game.matches.map((match) =>
            match.player1Name === player1Name &&
            match.player2Name === player2Name
              ? {
                  ...match,
                  player1Score: player1Score,
                  player2Score: player2Score,
                }
              : match
          ),
        };
      })
    );
  };

  return (
    <ul className="overflow-scroll-y flex flex-col gap-2 justify-center items-center">
      {games.map((game, index) => {
        return (
          <ul
            key={`game-${index}`}
            className="overflow-scroll-y flex flex-col gap-2 justify-center items-center"
          >
            <div className="flex flex-row w-full justify-center items-center">
              <div className="flex-grow bg-white h-[1px] rounded-full" />
              <div className="px-2">Runda {game.round + 1}</div>
              <div className="flex-grow bg-white h-[1px] rounded-full" />
            </div>
            {game.matches.map((match, index) => {
              return (
                <div key={index}>
                  <GameListElement
                    key={index}
                    match={match}
                    setScores={setScores}
                    round={game.round}
                  />
                </div>
              );
            })}
          </ul>
        );
      })}
    </ul>
  );
}
