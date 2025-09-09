import { index } from "@/app/service/elo/eloService";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const perPage = parseInt(url.searchParams.get("perPage")) || 10;
    const playerId = parseInt(url.searchParams.get("playerId"));
    const opponentId = parseInt(url.searchParams.get("opponent"));

    const { data, pagination } = await index({
      page,
      perPage,
      playerId,
      opponentId,
    });

    return NextResponse.json(
      { eloHistory: data, pagination },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
