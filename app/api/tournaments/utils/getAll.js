import prisma from "@/app/lib/prisma";

export async function getAll(page = 1, perPage = 10) {
  const currentPage = Math.max(page, 1);
  const itemsPerPage = Math.max(perPage, 1);

  // Get total count of tournaments (not deleted)
  const totalCount = await prisma.tournaments.count({
    where: {
      deleted: false,
    },
  });

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const tournaments = await prisma.tournaments.findMany({
    where: {
      deleted: false,
    },
    orderBy: {
      created_at: "desc", // newest first
    },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    select: {
      id: true,
      created_at: true,
      deleted: true,
      games: {
        select: {
          rounds: {
            select: {
              player_1_name: true,
              player_2_name: true,
            },
          },
        },
      },
    },
  });

  const tournaments_hash = {};

  tournaments.forEach((t) => {
    const players = [];
    t.games.forEach((game) =>
      game.rounds.forEach((round) => {
        players.push(round.player_1_name);
        players.push(round.player_2_name);
      })
    );

    if (players.length >= 2) {
      tournaments_hash[t.id] = {
        id: t.id.toString(),
        created_at: t.created_at,
        deleted: t.deleted,
        players: Array.from(new Set(players)),
      };
    }
  });

  return {
    page: currentPage,
    perPage: itemsPerPage,
    totalCount,
    totalPages,
    tournaments: tournaments_hash,
  };
}
