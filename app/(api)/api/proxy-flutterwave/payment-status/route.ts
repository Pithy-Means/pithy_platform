import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const tx_ref = searchParams.get("tx_ref");

  if (!tx_ref) {
    return NextResponse.json({ error: "Transaction reference (tx_ref) is required." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${tx_ref}/verify`, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (response.ok && data.status === "success") {
        return NextResponse.json(data);
      } else {
        return NextResponse.json(
          { error: data.message || "Payment verification failed.", details: data },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: "Unexpected response format from Flutterwave.", details: await response.text() },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Error during payment verification." }, { status: 500 });
  }
}
