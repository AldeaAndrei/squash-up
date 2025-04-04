import prisma from "@/app/lib/prisma";
import { updateEloForRound } from "../elo/utils";
import { safeJson } from "@/app/utils/json";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  let task = searchParams.get("task");

  if (task.startsWith('"') && task.endsWith('"')) {
    task = task.slice(1, -1);
  }

  try {
    console.clear();
    console.log(`Execute task ${task.toString()}`);

    if (task === "calculate-elo") {
      const deletedHistories = await prisma.elo_histories.deleteMany({});
      console.log(`Delete all histories`);

      await prisma.rounds.updateMany({
        data: {
          used_for_elo: false,
        },
      });
      console.log(`Set all rounds as unused`);

      await prisma.players.updateMany({
        data: {
          elo: 1600,
        },
      });
      console.log(`Set all players ELO to 1600`);

      const updatedPlayersRows = await prisma.players.findMany({
        select: {
          id: true,
          elo: true,
        },
      });

      const rounds = await prisma.rounds.findMany({
        where: {
          games: {
            tournaments: {
              deleted: false,
            },
          },
        },
        orderBy: {
          id: "asc",
        },
        select: {
          id: true,
        },
      });

      console.group();
      for (const round of rounds) {
        console.log(`Update ELO for round ${round.id}`);
        const results = await updateEloForRound(round.id);
      }
      console.groupEnd();

      const playersElo = await prisma.players.findMany({
        orderBy: {
          elo: "desc",
        },
        select: {
          name: true,
          elo: true,
        },
      });

      return new Response(safeJson({ elo: playersElo }, { status: 200 }));
    } else {
      return new Response(
        JSON.stringify(
          { message: `No task with the name '${task}' was found` },
          { status: 404 }
        )
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
