import { NextResponse } from "next/server";

export async function GET() {
  try {


    return NextResponse.json({ "null" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
