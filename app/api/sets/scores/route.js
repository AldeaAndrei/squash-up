import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { newSets } = await request.json();

  try {
    const updatedIds = [];

    for (const { id, player_1_score, player_2_score } of newSets) {
      const updated = await prisma.sets.update({
        where: { id: BigInt(id) },
        data: {
          player_1_score,
          player_2_score,
        },
        select: { id: true },
      });

      updatedIds.push(updated.id.toString());
    }

    return NextResponse.json(updatedIds, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
