import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      ok: true,
      version: "1.0",
      uptime: process.uptime(),
    },
    { status: 200 }
  );
}

