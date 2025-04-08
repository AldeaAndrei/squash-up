import prisma from "@/app/lib/prisma";

const getPlayersPairs = (count) => {
  let pairs = [];

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
      [0, 2],
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

  for (let x = 0; x < count; x++) {
    for (let y = x + 1; y < count; y++) {
      pairs.push([x, y]);
    }
  }

  return shufflePairs(pairs);
};

function shufflePairs(pairs) {
  for (let i = pairs.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }
  return pairs;
}

async function createRounds(gamePlayers, game_id, gameType, tx) {
  let players = [...gamePlayers];

  let roundsData = [];
  let setsData = [];
  let pairs = {};

  const generateRoundForPair = (player1, player2, pairKey, reversePairKey) => {
    const round = {
      player_1_name: player1.name,
      player_2_name: player2.name,
      player_1_id: player1.database_id ? BigInt(player1.database_id) : null,
      player_2_id: player2.database_id ? BigInt(player2.database_id) : null,
      game_id: BigInt(game_id),
    };

    pairs[pairKey] = true;
    pairs[reversePairKey] = true;

    roundsData.push(round);
  };

  let generatedPairs = getPlayersPairs(players.length);
  players = players.sort(() => Math.random() - 0.5);

  generatedPairs.forEach((pair) => {
    const player1 = players[pair[0]];
    const player2 = players[pair[1]];

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

  const createdRoundsIds = [];

  for (const roundData of roundsData) {
    const createdRound = await tx.rounds.create({
      data: roundData,
    });
    createdRoundsIds.push(createdRound.id);
  }

  createdRoundsIds.forEach((round_id) =>
    setsData.push(
      ...Array.from({ length: gameType }, () => ({
        player_1_score: 0,
        player_2_score: 0,
        round_id: round_id,
      }))
    )
  );

  const sets = await tx.sets.createMany({
    data: setsData,
  });

  return { rounds: createdRoundsIds, sets };
}

// Add a new game to an already existing tournament
export async function createGameForTournament(
  tournamentId,
  players,
  creatorPlayer,
  gameType
) {
  const playerIds = [
    ...new Set(
      players
        .map((player) => player.database_id)
        .filter((id) => id != null)
        .map((id) => BigInt(id))
    ),
  ];

  const tournament = await prisma.tournaments.findUnique({
    where: { id: tournamentId },
  });

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create game
      const game = await tx.games.create({
        data: {
          tournament_id: tournament.id,
          created_by: creatorPlayer,
          played_by: [...playerIds],
        },
      });

      // Create rounds and sets
      const result = await createRounds(players, game.id, gameType, tx);
      console.log(result);

      // Return success if all operations succeed
      return { success: true, error: null, tournamentId: tournament.id };
    });

    // If everything goes fine, return success
    return result;
  } catch (error) {
    // If any error occurs, the transaction will be rolled back
    console.error("Error creating game for tournament:", error);
    return { success: false, error: error.message, tournamentId: null };
  }
}

// Creates a new tournament
export async function createTournament(players, creatorPlayer, gameType) {
  const playerIds = players
    .map((player) => player.database_id)
    .filter((id) => id != null)
    .map((id) => BigInt(id));

  try {
    // Start a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create tournament
      const tournament = await tx.tournaments.create({
        data: {
          deleted: false,
        },
      });

      // Create game
      const game = await tx.games.create({
        data: {
          tournament_id: tournament.id,
          created_by: creatorPlayer,
          played_by: [...playerIds],
        },
      });

      // Create rounds and sets
      await createRounds(players, game.id, gameType, tx);

      // Return success if all operations succeed
      return { success: true, error: null, tournamentId: tournament.id };
    });

    // If everything goes fine, return success
    return result;
  } catch (error) {
    // If any error occurs, the transaction will be rolled back
    console.error("Error creating tournament:", error);
    return { success: false, error: error.message, tournamentId: null };
  }
}
