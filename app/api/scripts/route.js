import sql from "@/db";
import EloRank from "elo-rank";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let task = searchParams.get("task");

  if (task.startsWith('"') && task.endsWith('"')) {
    task = task.slice(1, -1);
  }

  try {
    console.clear();
    console.log(`Execute task ${task.toString()}`);

    if (task === "calculate-elo") {
      let playersElo = await sql`SELECT id, elo, name FROM players`;

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
          ORDER BY sets.created_at DESC, sets.id DESC`;

      console.group();
      console.log(`Found ${playersElo.length} players`);
      console.log(`Found ${tournaments.length} sets`);
      console.groupEnd();

      let tournamentHash = {};
      let tournamentIds = tournaments.map((d) => d.tournament_id).sort();

      let resultsByRound = {};

      tournaments.forEach((d) => {
        if (!tournamentHash[d.tournament_id])
          tournamentHash[d.tournament_id] = [];

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
        let winner = mostFrequentNumber(
          resultsByRound[key].map((r) => r.winner)
        );
        let loser = mostFrequentNumber(resultsByRound[key].map((r) => r.loser));

        resultsByRound[key] = { winner: winner, loser: loser, delta: 0 };
      });

      let playersEloHash = {};
      // let playersEloHistory = {};

      playersElo.forEach((data) => {
        playersEloHash[data.id] = data.elo;

        // if (playersEloHistory[data.id])
        //   playersEloHistory[data.id].push(data.elo);
        // else playersEloHistory[data.id] = [data.elo];
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

          // playersEloHash[winnerId] = winner;
          // playersEloHash[loserId] = loser;
        });

        Object.keys(eloChanges).forEach((playerId) => {
          playersEloHash[playerId] =
            eloChanges[playerId].reduce((a, b) => a + b) /
            eloChanges[playerId].length;
        });

        console.log(JSON.stringify(eloChanges));
        console.log(JSON.stringify(playersEloHash));
      });

      // tournamentIds.forEach((id) => {
      //     let winner = playersEloHash[round.winner];
      //     let loser = playersEloHash[round.loser];

      //     //Gets expected score for first parameter
      //     let expectedScoreA = elo.getExpected(winner, loser);
      //     let expectedScoreB = elo.getExpected(loser, winner);

      //     //update score, 1 if won 0 if lost
      //     winner = elo.updateRating(expectedScoreA, 1, winner);
      //     loser = elo.updateRating(expectedScoreB, 0, loser);

      //     playersEloHash[round.winner] = winner;
      //     playersEloHash[round.loser] = loser;

      //     playersEloHistory[round.winner].push(winner);
      //     playersEloHistory[round.loser].push(loser);
      //   });

      // tournaments.forEach((d) => {});

      // let rounds = new Map();

      // data.forEach((g) => {
      //   if (rounds[g.round_id] == null)
      //     rounds[g.round_id] = [
      //       {
      //         player_1_id: g.player_1_id,
      //         player_2_id: g.player_2_id,
      //         player_1_score: g.player_1_score,
      //         player_2_score: g.player_2_score,
      //         created_at: g.created_at,
      //         id: g.id,
      //       },
      //     ];
      //   else
      //     rounds[g.round_id].push({
      //       player_1_id: g.player_1_id,
      //       player_2_id: g.player_2_id,
      //       player_1_score: g.player_1_score,
      //       player_2_score: g.player_2_score,
      //       created_at: g.created_at,
      //       id: g.id,
      //     });
      // });

      // let roundsWinners = [];

      // Object.keys(rounds).forEach((key) => {
      //   let p1Wins = 0;
      //   let p2Wins = 0;

      //   rounds[key].forEach((set) => {
      //     if (set.player_1_score > set.player_2_score) p1Wins += 1;
      //     if (set.player_2_score > set.player_1_score) p2Wins += 1;
      //   });

      //   roundsWinners.push({
      //     id: key,
      //     winner:
      //       p1Wins > p2Wins
      //         ? rounds[key][0].player_1_id
      //         : rounds[key][0].player_2_id,
      //     loser:
      //       p1Wins > p2Wins
      //         ? rounds[key][0].player_2_id
      //         : rounds[key][0].player_1_id,
      //   });
      // });

      // roundsWinners
      //   .sort((a, b) => a.id - b.id)
      //   .forEach((round) => {
      //     let winner = playersEloHash[round.winner];
      //     let loser = playersEloHash[round.loser];

      //     //Gets expected score for first parameter
      //     let expectedScoreA = elo.getExpected(winner, loser);
      //     let expectedScoreB = elo.getExpected(loser, winner);

      //     //update score, 1 if won 0 if lost
      //     winner = elo.updateRating(expectedScoreA, 1, winner);
      //     loser = elo.updateRating(expectedScoreB, 0, loser);

      //     playersEloHash[round.winner] = winner;
      //     playersEloHash[round.loser] = loser;

      //     playersEloHistory[round.winner].push(winner);
      //     playersEloHistory[round.loser].push(loser);
      //   });

      let finalData = [];

      playersElo.forEach((d) => {
        finalData.push({
          id: d.id,
          name: d.name,
          elo: Math.round(playersEloHash[d.id]),
        });
      });

      const values = finalData
        .map(({ id, elo }) => `(${id}, ${elo})`)
        .join(", ");

      const query = `
          UPDATE players AS p
          SET
            elo = v.elo
          FROM (VALUES ${values}) AS v(id, elo)
          WHERE p.id = v.id
        RETURNING p.id;
      `;

      const updatedRows = await sql.unsafe(query);

      // finalData = finalData.sort((a, b) => b.elo - a.elo);

      return new Response(
        JSON.stringify({ updatedPlayers: updatedRows }, { status: 200 })
      );
    } else {
      return new Response(
        JSON.stringify(
          { message: `No task with the name '${task}' was found` },
          { status: 404 }
        )
      );
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
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
