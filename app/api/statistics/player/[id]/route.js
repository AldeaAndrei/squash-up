import { validateId } from "@/app/api/utils/validations";
import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/api/utils/json";

export async function scoreAnalysis(playerId) {
  const rounds = await prisma.rounds.findMany({
    where: {
      OR: [
        { player_1_id: BigInt(playerId) },
        { player_2_id: BigInt(playerId) },
      ],
    },
    include: {
      sets: true,
    },
  });

  const scores = rounds.flatMap((round) =>
    round.sets.flatMap((set) => {
      const isPlayer1 = round.player_1_id === BigInt(playerId);
      const myScore = isPlayer1 ? set.player_1_score : set.player_2_score;
      const opponentScore = isPlayer1 ? set.player_2_score : set.player_1_score;

      // exclude 0–0, include 0 only if opponent ≠ 0
      if (myScore === 0 && opponentScore === 0) {
        return []; // skip
      }
      return [myScore];
    })
  );

  // Build frequency distribution
  const distribution = scores.reduce((acc, score) => {
    acc[score] = (acc[score] || 0) + 1;
    return acc;
  }, {});

  // Convert to chartData format
  const chartData = Object.keys(distribution)
    .map(Number)
    .sort((a, b) => a - b)
    .map((score) => ({
      score,
      count: distribution[score],
    }));

  return chartData;
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const idValidation = validateId(id);

    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    const eloHistory = await prisma.elo_histories.findMany({
      where: { player_id: id },
      orderBy: [{ round_id: "asc" }, { id: "asc" }],
      select: {
        round_id: true,
        player_id: true,
        winner_id: true,
        loser_id: true,
        elo: true,
      },
    });

    let ids = new Set();

    eloHistory.map((history) => {
      ids.add(history.winner_id);
      ids.add(history.loser_id);
    });

    const players = await prisma.players.findMany({
      select: { id: true, name: true },
      where: {
        id: {
          in: Array.from(ids),
        },
      },
    });

    const playerHash = {};
    players.forEach((player) => {
      playerHash[player.id] = player.name;
    });

    let wonAgainst = [];
    let lostAgainst = [];
    const gamesPlayed = eloHistory.length;
    let percentWon = 0;
    let percentLost = 0;

    eloHistory.forEach((history) => {
      if (history.winner_id === history.player_id) {
        percentWon += 1.0;
        wonAgainst.push(history.loser_id);
      }
      if (history.loser_id === history.player_id) {
        percentLost += 1.0;
        lostAgainst.push(history.winner_id);
      }
    });

    percentWon /= gamesPlayed;
    percentLost /= gamesPlayed;

    const bestElo = eloHistory.reduce(
      (max, h) => (h.elo > max ? h.elo : max),
      eloHistory[0]?.elo ?? 0n
    );

    const worstElo = eloHistory.reduce(
      (min, h) => (h.elo < min ? h.elo : min),
      eloHistory[0]?.elo ?? 0n
    );

    const scoreDistribution = await scoreAnalysis(id);

    const statistics = {
      mostWinsAgainstName: playerHash[mostFrequentNumber(wonAgainst).number],
      mostLossesAgainstName: playerHash[mostFrequentNumber(lostAgainst).number],
      mostWinsAgainstCount: mostFrequentNumber(wonAgainst).count,
      mostLossesAgainstCount: mostFrequentNumber(lostAgainst).count,
      gamesPlayed: gamesPlayed,
      percentWon: percentWon,
      percentLost: percentLost,
      bestElo: bestElo,
      worstElo: worstElo,
      scoreDistribution: scoreDistribution,
    };

    return new Response(safeJson(statistics), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

function mostFrequentNumber(arr) {
  const frequencyMap = {};
  let maxCount = 0;
  let mostFrequent = null;

  for (const num of arr) {
    frequencyMap[num] = (frequencyMap[num] || 0) + 1;

    if (frequencyMap[num] > maxCount) {
      maxCount = frequencyMap[num];
      mostFrequent = num;
    }
  }

  return { number: mostFrequent, count: maxCount };
}
