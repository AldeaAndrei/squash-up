import { validateId } from "@/app/api/utils/validations";
import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/api/utils/json";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const idValidation = validateId(id);

    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    const eloHistory = await prisma.elo_histories.findMany({
      where: { player_id: id },
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
