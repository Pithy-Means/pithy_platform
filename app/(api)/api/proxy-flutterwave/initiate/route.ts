import { NextResponse } from "next/server";
import env from "@/env";
import { createAdminClient } from "@/utils/appwrite";
import { db, paymentCollection } from "@/models/name";
import { generateValidPostId } from "@/lib/utils";
import { PaymentData } from "@/types/schema";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body: PaymentData = await req.json();
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

    // Generate payment ID if not provided
    const payId = payment_id ? generateValidPostId(payment_id) : generateValidPostId();

    // Log the received data for debugging
    console.log("Received payment data:", {
      name,
      phone_number,
      email,
      user_id,
      course_choice,
      amount,
      currency
    });

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
        redirect_url: 'https://www.pithymeansplus.com/payment-status',
        payment_options:
          "card, ussd, mpesa, mobile_money_franco, qr, mobile_money_uganda, mobile_money_ghana, mobile_money_rwanda, mobile_money_tanzania, bank_transfer, opay, enaira, googlepay, applepay, capitec",
        customer: {
          email,
          name,
          phone_number, // Add phone number to customer object
        },
        customizations: {
          title: "Course Payment",
          description: "Payment for course enrollment",
          logo: "https://www.pithymeansplus.com/assets/logo.png",
        },
      }),
    });

    const data = await response.json();

    // Log Flutterwave response for debugging
    console.log("Flutterwave response:", data);

    if (data.status === "success") {
      try {
        const { databases } = await createAdminClient();

        // Prepare payment document data
        const paymentDocData = {
          user_id,
          tx_ref,
          amount: Number(amount), // Ensure amount is a number
          phone_number: phone_number || "", // Ensure phone_number is not undefined
          name: name || "", // Ensure name is not undefined
          currency,
          email,
          payment_id: payId,
          course_choice,
          status: "pending",
        };

        console.log("Storing payment data:", paymentDocData);

        const storePayment = await databases.createDocument(
          db,
          paymentCollection,
          payId,
          paymentDocData
        );

        console.log("Payment stored successfully:", storePayment);

        return NextResponse.json({
          success: true,
          payment_id: payId,
          link: data.data.link,
          stored_data: storePayment
        });

      } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json({
          error: "Failed to store payment data",
          details: dbError
        }, { status: 500 });
      }
    } else {
      console.error("Flutterwave error:", data);
      return NextResponse.json({
        error: "Payment initiation failed",
        details: data
      }, { status: 400 });
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      error: "An error occurred processing the payment",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}