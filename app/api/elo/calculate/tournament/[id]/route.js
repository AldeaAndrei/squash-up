import { calculateEloForTournament } from "@/app/api/utils/elo";
import { validateId } from "@/app/api/utils/validations";
import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/api/utils/json";
import { ELO_FACTOR } from "@/constants";
import EloRank from "elo-rank";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const idValidation = validateId(id);

    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    // Fetch tournament
    const tournament = await prisma.tournaments.findUnique({
      select: { id: true, deleted: true },
      where: { id: id },
    });

    if (!tournament) {
      return NextResponse.json(
        { error: "Tournament does not exist" },
        { status: 404 }
      );
    }

    if (tournament.deleted === true) {
      return NextResponse.json(
        { error: "Tournament is deleted" },
        { status: 400 }
      );
    }

    const eloRank = new EloRank(ELO_FACTOR);

    let currentElo = null;
    let eloHistories = [];
    let eloChangeData = [];
    let playersIdsHash = {};

    // Calculate ELO for this tournament
    const result = await calculateEloForTournament(
      tournament.id,
      currentElo,
      eloRank
    );

    currentElo = { ...result.updatedElo };
    eloHistories = result.eloHistories;

    // Convert array of arrays into a 1D arr
    eloHistories = eloHistories.flat();

    const players = await prisma.players.findMany({
      select: { id: true, name: true },
    });

    // Update players ELO to the latest
    players.forEach((player) => {
      const playerKey = `${player.id}-${player.name}`;
      playersIdsHash[playerKey] = player.id;
    });

    for (const playerKey of Object.keys(currentElo)) {
      eloChangeData.push({
        id: playersIdsHash[playerKey],
        elo: currentElo[playerKey],
      });
    }

    await Promise.all(
      eloChangeData.map(({ id, elo }) =>
        prisma.players.update({
          where: { id: BigInt(id) },
          data: { elo },
        })
      )
    );

    // Insert all ELO histories
    await prisma.elo_histories.createMany({
      data: eloHistories.map((entry) => ({
        player_id: BigInt(entry.player_id),
        round_id: BigInt(entry.round_id),
        elo: entry.elo,
        winner_id: BigInt(entry.winner_id),
        loser_id: BigInt(entry.loser_id),
      })),
      skipDuplicates: true,
    });

    return new NextResponse(safeJson({ eloChangeData }, { status: 200 }));
  } catch (err) {
    console.error(err);
    return new NextResponse(safeJson({ error: err.message }), {
      status: 500,
    });
  }
}
