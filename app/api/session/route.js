import { cookies } from "next/headers";
import { decrypt, deleteSession } from "@/app/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
  const cookie = (await cookies()).get("session")?.value;
  const session = cookie ? await decrypt(cookie) : null;
  return NextResponse.json(
    { playerId: session?.playerId ?? null },
    { status: 200 }
  );
}

export async function DELETE() {
  const success = (await deleteSession()).success;
  if (success)
    return NextResponse.json({ message: "Log out", success }, { status: 200 });
  else return NextResponse.json({ message: "Error", success }, { status: 500 });
}
