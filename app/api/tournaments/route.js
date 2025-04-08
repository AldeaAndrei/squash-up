import sql from "@/db";
import { NextResponse } from "next/server";
import { createTournament } from "../utils/tournamentCreator";
import { validatePlayers } from "../utils/validations";
import { updatePlayerNames } from "../utils/players";
import { safeJson } from "../utils/json";

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
    const tournaments = await sql`
      SELECT
        DISTINCT tournaments.id as id, tournaments.created_at as created_at, tournaments.deleted as deleted,
        rounds.player_1_name as player_1_name, rounds.player_2_name as player_2_name, rounds.player_1_id as player_1_id, rounds.player_2_id as player_2_id
      FROM tournaments
      JOIN games ON games.tournament_id = tournaments.id
      JOIN rounds ON rounds.game_id = games.id
      WHERE tournaments.deleted = FALSE
    `;

    let tournaments_hash = {};

    tournaments.forEach((t) => {
      if (!tournaments_hash[t.id]) {
        tournaments_hash[t.id] = {
          id: t.id,
          created_at: t.created_at,
          deleted: t.deleted,
          players: new Map([
            [`${t.player_1_id}-${t.player_1_name}`, t.player_1_name],
            [`${t.player_2_id}-${t.player_2_name}`, t.player_2_name],
          ]),
        };
      } else {
        tournaments_hash[t.id].players.set(
          `${t.player_1_id}-${t.player_1_name}`,
          t.player_1_name
        );
        tournaments_hash[t.id].players.set(
          `${t.player_2_id}-${t.player_2_name}`,
          t.player_2_name
        );
      }
    });

    Object.values(tournaments_hash).forEach((tournament) => {
      tournament.players = Array.from(tournament.players.values());
    });

    return NextResponse.json(tournaments_hash, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
