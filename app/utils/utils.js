const createTournamentEntry = async () => {
  try {
    const response = await fetch("/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create tournament");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating tournament:", error);
    return null;
  }
};

const createGameEntry = async (created_by, played_by, tournament_id) => {
  try {
    const response = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ created_by, played_by, tournament_id }),
    });

    if (!response.ok) {
      throw new Error("Failed to create game");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
};

const createMultipleRoundsEntry = async (rounds) => {
  try {
    const response = await fetch("/api/rounds", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rounds,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create rounds");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating rounds:", error);
    return null;
  }
};

const createMultipleSetsEntry = async (sets) => {
  try {
    const response = await fetch("/api/sets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sets,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create sets");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating sets:", error);
    return null;
  }
};

export const generateNewTournament = async () => {
  const storedPlayers = localStorage.getItem("players");
  let gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

  if (gamePlayers.length < 2) return { id: null, error: "Not enough players" };

  const storedGameType = localStorage.getItem("gameType");
  const gameType = storedGameType ? JSON.parse(storedGameType) : 3;

  let tournament = await createTournamentEntry();
  let game = await createGameEntry(null, null, tournament[0].id);

  let roundsData = [];
  let setsData = [];
  let pairs = {};

  const generateRoundForPair = (player1, player2, pairKey, reversePairKey) => {
    const round = {
      player_1_name: player1.name,
      player_2_name: player2.name,
      player_1_id: player1.database_id,
      player_2_id: player2.database_id,
      game_id: game[0].id,
    };

    pairs[pairKey] = true;
    pairs[reversePairKey] = true;

    roundsData.push(round);
  };

  let generatedPairs = getPlayersPairs(gamePlayers.length);
  gamePlayers = gamePlayers.sort(() => Math.random() - 0.5);

  if (generatedPairs.length === 0) {
    let newGeneratedPairs = [];
    gamePlayers
      .sort(() => Math.random() - 0.5)
      .forEach((player1) => {
        gamePlayers
          .sort(() => Math.random() - 0.5)
          .forEach((player2) => {
            const pairKey = `${player1.id}-${player2.id}`;
            const reversePairKey = `${player2.id}-${player1.id}`;

            if (
              player1.id !== player2.id &&
              !pairs[pairKey] &&
              !pairs[reversePairKey]
            ) {
              newGeneratedPairs.push([player1.id, player2.id]);
            }
          });
      });
  }

  generatedPairs.forEach((pair) => {
    const player1 = gamePlayers[pair[0]];
    const player2 = gamePlayers[pair[1]];

    const pairKey = `${player1.id}-${player2.id}`;
    const reversePairKey = `${player2.id}-${player1.id}`;

    if (
      player1.id !== player2.id &&
      !pairs[pairKey] &&
      !pairs[reversePairKey]
    ) {
      generateRoundForPair(player1, player2, pairKey, reversePairKey);
    }
  });

  let rounds = await createMultipleRoundsEntry(roundsData);

  rounds.forEach((round) =>
    setsData.push(
      Array.from({ length: gameType }, () => ({
        player_1_score: 0,
        player_2_score: 0,
        round_id: round.id,
      }))
    )
  );

  let sets = await createMultipleSetsEntry(setsData.flat());

  localStorage.setItem("currentTournament", JSON.stringify(tournament[0].id));

  return { id: tournament[0].id, error: null };
};

export const addGameToTournament = async () => {
  const storedPlayers = localStorage.getItem("players");
  let gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

  if (gamePlayers.length < 2) return { id: null, error: "Not enough players" };

  const storedCurrentTournamentId = localStorage.getItem("currentTournament");
  const currentTournamentId = storedCurrentTournamentId
    ? JSON.parse(storedCurrentTournamentId)
    : null;

  if (!currentTournamentId) return { id: null, error: "No tournament found" };

  const storedGameType = localStorage.getItem("gameType");
  const gameType = storedGameType ? JSON.parse(storedGameType) : 3;

  let game = await createGameEntry(null, null, currentTournamentId);

  let roundsData = [];
  let setsData = [];
  let pairs = {};

  const generateRoundForPair = (player1, player2, pairKey, reversePairKey) => {
    const round = {
      player_1_name: player1.name,
      player_2_name: player2.name,
      player_1_id: player1.database_id,
      player_2_id: player2.database_id,
      game_id: game[0].id,
    };

    pairs[pairKey] = true;
    pairs[reversePairKey] = true;

    roundsData.push(round);
  };

  let generatedPairs = getPlayersPairs(gamePlayers.length);
  gamePlayers = gamePlayers.sort(() => Math.random() - 0.5);

  if (generatedPairs.length === 0) {
    let newGeneratedPairs = [];
    gamePlayers
      .sort(() => Math.random() - 0.5)
      .forEach((player1) => {
        gamePlayers
          .sort(() => Math.random() - 0.5)
          .forEach((player2) => {
            const pairKey = `${player1.id}-${player2.id}`;
            const reversePairKey = `${player2.id}-${player1.id}`;

            if (
              player1.id !== player2.id &&
              !pairs[pairKey] &&
              !pairs[reversePairKey]
            ) {
              newGeneratedPairs.push([player1.id, player2.id]);
            }
          });
      });
  }

  generatedPairs.forEach((pair) => {
    const player1 = gamePlayers[pair[0]];
    const player2 = gamePlayers[pair[1]];

    const pairKey = `${player1.id}-${player2.id}`;
    const reversePairKey = `${player2.id}-${player1.id}`;

    if (
      player1.id !== player2.id &&
      !pairs[pairKey] &&
      !pairs[reversePairKey]
    ) {
      generateRoundForPair(player1, player2, pairKey, reversePairKey);
    }
  });

  let rounds = await createMultipleRoundsEntry(roundsData);

  rounds.forEach((round) =>
    setsData.push(
      Array.from({ length: gameType }, () => ({
        player_1_score: 0,
        player_2_score: 0,
        round_id: round.id,
      }))
    )
  );

  let sets = await createMultipleSetsEntry(setsData.flat());

  return { id: currentTournamentId, error: null };
};

const getPlayersPairs = (count) => {
  if (count === 2) return [[0, 1]];
  if (count === 3)
    return [
      [0, 1],
      [1, 2],
      [0, 2],
    ];
  if (count === 4)
    return [
      [0, 1],
      [2, 3],
      [3, 1],
      [1, 2],
      [0, 3],
    ];
  if (count === 5)
    return [
      [0, 1],
      [3, 4],
      [1, 2],
      [0, 4],
      [2, 3],
      [1, 4],
      [0, 2],
      [1, 3],
      [2, 4],
      [0, 3],
    ];
  return [[0,1],[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,3],[2,4],[2,5],[3,4],[3,5],[4,5]];
};
