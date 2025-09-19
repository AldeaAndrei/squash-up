import prisma from "@/app/lib/prisma";

function bigintToString(obj) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "bigint") {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(bigintToString);
  }

  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, bigintToString(value)])
    );
  }

  return obj;
}

export async function show(id) {
  const tournamentId = BigInt(id);

  const tournament = await prisma.tournaments.findUnique({
    where: { id: tournamentId },
    select: {
      id: true,
      created_at: true,
      deleted: true,
      games: {
        select: {
          id: true,
          created_at: true,
          played_by: false, // Ignore
          rounds: {
            select: {
              id: true,
              player_1_id: true,
              player_2_id: true,
              player_1_name: true,
              player_2_name: true,
              used_for_elo: true,
              sets: {
                select: {
                  id: true,
                  player_1_score: true,
                  player_2_score: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!tournament) return null;

  const playerMap = new Map();

  tournament.games.forEach((game) => {
    game.rounds.forEach((round) => {
      if (round.player_1_id && round.player_1_name) {
        playerMap.set(round.player_1_id.toString(), {
          id: round.player_1_id.toString(),
          name: round.player_1_name,
        });
      }
      if (round.player_2_id && round.player_2_name) {
        playerMap.set(round.player_2_id.toString(), {
          id: round.player_2_id.toString(),
          name: round.player_2_name,
        });
      }
    });
  });

  const players = Array.from(playerMap.values());

  return {
    data: {
      ...bigintToString(tournament),
      players,
    },
  };
}

export async function index({ page = 1, perPage = 10 } = {}) {
  const skip = (page - 1) * perPage;
  const take = perPage;

  const [records, total] = await Promise.all([
    prisma.tournaments.findMany({
      skip,
      take,
      where: { deleted: false },
      orderBy: { created_at: "desc" },
      select: { id: true, created_at: true },
    }),
    prisma.tournaments.count({
      where: { deleted: false },
    }),
  ]);

  // Convert BigInt IDs to strings for JSON serialization
  const data = records.map((r) => ({
    id: r.id.toString(),
    created_at: r.created_at,
  }));

  return {
    data,
    pagination: {
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    },
  };
}

export function create() {}

export function remove() {}
