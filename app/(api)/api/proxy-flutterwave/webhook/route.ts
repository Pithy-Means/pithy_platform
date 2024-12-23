import { flw } from "@/flutterwave.config";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body
    const txRef = body.tx_ref;

    if (!txRef) {
      return NextResponse.json({
        status: "error",
        message: "Transaction reference (tx_ref) is required",
      }, { status: 400 });
    }

    console.log("Fetching transactions for tx_ref:", txRef);

    const response = await flw.Transaction.resend_webhook(txRef);
    console.log("Transaction response:", response);

    if (response.status === "error") {
      return NextResponse.json({
        status: "error",
        message: "Error fetching transaction",
      }, { status: 400 });
    }

    return NextResponse.json({
      status: "success",
      message: "Transaction fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json({
      status: "error",
      message: "Internal server error",
    }, { status: 500 });
  }
}
