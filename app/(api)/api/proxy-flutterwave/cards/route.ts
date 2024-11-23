import env from "@/env";
import { flw } from "@/flutterwave.config";
import { CardPaymentData } from "@/types/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data: CardPaymentData = await req.json();

  const {
    amount,
    currency,
    tx_ref,
    email,
    card_number,
    cvv,
    expiry_month,
    expiry_year,
  } = data;

  try {
    const payload: {
      amount: number;
      currency: string;
      tx_ref: string;
      email: string;
      card_number: string;
      cvv: string;
      expiry_month: string;
      expiry_year: string;
      enckey: string;
    } = {
      amount,
      currency,
      tx_ref,
      email,
      card_number,
      cvv,
      expiry_month,
      expiry_year,
      enckey: env.payment.encryption,
    };

    console.log("Payload data: ", payload);

    const response = await flw.Charge.card(payload);

    console.log("Response data: ", response);

    if (response.status === "success") {
      let payloadWithPin;
      if (response.meta.authorization.mode === "pin") {
        payloadWithPin = {
          ...payload,
          authorization: {
            mode: "pin",
            pin: "3310", // Adjust or fetch dynamically for real implementation
          },
        };
      }
      console.log("Payload with pin: ", payloadWithPin);
      const recall = await flw.Charge.card(payloadWithPin);
      console.log("Recall data: ", recall);

      if (recall.status === "success") {
        const callValidate = await flw.Charge.validate({
          otp: "12345", // Replace with actual OTP from the user
          flw_ref: recall.data.flw_ref,
        });

        console.log("Validate data: ", callValidate);
      } else {
        console.log("Recall failed: ", recall.message);
        return NextResponse.json({
          status: "error",
          message: "Recall failed: " + recall.message,
        });
      }
    }

    console.log("Response data: ", response);

    if (response.meta.authorization.mode === "redirect") {
      return NextResponse.json({
        status: "success",
        message: "Payment initiated successfully",
        redirect: response.meta.authorization.redirect,
        tx_ref,
      });
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
