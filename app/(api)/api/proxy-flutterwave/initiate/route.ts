import { NextResponse } from "next/server";
import env from "@/env";
import { createAdminClient } from "@/utils/appwrite";
import { db, paymentCollection } from "@/models/name";
import { generateValidPostId } from "@/lib/utils";
import { PaymentData } from "@/types/schema";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body: PaymentData = await req.json(); // Use req.json() to parse the body
    const {
      tx_ref,
      amount,
      email,
      name,
      payment_id,
      course_choice,
      user_id,
      phone_number,
      currency,
    } = body;
    const payId = generateValidPostId(payment_id);

    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.payment.secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref,
        amount,
        currency,
        redirect_url: "http://localhost:3000/payment-status",
        payment_options:
          "card, ussd, mpesa, mobile_money_franco, qr, mobile_money_uganda, mobile_money_ghana, mobile_money_rwanda, mobile_money_tanzania, bank_transfer, opay, enaira, googlepay, applepay, capitec",
        customer: {
          email,
          name,
        },
        customizations: {
          title: "Course",
          description: "Payment for course",
          logo: "https://www.pithymeansplus.com/assets/logo.png",
        },
      }),
    });


    const data = await response.json();

    if (data.status === "success") {
      const { databases } = await createAdminClient();

      const storePayment = await databases.createDocument(
        db,
        paymentCollection,
        payId,
        {
          user_id,
          tx_ref,
          amount,
          phone_number,
          currency,
          email,
          payment_id: payId,
          course_choice,
          status: "pending",
        },
      );

      console.log("storePayment", storePayment);
      return NextResponse.json({ ...storePayment, link: data.data.link });
    } else {
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "An error occurred" });
  }
}
