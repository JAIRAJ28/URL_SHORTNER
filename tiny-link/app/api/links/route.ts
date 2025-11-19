import { createLink, generateRandomCode, getAllLinks, isValidCode, isValidUrl } from "@/lib/queries";
import { NextResponse } from "next/server";

export async function GET(){
  try {
    const links = await getAllLinks();
    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.log("Error_getALLLINKS",error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
 try {
    const body = await req.json();
    const { url, code: customCode } = body || {};
    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "url is required" },
        { status: 400 }
      );
    }
     if (!isValidUrl(url)) {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }
    const code = customCode || generateRandomCode();
    if (!isValidCode(code)) {
      return NextResponse.json(
        { error: "Code must be [A-Za-z0-9]{6,8}" },
        { status: 400 }
      );
    }
    try {
      const link = await createLink(code, url);
      return NextResponse.json(link, { status: 201 });
    } catch (err: any) {
      if (err?.code === "CODE_EXISTS") {
        // SPEC: 409 if code exists
        return NextResponse.json(
          { error: "Code already exists" },
          { status: 409 }
        );
      }
      console.error("POST /api/links error", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("POST /api/links parse error", err);
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }
}