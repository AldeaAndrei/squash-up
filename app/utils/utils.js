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
  const gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

  if (gamePlayers.length < 2) return { id: null, error: "Not enough players" };

  const storedGameType = localStorage.getItem("gameType");
  const gameType = storedGameType ? JSON.parse(storedGameType) : 3;

  let tournament = await createTournamentEntry();
  let game = await createGameEntry(null, null, tournament[0].id);

  let roundsData = [];
  let setsData = [];
  let pairs = {};

  gamePlayers.forEach((player1) => {
    gamePlayers.forEach((player2) => {
      const pairKey = `${player1.id}-${player2.id}`;
      const reversePairKey = `${player2.id}-${player1.id}`;

      if (player1.id !== player2.id) {
        if (!pairs[pairKey] && !pairs[reversePairKey]) {
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
        }
      }
    });
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
  const gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

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

  gamePlayers.forEach((player1) => {
    gamePlayers.forEach((player2) => {
      const pairKey = `${player1.id}-${player2.id}`;
      const reversePairKey = `${player2.id}-${player1.id}`;

      if (player1.id !== player2.id) {
        if (!pairs[pairKey] && !pairs[reversePairKey]) {
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
        }
      }
    });
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
