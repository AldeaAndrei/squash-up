import prisma from "@/app/lib/prisma";
import { safeJson } from "../../utils/json";
import sql from "@/db";
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

  const tournament = await sql`
    UPDATE tournaments
    SET deleted = true
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ tournament }, { status: 200 });
}
