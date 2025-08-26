import prisma from "@/app/lib/prisma";

function normalizeScore(value) {
  const str = String(value).trim();
  if (!/^\d+$/.test(str)) return 0; // only digits
  let n = Number(str);
  if (!Number.isInteger(n)) return 0; // no decimals
  if (n < 0) n = 0;
  if (n > 25) n = 25;
  return n;
}

export async function update(sets) {
  if (!sets || typeof sets !== "object") {
    return { updated: [], count: 0 };
  }

  const entries = Object.entries(sets);
  if (entries.length === 0) {
    return { updated: [], count: 0 };
  }

  const ids = [];
  const p1s = [];
  const p2s = [];

  for (const [idStr, s] of entries) {
    ids.push(BigInt(idStr)); // ids are BigInt in schema
    p1s.push(normalizeScore(s?.player_1_score));
    p2s.push(normalizeScore(s?.player_2_score));
  }

  const updated = await prisma.$queryRaw`
    WITH data AS (
      SELECT
        unnest(${ids}::bigint[]) AS id,
        unnest(${p1s}::int[])    AS p1,
        unnest(${p2s}::int[])    AS p2
    )
    UPDATE "sets" s
    SET "player_1_score" = d.p1,
        "player_2_score" = d.p2
    FROM data d
    WHERE s.id = d.id
    RETURNING s.id, s.player_1_score, s.player_2_score;
  `;

  return {
    updated: updated.map((r) => ({
      id: r.id.toString(),
      player_1_score: r.player_1_score,
      player_2_score: r.player_2_score,
    })),
    count: updated.length,
  };
}
