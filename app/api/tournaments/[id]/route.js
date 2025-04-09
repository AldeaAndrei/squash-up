import prisma from "@/app/lib/prisma";
import { safeJson } from "../../utils/json";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = await params;

  const tournament = await prisma.tournaments.findUnique({
    where: {
      id: BigInt(id),
    },
    include: {
      games: {
        include: {
          rounds: {
            orderBy: { id: "asc" },
            include: {
              sets: true,
            },
          },
        },
      },
    },
  });

  return new Response(
    safeJson({
      tournament,
    }),
    {
      status: 200,
    }
  );
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
