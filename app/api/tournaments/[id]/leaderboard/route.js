import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const roundsData = await prisma.rounds.findMany({
      where: {
        games: {
          tournament_id: BigInt(id),
        },
      },
      select: {
        player_1_name: true,
        player_2_name: true,
        game_id: true,
        sets: true,
      },
    });

    let players = {};
    let wins = {};

    roundsData.forEach((round) => {
      let winsPlayer1 = 0;
      let winsPlayer2 = 0;

      let totalPlayer1 = 0;
      let totalPlayer2 = 0;

      round.sets.forEach((set) => {
        totalPlayer1 += set.player_1_score;
        totalPlayer2 += set.player_2_score;

        if (set.player_1_score > set.player_2_score) winsPlayer1 += 1;
        else if (set.player_2_score > set.player_1_score) winsPlayer2 += 1;
      });

      winsPlayer1 = winsPlayer1 > round.sets.length / 2.0 ? 1 : 0;
      winsPlayer2 = winsPlayer2 > round.sets.length / 2.0 ? 1 : 0;

      if (winsPlayer1 > winsPlayer2) {
        if (!wins[round.player_1_name])
          wins[round.player_1_name] = [round.player_2_name];
        else wins[round.player_1_name].push(round.player_2_name);
      }
      if (winsPlayer2 > winsPlayer1) {
        if (!wins[round.player_2_name])
          wins[round.player_2_name] = [round.player_1_name];
        else wins[round.player_2_name].push(round.player_1_name);
      }

      if (!players[round.player_1_name]) {
        players[round.player_1_name] = {
          name: round.player_1_name,
          total: totalPlayer1,
          rounds: winsPlayer1,
        };
      } else {
        players[round.player_1_name].total += totalPlayer1;
        players[round.player_1_name].rounds += winsPlayer1;
      }

      if (!players[round.player_2_name]) {
        players[round.player_2_name] = {
          name: round.player_2_name,
          total: totalPlayer2,
          rounds: winsPlayer2,
        };
      } else {
        players[round.player_2_name].total += totalPlayer2;
        players[round.player_2_name].rounds += winsPlayer2;
      }
    });

    let leaderboard = Object.values(players).map((player) => {
      return { ...player };
    });

    leaderboard.sort((a, b) => {
      if (a.rounds !== b.rounds) return b.rounds - a.rounds;
      else if (a.total !== b.total) return b.total - a.total;

      const aWin = wins[a.name]?.includes(b.name) ? 1 : 0;
      const bWin = wins[b.name]?.includes(a.name) ? 1 : 0;

      return bWin - aWin;
    });

    return NextResponse.json({ leaderboard }, { status: 200 });
  } catch (error) {
    console.error("Leaderboard generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
