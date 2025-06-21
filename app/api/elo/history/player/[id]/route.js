import { validateId } from "@/app/api/utils/validations";
import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/api/utils/json";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const searchParams = req.nextUrl.searchParams;
    const limit = searchParams.get("limit");

    const parsedLimit = Number.isNaN(parseInt(limit, 10))
      ? 1
      : parseInt(limit, 10);

    const idValidation = validateId(id);

    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    const recentTournaments = await prisma.tournaments.findMany({
      where: { deleted: false },
      orderBy: { id: "desc" },
      take: parsedLimit,
      select: { id: true },
    });

    const tournamentIds = recentTournaments.map((t) => t.id);

    const gamesInTournaments = await prisma.games.findMany({
      where: { tournament_id: { in: tournamentIds } },
      select: { id: true },
    });

    const gameIds = gamesInTournaments.map((g) => g.id);

    const roundsInGames = await prisma.rounds.findMany({
      where: { game_id: { in: gameIds } },
      select: { id: true },
    });

    const roundIds = roundsInGames.map((r) => r.id);

    const eloHistory = await prisma.elo_histories.findMany({
      where: { player_id: id, round_id: { in: roundIds } },
      orderBy: [{ round_id: "desc" }, { id: "desc" }],
      select: {
        round_id: true,
        player_id: true,
        winner_id: true,
        loser_id: true,
        elo: true,
      },
    });

    let ids = new Set();

    eloHistory.map((history) => {
      ids.add(history.winner_id);
      ids.add(history.loser_id);
    });

    const players = await prisma.players.findMany({
      select: { id: true, name: true },
      where: {
        id: {
          in: Array.from(ids),
        },
      },
    });

    const playerHash = {};
    players.forEach((player) => {
      playerHash[player.id] = player.name;
    });

    let historyResponse = [];

    eloHistory.forEach((history) => {
      historyResponse.push({
        round_id: history.round_id,
        opponent:
          history.winner_id === history.player_id
            ? playerHash[history.loser_id]
            : playerHash[history.winner_id],
        elo: history.elo,
        won: history.winner_id == id,
      });
    });

    return new Response(safeJson(historyResponse), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
