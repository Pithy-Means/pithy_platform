import { flw } from "@/flutterwave.config";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const data = await req.json();

  const { tx_ref } = data;

  try {
    const payload = {
      tx_ref,
    };

    console.log("Payload data: ", payload);

    const response = await flw.Transaction.verify(payload);

    console.log("Response data: ", response);

    if (response.status === "success") {
      return NextResponse.json({
        status: "success",
        message: "Payment verified successfully",
        data: response,
        redirect: '/course'
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