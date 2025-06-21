import prisma from "@/app/lib/prisma";

export async function getById(id) {
  const tournamentId = BigInt(id);

  const tournament = await prisma.tournaments.findUnique({
    where: { id: tournamentId },
  });

  if (!tournament) return null;

  const games = await prisma.games.findMany({
    where: { tournament_id: tournamentId },
    orderBy: { id: "asc" },
  });

  const gameIds = games.map((g) => g.id);

  const rounds = await prisma.rounds.findMany({
    where: { game_id: { in: gameIds } },
    orderBy: { id: "asc" },
  });

  const roundIds = rounds.map((r) => r.id);

  const sets = await prisma.sets.findMany({
    where: { round_id: { in: roundIds } },
    orderBy: { id: "asc" },
  });

  const roundsByGame = new Map();
  rounds.forEach((round) => {
    round.sets = [];
    if (!roundsByGame.has(round.game_id)) {
      roundsByGame.set(round.game_id, []);
    }
    roundsByGame.get(round.game_id).push(round);
  });

  const setsByRound = new Map();
  sets.forEach((set) => {
    if (!setsByRound.has(set.round_id)) {
      setsByRound.set(set.round_id, []);
    }
    setsByRound.get(set.round_id).push(set);
  });

  rounds.forEach((round) => {
    round.sets = setsByRound.get(round.id) || [];
  });

  games.forEach((game) => {
    game.rounds = roundsByGame.get(game.id) || [];
  });

  tournament.games = games;

  return tournament;
}
