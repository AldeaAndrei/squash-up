import { NextResponse } from "next/server";
import getPlayersById from "../../utils/getPlayersById";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const players = await getPlayersById(id);

    return NextResponse.json({ players }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
