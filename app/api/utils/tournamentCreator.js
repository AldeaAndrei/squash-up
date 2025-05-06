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
  if (count === 8)
    return [
      [0, 1],
      [2, 3],
      [4, 5],
      [6, 7],
      [0, 2],
      [1, 3],
      [4, 6],
      [5, 7],
      [0, 3],
      [1, 2],
      [4, 7],
      [5, 6],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
      [0, 5],
      [1, 4],
      [2, 7],
      [3, 6],
      [1, 7],
      [0, 6],
      [2, 4],
      [3, 5],
      [0, 7],
      [1, 6],
      [2, 5],
      [3, 4],
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

function createRounds(gamePlayers) {
  let players = [...gamePlayers];

  let roundsData = [];
  let pairs = {};

  const generateRoundForPair = (player1, player2, pairKey, reversePairKey) => {
    const round = {
      player_1_name: player1.name,
      player_2_name: player2.name,
      player_1_id: player1.database_id ? BigInt(player1.database_id) : null,
      player_2_id: player2.database_id ? BigInt(player2.database_id) : null,
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

  return roundsData;
}

export async function createGameForTournament(
  tournamentId,
  players,
  creatorPlayer,
  gameType
) {
  const playerIds = [
    ...new Set(
      players
        .map((p) => p.database_id)
        .filter((id) => id != null)
        .map((id) => BigInt(id))
    ),
  ];

  const rounds = createRounds(players);

  try {
    const game = await prisma.games.create({
      data: {
        tournaments: { connect: { id: BigInt(tournamentId) } },
        created_by: creatorPlayer != null ? BigInt(creatorPlayer) : null,
        played_by: playerIds,
        rounds: {
          create: rounds.map((r) => ({
            player_1_name: r.player_1_name,
            player_2_name: r.player_2_name,
            player_1_id: r.player_1_id ?? null,
            player_2_id: r.player_2_id ?? null,
            sets: {
              create: Array.from({ length: gameType }, () => ({
                player_1_score: 0,
                player_2_score: 0,
              })),
            },
          })),
        },
      },
    });

    return { success: true, error: null, tournamentId };
  } catch (error) {
    console.error("Error creating game for tournament:", error);
    return { success: false, error: error.message, tournamentId: null };
  }
}

export async function createTournament(players, creatorPlayer, gameType) {
  const playerIds = [
    ...new Set(
      players
        .map((p) => p.database_id)
        .filter((id) => id != null)
        .map((id) => BigInt(id))
    ),
  ];

  const rounds = createRounds(players);

  try {
    const tournament = await prisma.tournaments.create({
      data: {
        deleted: false,
        games: {
          create: {
            created_by: creatorPlayer != null ? BigInt(creatorPlayer) : null,
            played_by: playerIds,
            rounds: {
              create: rounds.map((r) => ({
                player_1_name: r.player_1_name,
                player_2_name: r.player_2_name,
                player_1_id: r.player_1_id ?? null,
                player_2_id: r.player_2_id ?? null,
                sets: {
                  create: Array.from({ length: gameType }, () => ({
                    player_1_score: 0,
                    player_2_score: 0,
                  })),
                },
              })),
            },
          },
        },
      },
    });

    return { success: true, error: null, tournamentId: tournament.id };
  } catch (error) {
    console.error("Error creating tournament:", error);
    return { success: false, error: error.message, tournamentId: null };
  }
}
