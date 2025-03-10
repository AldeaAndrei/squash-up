import { NextResponse } from "next/server";
import sql from "@/db";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const players =
      await sql`select distinct players.id, players.name from players
    join rounds on players.id = rounds.player_1_id OR players.id = rounds.player_2_id
    join games on rounds.game_id = games.id
    where games.tournament_id = ${id}`;

    return NextResponse.json({ players }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
