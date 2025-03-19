import sql from "@/db";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    const { data, error } = await supabase
      .from("tournaments")
      .insert([{}])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const tournaments = await sql`
      SELECT 
        DISTINCT tournaments.id as id, tournaments.created_at as created_at, tournaments.deleted as deleted,
        rounds.player_1_name as player_1_name, rounds.player_2_name as player_2_name, rounds.player_1_id as player_1_id, rounds.player_2_id as player_2_id
      FROM tournaments 
      JOIN games ON games.tournament_id = tournaments.id 
      JOIN rounds ON rounds.game_id = games.id 
      WHERE tournaments.deleted = FALSE
    `;

    let tournaments_hash = {};

    tournaments.forEach((t) => {
      if (!tournaments_hash[t.id]) {
        tournaments_hash[t.id] = {
          id: t.id,
          created_at: t.created_at,
          deleted: t.deleted,
          players: new Map([
            [`${t.player_1_id}-${t.player_1_name}`, t.player_1_name],
            [`${t.player_2_id}-${t.player_2_name}`, t.player_2_name],
          ]),
        };
      } else {
        tournaments_hash[t.id].players.set(
          `${t.player_1_id}-${t.player_1_name}`,
          t.player_1_name
        );
        tournaments_hash[t.id].players.set(
          `${t.player_2_id}-${t.player_2_name}`,
          t.player_2_name
        );
      }
    });

    Object.values(tournaments_hash).forEach((tournament) => {
      tournament.players = Array.from(tournament.players.values());
    });

    return NextResponse.json(tournaments_hash, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
