import { flw } from "@/flutterwave.config";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const data = await req.json();

  const { id, tx_ref, amount, status } = data;

  try {
    const payload = {
      id,
      tx_ref,
      amount,
      status,
    };

    console.log("Payload data: ", payload);

    const response = await flw.Transaction.verify(payload);

    console.log("Response data: ", response);

    if (response.status === "success") {
      return NextResponse.json({
        status: "success",
        message: "Payment verified successfully",
        data: response,
        redirect: "/course",
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Payment verification failed",
      data: error,
    });
  }
};
