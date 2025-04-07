import { calculateEloForTournament } from "@/app/api/utils/elo";
import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/api/utils/json";
import { ELO_FACTOR, START_ELO } from "@/constants";
import EloRank from "elo-rank";
import { NextResponse } from "next/server";

async function deleteAllHistories() {
  await prisma.elo_histories.deleteMany({});
  console.log(`Delete all histories`);
}

async function resetAllRounds() {
  await prisma.rounds.updateMany({
    data: {
      used_for_elo: false,
    },
  });
  console.log(`Set all rounds as unused`);
}

async function resetAllPlayersElo() {
  await prisma.players.updateMany({
    data: {
      elo: START_ELO,
    },
  });
  console.log(`Set all players ELO to ${START_ELO}`);
}

export async function GET() {
  try {
    console.log("Recalculate ELO");

    // Reset DB
    await deleteAllHistories();
    await resetAllRounds();
    await resetAllPlayersElo();

    const eloRank = new EloRank(ELO_FACTOR);

    let currentElo = null;
    let eloHistories = [];
    let eloChangeData = [];
    let playersIdsHash = {};

    // Fetch all tournaments
    const tournaments = await prisma.tournaments.findMany({
      select: { id: true },
      where: { deleted: false },
    });

    // Calculate ELO for each tournament
    for (const tournament of tournaments) {
      const result = await calculateEloForTournament(
        tournament.id,
        currentElo,
        eloRank
      );

      currentElo = { ...result.updatedElo };
      eloHistories.push(result.eloHistories);
    }

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
