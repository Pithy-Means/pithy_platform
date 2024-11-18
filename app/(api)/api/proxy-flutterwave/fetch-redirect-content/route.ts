// File: src/app/api/fetch-redirect-content/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const redirectUrl = searchParams.get("url");

  if (!redirectUrl) {
    return NextResponse.json(
      { status: "error", message: "Missing redirect URL." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(redirectUrl);
    const content = await response.text();

    return new Response(content, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("Error fetching redirect content: ", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch redirect content." },
      { status: 500 }
    );
  }
}
