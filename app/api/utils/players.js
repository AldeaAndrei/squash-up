import sql from "@/db";

export async function getPlayersIdsForTournament(tournamentId) {
  let data = await sql`
    SELECT rounds.player_1_id, rounds.player_2_id
    FROM tournaments 
    JOIN games ON games.tournament_id = tournaments.id 
    JOIN rounds ON rounds.game_id = games.id 
    WHERE rounds.player_1_id IS NOT NULL 
    AND rounds.player_2_id IS NOT NULL
    AND tournaments.id = ${tournamentId}`;

  let uniqIds = new Set();

  data.forEach((d) => {
    uniqIds.add(d.player_1_id);
    uniqIds.add(d.player_2_id);
  });

  return [...uniqIds];
}

export async function getPlayersIdsForRound(roundId) {
  const data = await sql`
    SELECT player_1_id, player_2_id
    FROM rounds 
    WHERE id = ${roundId}
  `;

  return data.flatMap(({ player_1_id, player_2_id }) => [
    player_1_id,
    player_2_id,
  ]);
}

export async function getPlayersEloDetails(playersIds) {
  if (!Array.isArray(playersIds) || playersIds.length === 0) {
    throw new Error("Invalid playersIds: must be a non-empty array.");
  }

  let data =
    await sql`SELECT id, elo, name FROM players WHERE id = ANY(${playersIds})`;

  return data;
}
