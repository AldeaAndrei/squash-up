import { calculateEloForRound } from "./utils";

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const elo = await calculateEloForRound(id);

    return new Response(JSON.stringify({ elo: elo }, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
