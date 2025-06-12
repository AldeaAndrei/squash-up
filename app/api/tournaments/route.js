import { NextResponse } from "next/server";
import { createTournament } from "../utils/tournamentCreator";
import { validatePlayers } from "../utils/validations";
import { updatePlayerNames } from "../utils/players";
import prisma from "@/app/lib/prisma";
import { getAll } from "./utils/getAll";

export async function POST(request, { params }) {
  try {
    const body = await request.json();

    let players = body.players;
    const creatorPlayer = body.creator_player;
    const gameType = body.game_type ?? 3;

    if (!creatorPlayer) {
      return NextResponse.json(
        { message: "Creator player must be present" },
        { status: 400 }
      );
    }

    if (!players) {
      return NextResponse.json(
        { message: "Players must be present" },
        { status: 400 }
      );
    } else if (players.length < 2) {
      return NextResponse.json(
        { message: "A tournament needs at least 2 players" },
        { status: 400 }
      );
    } else {
      const validation = await validatePlayers(players);

      if (validation.errors) {
        return NextResponse.json(
          { messages: validation.errors },
          { status: 400 }
        );
      }
    }

    players = await updatePlayerNames(players);

    const result = await createTournament(players, creatorPlayer, gameType);

    if (result.success) {
      return NextResponse.json(
        { tournament_id: result.tournamentId.toString() },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const tournaments_hash = await getAll();

    return NextResponse.json(tournaments_hash, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
