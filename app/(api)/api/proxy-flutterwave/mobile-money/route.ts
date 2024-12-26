import { flw } from "@/flutterwave.config";
// import { generateValidPostId } from "@/lib/utils";
// import { db, paymentCollection } from "@/models/name";
import { PaymentData } from "@/types/schema";
// import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data: PaymentData = await req.json();

  const { amount, currency, tx_ref, email, phone_number, network, redirect_url } = data;
  // const payId = generateValidPostId(payment_id);

  try {
    const payload = {
      amount,
      currency,
      tx_ref,
      email,
      phone_number,
      network,
      redirect_url,
    };

    console.log("Payload data: ", payload);

    const response = await flw.MobileMoney.uganda(payload);

    console.log("Response data: ", response);

    if (response.status === "success") {
      const redirectLink = response.meta?.authorization?.redirect;

      // const { databases } = await createAdminClient();

      // const payment = await databases.createDocument(db, paymentCollection, payId, {
      //   ...data, payment_id: payId, status: response.status,
      // });
      // console.log("Payment data: ", payment);

      if (redirectLink) {

        return NextResponse.json({
          status: "success",
          message: "Payment initiated successfully",
          data: response,
          redirect: redirectLink,
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
  }
}
