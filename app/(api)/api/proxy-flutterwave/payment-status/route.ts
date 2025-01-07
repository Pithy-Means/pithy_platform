import { db, paymentCollection } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transaction_id = searchParams.get("transaction_id");

  if (!transaction_id) {
    return NextResponse.json({ error: "Transaction reference (transaction_id) is required." }, { status: 400 });
  }

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (response.ok && data.status === "success" && data.data.status === "successful" && data.data.amount === 10000) {
        console.log("Response data", data);
        const { databases } = await createAdminClient();

        // Get the payment details from the database
        const getPayId = await databases.listDocuments(db, paymentCollection, [
          Query.equal("tx_ref", data.data.tx_ref), // Filter by transaction reference
        ]);

        console.log("getPayId", getPayId);

        if (!getPayId.documents.length) {
          return NextResponse.json({ error: "Payment not found." }, { status: 404 });
        } else if (getPayId.documents[0]) {
          // Update the payment status in the database
          const successPayment = await databases.updateDocument(db, paymentCollection, getPayId.documents[0].$id, {
            checked: true,
            currency: data.data.currency,
            method: data.data.auth_model,
            status: "successful",
          });
          console.log("successPayment", successPayment);
          return NextResponse.json({
            successPayment, data
          });
        }
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
