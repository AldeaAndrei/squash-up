import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { validateId } from "../../utils/validations";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const idValidation = validateId(id);

    if (!idValidation.success) {
      return NextResponse.json({ error: idValidation.error }, { status: 400 });
    }

    const playerData = await prisma.players.findUnique({
      where: { id: id },
      select: {
        id: true,
        name: true,
        elo: true,
      },
    });

    const player = {
      ...playerData,
      id: playerData.id.toString(),
    };

    return NextResponse.json({ player }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
