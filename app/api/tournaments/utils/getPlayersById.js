import prisma from "@/app/lib/prisma";

export default async function getPlayersById(id) {
  const roundsData = await prisma.rounds.findMany({
    where: {
      games: {
        tournament_id: BigInt(id),
      },
    },
    select: {
      player_1_id: true,
      player_2_id: true,
      game_id: true,
      sets: true,
    },
  });

  const playersIds = new Set(
    roundsData
      .map((round) => [round.player_1_id, round.player_2_id])
      .flat()
      .filter((id) => id !== null)
  );

  const playersData = await prisma.players.findMany({
    where: {
      id: {
        in: Array.from(playersIds),
      },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const players = playersData.map((player) => {
    return { ...player, id: player.id.toString() };
  });

  return players;
}
