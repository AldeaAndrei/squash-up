import prisma from "@/app/lib/prisma";
import { safeJson } from "../../utils/json";
import { NextResponse } from "next/server";
import { getById } from "../utils/getById";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const tournament = await getById(id);

    return new Response(
      safeJson({
        tournament,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    const tournament = await prisma.tournaments.update({
      where: { id: BigInt(id) },
      data: { deleted: true },
    });

    return NextResponse.json(
      { tournament_id: tournament.id.toString() },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
