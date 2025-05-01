export const generateNewTournament = async (creatorPlayerId) => {
  try {
    const storedPlayers = localStorage.getItem("players");
    let gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

    if (gamePlayers.length < 2) {
      return { id: null, error: "Not enough players" };
    }

    const storedGameType = localStorage.getItem("gameType");
    const gameType = storedGameType ? JSON.parse(storedGameType) : 3;

    const tournamentData = {
      players: gamePlayers,
      creator_player: creatorPlayerId,
      game_type: gameType,
    };

    const response = await fetch("/api/tournaments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(tournamentData),
    });

    const data = await response.json();

    if (data && data.tournament_id) {
      console.log("Tournament created successfully!", data.tournament_id);
      localStorage.setItem(
        "currentTournament",
        JSON.stringify(data.tournament_id)
      );
      return { id: data.tournament_id, error: null };
    } else {
      console.log("Error:", data.message);
      return { id: null, error: data.message };
    }
  } catch (error) {
    console.error("Error creating tournament:", error);
    return { id: null, error: error.message || "Unknown error" };
  }
};

export const addGameToTournament = async (creatorPlayerId, tournamentId) => {
  try {
    const storedPlayers = localStorage.getItem("players");
    let gamePlayers = storedPlayers ? JSON.parse(storedPlayers) : [];

    if (gamePlayers.length < 2) {
      return { id: null, error: "Not enough players" };
    }

    const storedGameType = localStorage.getItem("gameType");
    const gameType = storedGameType ? JSON.parse(storedGameType) : 3;

    const gameData = {
      players: gamePlayers,
      creator_player: creatorPlayerId,
      game_type: gameType,
      tournament_id: tournamentId,
    };

    const response = await fetch("/api/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(gameData),
    });

    const data = await response.json();

    if (data && data.tournament_id) {
      console.log("Tournament created successfully!", data.tournament_id);
      localStorage.setItem(
        "currentTournament",
        JSON.stringify(data.tournament_id)
      );
      return { id: data.tournament_id, error: null };
    } else {
      console.log("Error:", data.message);
      return { id: null, error: data.message };
    }
  } catch (error) {
    console.error("Error creating tournament:", error);
    return { id: null, error: error.message || "Unknown error" };
  }
};
