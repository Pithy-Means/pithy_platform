import env from "@/env";
import { NextResponse } from "next/server";

const Flutterwave = require("flutterwave-node-v3");

const flw = new Flutterwave(env.payment.public, env.payment.secret);

export async function POST(req: Request) {
  const data = await req.json();

  const { amount, currency, tx_ref, email, phone_number, network } = data;

  try {
    const payload = {
      amount,
      currency,
      tx_ref,
      email,
      phone_number,
      network,
    };

    console.log("Payload data: ", payload);

    const response = await flw.MobileMoney.uganda(payload);

    console.log("Response data: ", response);

    if (response.status === "success") {
      const redirectLink = response.meta?.authorization?.redirect;

      if (redirectLink) {
        return NextResponse.json({
          status: "success",
          message: "Payment initiated successfully",
          redirect: redirectLink,
        });
      } else {
        return NextResponse.json({
          status: "error",
          message: "Payment initiation failed",
          data: response,
        });
      }
    }
  } catch (error) {
    console.log("Error: ", error);
    return NextResponse.json({
      status: "error",
      message: "Payment initiation failed",
      data: error,
    });
  }
}
