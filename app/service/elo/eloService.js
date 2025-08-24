import prisma from "@/app/lib/prisma";

export async function index({ page = 1, perPage = 10, playerId = null } = {}) {
  const skip = (page - 1) * perPage;
  const take = perPage;

  const where = playerId ? { player_id: playerId } : {};

  const [records, total] = await Promise.all([
    prisma.elo_histories.findMany({
      skip,
      take,
      where,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        winner_id: true,
        loser_id: true,
        elo: true,
        created_at: true,
      },
    }),
    prisma.elo_histories.count({ where }),
  ]);

  if (records.length === 0) {
    return {
      data: [],
      pagination: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    };
  }

  const playerIds = Array.from(
    new Set(records.flatMap((r) => [r.winner_id, r.loser_id].filter(Boolean)))
  );

  const players = await prisma.players.findMany({
    where: { id: { in: playerIds } },
    select: { id: true, name: true },
  });

  const playerMap = new Map(players.map((p) => [p.id.toString(), p.name]));

  const data = records.map((r) => {
    let opponent = null;

    if (playerId != null) {
      const winnerId = r.winner_id?.toString();
      const loserId = r.loser_id?.toString();
      const playerIdStr = playerId.toString();

      if (winnerId === playerIdStr) {
        opponent = playerMap.get(loserId) || null;
      } else if (loserId === playerIdStr) {
        opponent = playerMap.get(winnerId) || null;
      }
    }

    return {
      id: r.id.toString(),
      winner_id: r.winner_id?.toString(),
      loser_id: r.loser_id?.toString(),
      elo: r.elo?.toString(),
      created_at: r.created_at,
      opponent,
    };
  });

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
