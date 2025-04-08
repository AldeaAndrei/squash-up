import { NextResponse } from "next/server";
import { validateId, validatePlayers } from "../utils/validations";
import { updatePlayerNames } from "../utils/players";
import { safeJson } from "../utils/json";
import { createGameForTournament } from "../utils/tournamentCreator";

export async function POST(request, { params }) {
  try {
    const body = await request.json();

    let players = body.players;
    const creatorPlayer = body.creator_player;
    const gameType = body.game_type ?? 3;
    const tournamentId = body.tournament_id;

    const tournamentIdValidation = validateId(tournamentId);

    if (!tournamentIdValidation.success) {
      return NextResponse.json(
        { message: tournamentIdValidation.error },
        { status: 400 }
      );
    }

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

    const result = await createGameForTournament(
      tournamentId,
      players,
      creatorPlayer,
      gameType
    );

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
