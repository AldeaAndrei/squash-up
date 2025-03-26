import {
  getPlayersEloDetails,
  getPlayersIdsForTournament,
} from "@/app/api/utils/players";
import sql from "@/db";
import EloRank from "elo-rank";

export async function calculateEloForTournament(id) {
  const playersIds = await getPlayersIdsForTournament(id);
  const playersElo = await getPlayersEloDetails(playersIds);

  let tournaments = await sql`
          SELECT *, tournaments.id AS tournament_id, games.id AS game_id, rounds.id AS round_id, sets.id AS set_id
          FROM tournaments 
          JOIN games ON games.tournament_id = tournaments.id 
          JOIN rounds ON rounds.game_id = games.id 
          JOIN sets ON sets.round_id = rounds.id 
          WHERE rounds.player_1_id IS NOT NULL 
            AND rounds.player_2_id IS NOT NULL
            AND sets.player_1_score != 0
            AND sets.player_2_score != 0
            AND tournaments.deleted = FALSE
            AND tournaments.id = ${id}
          ORDER BY sets.created_at DESC, sets.id DESC`;

  let tournamentHash = {};
  let resultsByRound = {};

  let tournamentIds = tournaments.map((d) => d.tournament_id).sort();

  tournaments.forEach((d) => {
    if (!tournamentHash[d.tournament_id]) tournamentHash[d.tournament_id] = [];
    if (!resultsByRound[d.round_id]) resultsByRound[d.round_id] = [];

    let winner =
      d.player_1_score > d.player_2_score ? d.player_1_id : d.player_2_id;
    let loser =
      d.player_1_score > d.player_2_score ? d.player_2_id : d.player_1_id;

    tournamentHash[d.tournament_id].push({
      set_id: d.set_id,
      round_id: d.round_id,
      tournament_id: d.tournament_id,
      winner: winner,
      loser: loser,
    });

    resultsByRound[d.round_id].push({ winner: winner, loser: loser });
  });

  Object.keys(resultsByRound).forEach((key) => {
    let winner = mostFrequentNumber(resultsByRound[key].map((r) => r.winner));
    let loser = mostFrequentNumber(resultsByRound[key].map((r) => r.loser));

    resultsByRound[key] = { winner: winner, loser: loser };
  });

  let playersEloHash = {};

  playersElo.forEach((data) => {
    playersEloHash[data.id] = data.elo;
  });

  let elo = new EloRank(32);

  tournamentIds.filter(onlyUnique).forEach((id) => {
    let roundsIds = tournamentHash[id]
      .map((r) => r.round_id)
      .filter(onlyUnique);

    let eloChanges = {};

    console.log(roundsIds);

    roundsIds.forEach((round_id) => {
      let winnerId = resultsByRound[round_id].winner;
      let loserId = resultsByRound[round_id].loser;

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

      eloChanges[winnerId].push(winner);
      eloChanges[loserId].push(loser);
    });

    Object.keys(eloChanges).forEach((playerId) => {
      playersEloHash[playerId] =
        eloChanges[playerId].reduce((a, b) => a + b) /
        eloChanges[playerId].length;
    });
  });

  let finalData = [];

  playersElo.forEach((d) => {
    finalData.push({
      name: d.name,
      elo: Math.round(playersEloHash[d.id]),
    });
  });

  return finalData.sort((a, b) => b.elo - a.elo);
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
