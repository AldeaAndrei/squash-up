import prisma from "@/app/lib/prisma";
import EloRank from "elo-rank";
import { ELO_FACTOR, START_ELO } from "@/constants";

export function calculateEloForRound(round, currentElo, eloRank = null) {
  if (round.used_for_elo) {
    return null;
  }

  if (eloRank == null) eloRank = new EloRank(ELO_FACTOR);

  // get the winner and loser
  const player1Key = `${round.player_1_id}-${round.player_1_name}`;
  const player2Key = `${round.player_2_id}-${round.player_2_name}`;

  let player1Wins = 0;
  let player2Wins = 0;

  round.sets.forEach((set) => {
    if (set.player_1_score > set.player_2_score) player1Wins += 1;
    if (set.player_2_score > set.player_1_score) player2Wins += 1;
  });

  // no player won the majority of the sets
  if (
    player1Wins < round.sets.length / 2.0 &&
    player2Wins < round.sets.length / 2.0
  )
    return null;

  let winnerKey = null;
  let loserKey = null;

  // calculate winner
  if (player1Wins > player2Wins) {
    winnerKey = player1Key;
    loserKey = player2Key;
  }
  if (player1Wins < player2Wins) {
    winnerKey = player2Key;
    loserKey = player1Key;
  }

  // calculate elo
  const winnerElo = currentElo[winnerKey] || START_ELO;
  const loserElo = currentElo[loserKey] || START_ELO;

  const expectedScoreWinner = eloRank.getExpected(winnerElo, loserElo);
  const expectedScoreLoser = eloRank.getExpected(loserElo, winnerElo);

  //update score, 1 if won 0 if lost
  const newWinnerElo = eloRank.updateRating(expectedScoreWinner, 1, winnerElo);
  const newLoserElo = eloRank.updateRating(expectedScoreLoser, 0, loserElo);

  let updatedElo = {
    ...currentElo,
  };

  updatedElo[winnerKey] = newWinnerElo;
  updatedElo[loserKey] = newLoserElo;

  let eloHistories = [];

  if (round.player_1_id != null) {
    eloHistories.push({
      player_id: round.player_1_id,
      round_id: round.id,
      elo: updatedElo[player1Key],
      winner_id:
        player1Key === winnerKey ? round.player_1_id : round.player_2_id,
      loser_id: player1Key === loserKey ? round.player_1_id : round.player_2_id,
    });
  }

  if (round.player_2_id != null) {
    eloHistories.push({
      player_id: round.player_2_id,
      round_id: round.id,
      elo: updatedElo[player2Key],
      winner_id:
        player1Key === winnerKey ? round.player_1_id : round.player_2_id,
      loser_id: player1Key === loserKey ? round.player_1_id : round.player_2_id,
    });
  }

  return {
    updatedElo: updatedElo,
    eloHistories: eloHistories,
  };
}

export async function calculateEloForTournament(
  tournamentId,
  startingElo,
  eloRank = null
) {
  if (eloRank == null) eloRank = new EloRank(ELO_FACTOR);

  // save current elo from starting elo, if null -> 1600 for all
  let currentElo = {};

  if (startingElo == null) {
    // load all players
    const players = await prisma.players.findMany({
      select: { id: true, elo: true, name: true },
    });

    // convert to hash
    players.forEach((player) => {
      const playerKey = `${player.id}-${player.name}`;
      currentElo[playerKey] = player.elo;
    });
  } else {
    // create a copy of starting ELO
    currentElo = { ...startingElo };
  }

  // load all rounds
  const rounds = await prisma.rounds.findMany({
    where: {
      games: {
        tournament_id: BigInt(tournamentId),
      },
    },
    orderBy: { id: "asc" },
    include: {
      sets: true,
    },
  });

  let eloHistories = [];

  // recalculate current elo
  for (const round of rounds) {
    const result = calculateEloForRound(round, currentElo);
    if (result == null) continue;

    currentElo = { ...result.updatedElo };
    eloHistories.push(result.eloHistories);
  }

  // return the final elo
  return {
    updatedElo: currentElo,
    eloHistories: eloHistories.flat(),
  };
}
