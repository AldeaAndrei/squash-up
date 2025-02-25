"use client";

import { useRouter } from "next/navigation";

export default function StartGameButton() {
  const router = useRouter();

  const handleRedirect = () => {
    router.push("/match");
  };

  const generateGames = () => {
    const storedPlayers = localStorage.getItem("players");
    const gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

    if (gamePlayers.length === 0) return;

    let games = [];
    let pairs = {};

    gamePlayers.forEach((player1) => {
      gamePlayers.forEach((player2) => {
        const pairKey = `${player1.name}-${player2.name}`;
        const reversePairKey = `${player2.name}-${player1.name}`;

        if (player1.name !== player2.name) {
          if (!pairs[pairKey] && !pairs[reversePairKey]) {
            const game = {
              player1Name: player1.name,
              player2Name: player2.name,
              player1Score: 0,
              player2Score: 0,
            };

            pairs[pairKey] = true;
            pairs[reversePairKey] = true;

            games.push(game);
          }
        }
      });
    });

    localStorage.setItem("games", JSON.stringify(games));

    handleRedirect();
  };

  // TODO: disable button
  return (
    <button
      className="bg-[#131313] hover:bg-[#1d1f1e] font-bold py-2 px-4 border border-[#292929] rounded"
      onClick={() => generateGames()}
    >
      Start joc
    </button>
  );
}
