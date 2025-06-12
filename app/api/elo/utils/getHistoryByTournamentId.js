import prisma from "@/app/lib/prisma";

export default async function getHistoryByTournamentId(id) {
  const rounds = await prisma.rounds.findMany({
    where: {
      games: {
        tournament_id: id,
      },
    },
    select: {
      id: true,
    },
  });

  const roundIds = rounds.map((round) => round.id);

  const eloHistory = await prisma.elo_histories.findMany({
    where: {
      round_id: {
        in: roundIds,
      },
    },
    orderBy: [{ id: "desc" }],
    select: {
      round_id: true,
      player_id: true,
      elo: true,
    },
  });

  return eloHistory;
}
