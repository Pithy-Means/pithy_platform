"use server";

import { NextRequest, NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { createAdminClient } from "@/utils/appwrite";
import { db, paymentCollection } from "@/models/name";

export async function GET(req: NextRequest) {

  try {
    // Parse the request body to extract the tx_ref
    const tx_ref = req.nextUrl.searchParams.get("tx_ref");
    console.log("Transaction reference from URL:", tx_ref);
    if (!tx_ref) {
      return NextResponse.json(
        {
          status: "error",
          message: "Transaction reference (tx_ref) is required",
        },
        { status: 400 }
      );
    }
    // Create the admin client to access the database
    const { databases } = await createAdminClient();
    console.log("Admin client created");


    // Query the payment collection to find the payment by tx_ref
    const paymentDocument = await databases.listDocuments(
      db,
      paymentCollection,
      [Query.equal("tx_ref", tx_ref)]
    );
    console.log("Payment Document:", paymentDocument);
    if (paymentDocument.total === 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Payment not found",
        },
        { status: 404 }
      );
    }
    const paymentData = paymentDocument.documents[0];
    console.log("Payment Data:", paymentData);

    return NextResponse.json({
      status: "success",
      message: "Payment status retrieved successfully",
      data: paymentData,
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
