import prisma from "@/app/lib/prisma";

export async function getAll() {
  const tournaments = await prisma.tournaments.findMany({
    where: {
      deleted: false,
    },
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

  let tournaments_hash = {};

  tournaments.forEach((t) => {
    let players = [];
    t.games.forEach((game) =>
      game.rounds.forEach((round) => {
        players.push(round.player_1_name);
        players.push(round.player_2_name);
      })
    );

    // if (players.length > 2) {
      tournaments_hash[t.id] = {
        id: t.id.toString(),
        created_at: t.created_at,
        deleted: t.deleted,
        players: Array.from(new Set([...players])),
      };
    // }
  });

  return tournaments_hash;
}
