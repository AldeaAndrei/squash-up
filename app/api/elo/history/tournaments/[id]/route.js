import { validateId } from "@/app/api/utils/validations";
import { safeJson } from "@/app/api/utils/json";
import getHistoryByTournamentId from "../../../utils/getHistoryByTournamentId";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const idValidation = validateId(id);

    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    const eloHistory = await getHistoryByTournamentId(id);

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
