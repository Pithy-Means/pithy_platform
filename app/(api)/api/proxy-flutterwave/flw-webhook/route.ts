import env from "@/env";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { FlutterwaveWebhookData } from "@/types/schema";
import { createAdminClient } from "@/utils/appwrite";
import { db, paymentCollection } from "@/models/name";

// Step 1: Verify that the request is a POST request
export async function POST(req: NextRequest) {
  try {
    // Step 1: Log all headers to debug issues
    console.log('Headers:', JSON.stringify(Object.fromEntries(req.headers.entries()), null, 2));

    // Step 2: Capture the 'verif-hash' or 'x-flw-signature' from the headers
    const flutterwaveSignature = req.headers.get("verif-hash") || req.headers.get("x-flw-signature");
    console.log("Flutterwave Signature:", flutterwaveSignature);

    if (!flutterwaveSignature) {
      return NextResponse.json({
        message: "Unauthorized: No signature in headers",
      });
    }

    // Step 3: Verify the signature to ensure it came from Flutterwave
    const secretHash = env.payment.hash; // Set this in your .env.local file
    const payload = await req.text();
    console.log("Webhook payload:", payload);
    const hash = crypto
      .createHmac("sha256", secretHash)
      .update(payload)
      .digest("hex");

    if (hash !== flutterwaveSignature) {
      return NextResponse.json({ message: "Invalid signature" });
    }

    console.log("Signature verified successfully");

    // Step 4: Extract the payment details from the request body
    const data: FlutterwaveWebhookData = JSON.parse(payload);

    const { id, tx_ref, status, amount, currency, customer, message } = data;

    console.log("Webhook received with transaction ID:", id);
    console.log("Payment details:", {
      id,
      tx_ref,
      status,
      amount,
      currency,
      customer,
      message
    });

    // Step 5: Handle the payment status
    if (status === "success" && amount === 10000) {
      console.log(`✅ Payment successful for transaction ID: ${id}, Amount: ${amount} ${currency}`);

      try {
        // Step 6: Update the payment record in the database
        const { databases } = await createAdminClient();

        const paymentUpdateResponse = await databases.updateDocument(
          db, 
          paymentCollection, 
          tx_ref, 
          { checked: true }
        );

        console.log(`✅ Database updated successfully for tx_ref: ${tx_ref}`, paymentUpdateResponse);
      } catch (error) {
        console.error(`❌ Error updating the database for tx_ref: ${tx_ref}`, error);
      }
    } else {
      console.log(`❌ Payment failed for transaction ID: ${id}, Status: ${status}`);
    }

    // Step 7: Send a 200 OK response to Flutterwave
    return NextResponse.json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ message: "Internal server error" });
  }
}
