import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/api/utils/json";

export async function GET(req, { params }) {
  try {
    const eloHistory = await prisma.elo_histories.findMany({
      orderBy: [{ id: "desc" }],
      select: {
        round_id: true,
        player_id: true,
        winner_id: true,
        loser_id: true,
        elo: true,
      },
    });

    const playersIds = new Set();
    eloHistory.forEach((history) => {
      playersIds.add(history.player_id);
    });

    const players = await prisma.players.findMany({
      select: { id: true, name: true },
      where: {
        id: {
          in: Array.from(playersIds),
        },
      },
    });

    const playerHash = {};
    players.forEach((player) => {
      playerHash[player.id] = player.name;
    });

    const playersStats = [];

    playersIds.forEach((id) => {
      let win = 0;
      let lose = 0;
      let elo = null;

      eloHistory.forEach((history) => {
        if (history.player_id === id) {
          if (history.winner_id === id) win += 1;
          if (history.loser_id === id) lose += 1;
          if (elo == null) elo = history.elo;
        }
      });

      playersStats.push({
        id: id,
        name: playerHash[id] ?? "Unknown",
        elo: elo,
        win: Number(((win / (win + lose)) * 100).toFixed(1)),
        lose: Number(((lose / (win + lose)) * 100).toFixed(1)),
      });
    });

    playersStats.sort((a, b) => {
      if (b.elo === a.elo) {
        return b.win - a.win;
      }
      return a.elo > b.elo ? -1 : 1;
    });

    return new Response(safeJson(playersStats), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
