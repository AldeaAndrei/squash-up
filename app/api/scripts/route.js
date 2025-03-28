import sql from "@/db";
import { updateEloForRound } from "../elo/utils";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      const queryRounds = `
        UPDATE rounds AS r
        SET
          used_for_elo = FALSE
        RETURNING r.id, r.used_for_elo;
      `;

      const queryPlayers = `
          UPDATE players AS p
          SET
            elo = 1600
        RETURNING p.id, p.elo;
      `;

      console.log(`Set all rounds as unused`);
      const updatedPlayersRows = await sql.unsafe(queryPlayers);
      await sleep(1000);

      console.log(`Set all players ELO to 1600`);
      const updatedRoundsRows = await sql.unsafe(queryRounds);
      await sleep(1000);

      const rounds = await sql`
        SELECT rounds.id 
        FROM rounds 
        JOIN games ON rounds.game_id = games.id 
        JOIN tournaments ON games.tournament_id = tournaments.id
        WHERE tournaments.deleted = FALSE
        ORDER BY rounds.id`;

      console.group();
      for (const round of rounds) {
        console.log(`Update ELO for round ${round.id}`);
        const results = await updateEloForRound(round.id);
        console.log(`Update ELO for round ${round.id} results:`);
        console.group();
        console.log(results);
        console.groupEnd();
      }
      console.groupEnd();

      const elo =
        await sql`SELECT id, name, elo FROM players ORDER BY elo DESC`;

      return new Response(JSON.stringify({ elo: elo }, { status: 200 }));
    } else {
      return new Response(
        JSON.stringify(
          { message: `No task with the name '${task}' was found` },
          { status: 404 }
        )
      );
    }
  } catch (err) {
    console.error(err);
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
