import { update } from "@/app/service/sets/setsService";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const body = await req.json();

    // Body should look like:
    // {
    //   "3859": { "player_1_score": 1, "player_2_score": 2 },
    //   "3860": { "player_1_score": 3, "player_2_score": 1 }
    // }

    const result = await update(body);

    return NextResponse.json(
      { data: result.updated, count: result.count },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error updating sets:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update sets" },
      { status: 400 }
    );
  }
}
