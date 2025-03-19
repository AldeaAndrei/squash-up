import sql from "@/db";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const { id } = await params;

  const { data: tournament, error } = await supabase
    .from("tournaments")
    .select(
      `
    *,
    games:games (
      *,
      rounds:rounds (
        *,
        sets:sets (*)
      )
    )
  `
    )
    .eq("id", id)
    .single();

  return NextResponse.json({ tournament }, { status: 200 });
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  const tournament = await sql`
    UPDATE tournaments
    SET deleted = true
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json({ tournament }, { status: 200 });
}
