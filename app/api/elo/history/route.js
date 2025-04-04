import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/utils/json";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let playerID = searchParams.get("playerId");

  if (!playerID || isNaN(playerID) || Number(playerID) <= 0) {
    return new Response(
      JSON.stringify({
        error: "Invalid playerId. It must be a positive number.",
      }),
      { status: 400 }
    );
  }

  try {
    console.clear();

    const eloHistory = await prisma.elo_histories.findMany({
      where: {
        player_id: BigInt(playerID),
      },
      orderBy: [{ round_id: "asc" }, { id: "asc" }],
      select: {
        elo: true,
      },
    });

    return new Response(safeJson(eloHistory), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
