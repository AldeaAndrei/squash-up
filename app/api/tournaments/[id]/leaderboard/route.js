import { NextResponse } from "next/server";
import sql from "@/db";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const playersData =
      await sql`select distinct players.id, players.name from players
        join rounds on players.id = rounds.player_1_id OR players.id = rounds.player_2_id
        join games on rounds.game_id = games.id
        where games.tournament_id = ${id}`;

    const setsData =
      await sql`select player_1_score, player_1_id, player_2_score, player_2_id, game_id, round_id from sets
        join rounds on rounds.id = sets.round_id
        join games on rounds.game_id = games.id
        where games.tournament_id = ${id}`;

    const players = playersData.reduce((map, player) => {
      map[player.id] = player.name;
      return map;
    }, {});

    let leaderboard = {};

    const minRoundsWin = Math.ceil(
      parseInt(findMaxOccurrence(setsData.map((d) => d.round_id))) / 2.0
    );

    setsData.forEach((set) => {
      const k1 = `${set.player_1_name ?? players[set.player_1_id]}-${
        set.player_1_id
      }`;
      const k2 = `${set.player_2_name ?? players[set.player_2_id]}-${
        set.player_2_id
      }`;
      if (!leaderboard[k1])
        leaderboard[k1] = {
          name: players[set.player_1_id],
          id: set.player_1_id,
          rounds: [],
          total: 0,
        };

      if (!leaderboard[k2])
        leaderboard[k2] = {
          name: players[set.player_2_id],
          id: set.player_2_id,
          rounds: [],
          total: 0,
        };

      if (set.player_1_score > set.player_2_score) {
        leaderboard[k1].rounds.push(set.round_id);
        leaderboard[k1].total += set.player_1_score;
      } else if (set.player_2_score > set.player_1_score) {
        leaderboard[k2].rounds.push(set.round_id);
        leaderboard[k2].total += set.player_2_score;
      }
    });

    let response = [];

    Object.keys(leaderboard).forEach((player) => {
      leaderboard[player].rounds = filterUniqueByFrequency(
        leaderboard[player].rounds,
        minRoundsWin
      ).length;

      response.push(leaderboard[player]);
    });

    return NextResponse.json({ leaderboard: response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

function filterUniqueByFrequency(arr, N) {
  // Count occurrences of each number
  const countMap = arr.reduce((map, num) => {
    map[num] = (map[num] || 0) + 1;
    return map;
  }, {});

  // Get only unique numbers that appear at least N times
  return [...new Set(arr.filter((num) => countMap[num] >= N))];
}

function findMaxOccurrence(arr) {
  // Count occurrences
  const countMap = arr.reduce((map, num) => {
    map[num] = (map[num] || 0) + 1;
    return map;
  }, {});

  // Find the maximum occurrence
  return Math.max(...Object.values(countMap));
}
