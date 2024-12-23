/* eslint-disable @typescript-eslint/no-explicit-any */

import { flw } from "@/flutterwave.config";
import { timeFetcher } from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
  // Prepare payload to fetch transactions from yesterday to today
  const payload = {
    from: timeFetcher(new Date().toISOString(), -1), // From yesterday
    to: timeFetcher(new Date().toISOString(), 0), // To today
  };

  try {
    // Extract the tx_ref from the request URL
    const url = new URL(req.url);
    console.log("URL: ", url);
    const tx_ref = url.searchParams.get("tx_ref");
    console.log("Transaction Reference: ", tx_ref);

    if (!tx_ref) {
      return NextResponse.json(
        {
          status: "error",
          message: "Transaction reference (tx_ref) is required",
        },
        { status: 400 }
      );
    }

    console.log("Fetching transactions with payload: ", payload);

    console.log("Fetching transactions ... ");

    // Call Flutterwave to fetch transactions
    const response = await flw.Transaction.fetch(payload);
    
    if (!response) {
      return NextResponse.json(
        {
          status: "error",
          message: "No transactions found",
        },
        { status: 404 }
      );
    }

    console.log("Fetched Transactions: ", response);

    // Filter transactions to find the one with the specified tx_ref
    const matchingTransaction = response.data.find(
      (transaction: any) => transaction.tx_ref === tx_ref
    );

    console.log("Matching Transaction: ", matchingTransaction);

    if (!matchingTransaction) {
      return NextResponse.json(
        {
          status: "error",
          message: `No transaction found with tx_ref: ${tx_ref}`,
        },
        { status: 404 }
      );
    }

    // Check if the transaction status is successful
    const isSuccessful = matchingTransaction.status === "successful";

    return NextResponse.json(
      {
        status: "success",
        message: `Transaction ${isSuccessful ? 'was successful' : 'failed'}`,
        data: matchingTransaction,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error verifying payment: ", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Payment verification failed",
        data: error instanceof Error ? { message: error.message } : error,
      },
      { status: 500 }
    );
  }
};
