"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StartGameButton() {
  const [players, setPlayers] = useState([]);
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/match");
  };

  const getPlayers = () => {
    const storedPlayers = localStorage.getItem("players");
    if (storedPlayers) {
      try {
        setPlayers(JSON.parse(storedPlayers));
      } catch (error) {
        setPlayers([]);
      }
    }
  };

  useEffect(() => {
    getPlayers();
  }, []);

  const generateGames = () => {
    getPlayers();

    if (players.length === 0) return;

    let games = [];

    players.forEach((player1) => {
      players.forEach((player2) => {
        if (player1.name !== player2.name) {
          const game = {
            player1Name: player1.name,
            player2Name: player2.name,
            player1Score: 0,
            player2Score: 0,
          };

          games.push(game);
        }
      });
    });

    localStorage.setItem("games", JSON.stringify(games));

    handleRedirect();
  };

  // TODO: disable button
  return (
    <button
      className={`bg-green-500 p-1 w-32 rounded-xl border-green-800 border-2`}
      onClick={() => generateGames()}
      //   disabled={players.length === 0}
    >
      Start joc
    </button>
  );
}
