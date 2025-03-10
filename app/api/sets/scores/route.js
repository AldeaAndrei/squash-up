import sql from "@/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { newSets } = await request.json();

  try {
    const values = newSets
      .map(
        ({ id, player_1_score, player_2_score }) =>
          `(${id}, ${player_1_score}, ${player_2_score})`
      )
      .join(", ");

    const query = `
        UPDATE sets AS s
        SET 
          player_1_score = v.player_1_score, 
          player_2_score = v.player_2_score
        FROM (VALUES ${values}) AS v(id, player_1_score, player_2_score)
        WHERE s.id = v.id
      RETURNING s.id;
    `;

    const updatedRows = await sql.unsafe(query);

    return NextResponse.json(
      updatedRows.map((row) => row.id),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
