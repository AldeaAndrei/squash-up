import prisma from "@/app/lib/prisma";

export async function getById(id) {
  const tournament = await prisma.tournaments.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      games: {
        include: {
          rounds: {
            orderBy: { id: "asc" },
            include: {
              sets: true,
            },
          },
        },
      },
    },
  });

  if (tournament) {
    tournament.games.sort((a, b) => Number(a.id) - Number(b.id));
    tournament.games.forEach((game) => {
      game.rounds.sort((a, b) => Number(a.id) - Number(b.id));
      game.rounds.forEach((round) => {
        round.sets.sort((a, b) => Number(a.id) - Number(b.id));
      });
    });
  }

  return tournament;
}
