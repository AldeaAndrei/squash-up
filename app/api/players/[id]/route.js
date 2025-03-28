import sql from "@/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const player = await sql`
        SELECT id, name, elo, RANK() OVER (ORDER BY elo DESC) AS rank FROM players
        WHERE id = ${id}
        LIMIT 1
      `;

    return NextResponse.json({ player: player[0] ?? null }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
