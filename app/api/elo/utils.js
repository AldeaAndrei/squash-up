import {
  getPlayersEloDetails,
  getPlayersIdsForRound,
} from "@/app/api/utils/players";
import prisma from "@/app/lib/prisma";
import sql from "@/db";
import EloRank from "elo-rank";

export async function calculateEloForRound(id) {
  const playersIds = await getPlayersIdsForRound(id);
  const playersElo = await getPlayersEloDetails(playersIds);

  let rounds = await sql`
          SELECT *, rounds.id AS round_id, sets.id AS set_id
          FROM rounds 
          JOIN sets ON sets.round_id = rounds.id 
          WHERE rounds.id = ${id}`;

  let playersDetails = {};

  let playersEloHash = {};

  playersElo.forEach((data) => {
    playersEloHash[data.id] = data.elo;
  });

  let finalData = [];

  playersIds.forEach((id) => {
    if (!playersEloHash[id] || id == null) playersEloHash[-1] = 1600;
  });

  if (rounds.length === 0) {
    playersElo.forEach((d) => {
      finalData.push({
        id: d.id,
        name: d.name,
        elo_change: 0,
        elo: Math.round(d.elo) || 0,
      });
    });

    return finalData.sort((a, b) => b.elo - a.elo);
  }

  let resultsByRound = {};

  rounds.forEach((d) => {
    if (!resultsByRound[d.round_id]) resultsByRound[d.round_id] = [];

    if (d.player_1_score !== 0 || d.player_2_score !== 0) {
      let winner =
        d.player_1_score > d.player_2_score ? d.player_1_id : d.player_2_id;
      let loser =
        d.player_1_score > d.player_2_score ? d.player_2_id : d.player_1_id;

      resultsByRound[d.round_id].push({ winner: winner, loser: loser });
    }
  });

  if (resultsByRound[id].length === 0) {
    return finalData.sort((a, b) => b.elo - a.elo);
  }

  Object.keys(resultsByRound).forEach((key) => {
    let winner =
      mostFrequentNumber(resultsByRound[key].map((r) => r.winner)) || -1;
    let loser =
      mostFrequentNumber(resultsByRound[key].map((r) => r.loser)) || -1;

    resultsByRound[key] = { winner: winner, loser: loser };
  });

  let elo = new EloRank(32);

  let eloChanges = {};

  let winnerId = resultsByRound[id].winner;
  let loserId = resultsByRound[id].loser;

  if (!eloChanges[winnerId]) eloChanges[winnerId] = [];
  if (!eloChanges[loserId]) eloChanges[loserId] = [];

  let winner = playersEloHash[winnerId];
  let loser = playersEloHash[loserId];

  //Gets expected score for first parameter
  let expectedScoreA = elo.getExpected(winner, loser);
  let expectedScoreB = elo.getExpected(loser, winner);

  //update score, 1 if won 0 if lost
  winner = elo.updateRating(expectedScoreA, 1, winner);
  loser = elo.updateRating(expectedScoreB, 0, loser);

  eloChanges[winnerId] = winner - playersEloHash[winnerId] || 0;
  eloChanges[loserId] = loser - playersEloHash[loserId];

  playersElo.forEach((d) => {
    finalData.push({
      id: d.id,
      name: d.name,
      elo_change: Math.round(eloChanges[d.id]) || 0,
      elo: Math.round(playersEloHash[d.id] + eloChanges[d.id]),
    });
  });

  rounds.forEach((round) => {
    const key1 = `${round.player_1_id}-${round.player_1_name}`;
    const key2 = `${round.player_2_id}-${round.player_2_name}`;

    playersDetails[key1] = {
      id: round.player_1_id,
      name: round.player_1_name,
      elo_change: Math.round(eloChanges[round.player_1_id ?? -1]) || 0,
      elo: Math.round(
        playersEloHash[round.player_1_id ?? -1] +
          eloChanges[round.player_1_id ?? -1]
      ),
    };

    playersDetails[key2] = {
      id: round.player_2_id,
      name: round.player_2_name,
      elo_change: Math.round(eloChanges[round.player_2_id ?? -1]) || 0,
      elo: Math.round(
        playersEloHash[round.player_2_id ?? -1] +
          eloChanges[round.player_2_id ?? -1]
      ),
    };
  });

  return Object.values(playersDetails);
}

export async function updateEloForRound(roundId) {
  const round = await prisma.rounds.findUnique({
    where: {
      id: BigInt(roundId), // Ensure you are passing the roundId as BigInt
    },
    select: {
      used_for_elo: true,
    },
  });

  if (!round) {
    return {
      updatedPlayersRows: null,
      updatedRoundsRows: null,
      errors: "Round not found",
    };
  }

  const already_used = round.used_for_elo;

  if (already_used) {
    return {
      updatedPlayersRows: null,
      updatedRoundsRows: null,
      errors: "Already used",
    };
  }

  const elo = await calculateEloForRound(roundId);

  if (elo.length === 0) {
    return {
      updatedPlayersRows: null,
      updatedRoundsRows: null,
      errors: "No updates",
    };
  }
  const updatedPlayers = await Promise.all(
    elo.map(async ({ id, elo }) => {
      return prisma.players.update({
        where: { id: BigInt(id) },
        data: { elo },
        select: { id: true, elo: true },
      });
    })
  );

  const updatedRound = await prisma.rounds.update({
    where: { id: BigInt(roundId) },
    data: { used_for_elo: true },
    select: { id: true, used_for_elo: true },
  });

  const eloHistories = elo.map(({ id, elo }) => ({
    player_id: BigInt(id),
    round_id: BigInt(roundId),
    elo,
  }));

  const createdEloHistories = await prisma.elo_histories.createMany({
    data: eloHistories,
  });

  return {
    updatedPlayersRows: updatedPlayers,
    updatedRoundsRows: updatedRound,
    errors: null,
  };
}

function mostFrequentNumber(arr) {
  let frequency = {};
  let maxCount = 0;
  let mostFrequent = null;

  for (let num of arr) {
    frequency[num] = (frequency[num] || 0) + 1;
    if (frequency[num] > maxCount) {
      maxCount = frequency[num];
      mostFrequent = num;
    }
  }

  return mostFrequent;
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
