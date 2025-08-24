import { index } from "@/app/service/tournaments/tournamentsService";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const perPage = parseInt(url.searchParams.get("perPage")) || 10;

    const { data, pagination } = await index({ page, perPage });

    return NextResponse.json(
      { tournaments: data, pagination },
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
