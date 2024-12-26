import { NextResponse } from "next/server";
import env from "@/env";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json(); // Use req.json() to parse the body
    const { tx_ref, amount, email, name } = body;

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.payment.secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency: "UGX",
        redirect_url: "http://localhost:3000/payment-status",
        payment_options: "card, banktransfer",
        customer: {
          email,
          name,
        },
        customizations: {
          title: "Course",
          description: "Payment for course",
          logo: "https://assets.piedpiper.com/logo.png",
        },
      }),
    });

    const data = await response.json();
    console.log("data from initiate", data);

    if (data.status === "success") {
      return NextResponse.json(data.data.link);
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
