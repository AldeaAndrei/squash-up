import { validateId } from "@/app/api/utils/validations";
import prisma from "@/app/lib/prisma";
import { safeJson } from "@/app/api/utils/json";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const idValidation = validateId(id);

    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    const eloHistory = await prisma.elo_histories.findMany({
      where: { round_id: id },
      orderBy: [{ id: "desc" }],
      select: {
        round_id: true,
        player_id: true,
        elo: true,
      },
    });

    return new Response(safeJson(eloHistory), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
