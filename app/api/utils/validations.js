import prisma from "@/app/lib/prisma";

export function validateId(id) {
  if (id === undefined || id === null || id === "") {
    return { success: false, error: "ID is required and cannot be empty." };
  }

  const num = Number(id);

  if (!Number.isInteger(num) || num <= 0) {
    return { success: false, error: "ID must be a positive integer." };
  }

  return { success: true, error: "" };
}

export async function validatePlayers(players) {
  const uniqueIds = new Set();

  const databaseIds = players
    .map((player) => player.database_id)
    .filter((id) => id != null)
    .map((id) => BigInt(id));

  const existingPlayers = await prisma.players.findMany({
    where: {
      id: { in: databaseIds },
    },
  });

  const existingPlayerIds = new Set(existingPlayers.map((player) => player.id));

  const errors = [];

  players.forEach((player) => {
    if (uniqueIds.has(player.id)) {
      errors.push(
        `Player with id ${player.id} is duplicated in the tournament context.`
      );
    } else {
      uniqueIds.add(player.id);
    }

    if (!existingPlayerIds.has(player.database_id)) {
      errors.push(
        `Player with database_id ${player.database_id} does not exist in the database.`
      );
    }

    if (!player.name || player.name.length < 2) {
      errors.push(
        `Player with id ${player.id} must have a valid name (at least 2 characters).`
      );
    }
  });

  return errors.length > 0 ? errors : null;
}
