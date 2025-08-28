import { safeJson } from "@/app/api/utils/json";
import { show } from "@/app/service/tournaments/tournamentsService";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const id = params.id;
    const { data } = await show(id);

    return NextResponse.json(
      { tournament: data },
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
