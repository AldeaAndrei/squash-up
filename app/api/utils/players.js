import prisma from "@/app/lib/prisma";

export async function getPlayersIdsForTournament(tournamentId) {
  const rounds = await prisma.rounds.findMany({
    where: {
      games: {
        tournament_id: BigInt(tournamentId),
      },
      NOT: [{ player_1_id: null }, { player_2_id: null }],
    },
    select: {
      player_1_id: true,
      player_2_id: true,
    },
  });

  const uniqIds = new Set();

  rounds.forEach(({ player_1_id, player_2_id }) => {
    uniqIds.add(player_1_id);
    uniqIds.add(player_2_id);
  });

  return [...uniqIds];
}

export async function getPlayersIdsForRound(roundId) {
  const round = await prisma.rounds.findUnique({
    where: {
      id: BigInt(roundId),
    },
    select: {
      player_1_id: true,
      player_2_id: true,
    },
  });

  if (!round) return [];

  return [round.player_1_id, round.player_2_id].filter(Boolean);
}

export async function getPlayersEloDetails(playersIds) {
  if (!Array.isArray(playersIds) || playersIds.length === 0) {
    return null;
  }

  const players = await prisma.players.findMany({
    where: {
      id: {
        in: playersIds.map((id) => BigInt(id)),
      },
    },
    select: {
      id: true,
      name: true,
      elo: true,
      elo_histories: {
        orderBy: {
          id: "desc",
        },
        take: 1,
        select: {
          elo: true,
        },
      },
    },
  });

  return players.map((player) => ({
    id: player.id,
    name: player.name,
    elo:
      player.elo_histories.length > 0
        ? Number(player.elo_histories[0].elo)
        : Number(player.elo),
  }));
}
