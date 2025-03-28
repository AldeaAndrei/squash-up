import sql from "@/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  try {
    let data;

    if (name) {
      data =
        await sql`SELECT id, name, elo, RANK() OVER (ORDER BY elo DESC) AS rank FROM players WHERE name ILIKE ANY(ARRAY[${name} || '%', '% ' || ${name} || '%'])`;
    } else {
      data =
        await sql`SELECT id, name, elo, RANK() OVER (ORDER BY elo DESC) AS rank FROM players`;
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
