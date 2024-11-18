import { flw } from "@/flutterwave.config";
import { PaymentData, PaymentResponse } from "@/types/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data: PaymentData = await req.json();

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
        const successResponse: PaymentResponse = {
          status: "success",
          message: "Payment initiated successfully",
          redirect: redirectLink,
          tx_ref,
        };

        return NextResponse.json(successResponse);

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
  };
}
