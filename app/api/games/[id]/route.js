import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { rows: games } = await query("SELECT * FROM games");
    const { rows: rounds } = await query("SELECT * FROM rounds");
    const { rows: sets } = await query("SELECT * FROM sets");
    const { rows: tournaments } = await query("SELECT * FROM tournaments");
    const { rows: players } = await query("SELECT * FROM players");

    console.log({ games, rounds, sets, tournaments, players });

    return NextResponse.json({ games }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
