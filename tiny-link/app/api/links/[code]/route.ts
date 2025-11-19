import { deleteLinkByCode, getLinkByCode, isValidCode } from "@/lib/queries";
import { NextResponse } from "next/server";

type Params = {
  params: Promise<{ code: string }>;
};

export async function GET(_req: Request, ctx: Params) {
  const { code } = await ctx.params;

  console.log(code, "code____");

  if (!isValidCode(code)) {
    return NextResponse.json(
      { error: "Invalid code" },
      { status: 400 }
    );
  }

  try {
    const link = await getLinkByCode(code);

    if (!link) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(link, { status: 200 });
  } catch (err) {
    console.error("error_in_getLinkByCode", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, ctx: Params) {
  const { code } = await ctx.params;
  if (!isValidCode(code)) {
    return NextResponse.json(
      { error: "Invalid code" },
      { status: 400 }
    );
  }
  try {
    const deleted = await deleteLinkByCode(code);
    if (!deleted) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { ok: true },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error_in_deleteLink", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}