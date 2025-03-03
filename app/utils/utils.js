export const generateGames = () => {
  const storedPlayers = localStorage.getItem("players");
  const gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

  const storedGameType = localStorage.getItem("gameType");
  const gameType = storedGameType ? JSON.parse(storedGameType) : 3;

  if (gamePlayers.length === 0) return;

  const storedGames = localStorage.getItem("games");
  const games = storedGames ? JSON.parse(storedGames) : [];

  const currentRounds = games.length;

  let pairs = {};
  let matches = [];

  gamePlayers.forEach((player1) => {
    gamePlayers.forEach((player2) => {
      const pairKey = `${player1.name}-${player2.name}`;
      const reversePairKey = `${player2.name}-${player1.name}`;

      if (player1.name !== player2.name) {
        if (!pairs[pairKey] && !pairs[reversePairKey]) {
          const rounds = Array.from({ length: gameType }, () => ({
            player1Score: 0,
            player2Score: 0,
          }));

          const match = {
            player1Name: player1.name,
            player2Name: player2.name,
            rounds,
          };

          pairs[pairKey] = true;
          pairs[reversePairKey] = true;

          matches.push(match);
        }
      }
    });
  });

  const game = {
    game: currentRounds,
    matches: matches,
  };

  const newGames = [game, ...games];

  localStorage.setItem("games", JSON.stringify(newGames));
};
