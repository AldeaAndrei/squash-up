import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  try {
    let players;

    if (name) {
      players = await prisma.players.findMany({
        where: {
          OR: [
            {
              name: {
                startsWith: name,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: ` ${name}`,
                mode: "insensitive",
              },
            },
          ],
        },
        orderBy: {
          elo: "desc",
        },
        select: {
          id: true,
          name: true,
          elo: true,
        },
      });
    } else {
      players = await prisma.players.findMany({
        orderBy: {
          elo: "desc",
        },
        select: {
          id: true,
          name: true,
          elo: true,
        },
      });
    }

    // Add manual ranking
    const rankedPlayers = players.map((player, index) => ({
      ...player,
      id: player.id.toString(),
      rank: index + 1,
    }));

    return NextResponse.json(rankedPlayers, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
