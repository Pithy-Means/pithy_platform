  import { NextResponse } from "next/server";
  import env from "@/env";
  import { createAdminClient } from "@/utils/appwrite";
  import { db, paymentCollection } from "@/models/name";
  import { generateValidPostId } from "@/lib/utils";

  export async function POST(req: Request) {
    try {
      // Parse the request body
      const body = await req.json(); // Use req.json() to parse the body
      const { tx_ref, amount, email, name, paymentId, course_choice, user_id, phone_number } = body;
      const payId = generateValidPostId(paymentId);

      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.payment.secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref,
          amount,
          currency: "UGX",
          redirect_url: "http://localhost:3000/payment-status",
          payment_options: "card, banktransfer",
          customer: {
            email,
            name,
          },
          customizations: {
            title: "Course",
            description: "Payment for course",
            logo: "http://localhost:3000/assets/logo.png",
          },
        }),
      });

      console.log("response", response);

      const data = await response.json();
      console.log("data from initiate", data);

      if (data.status === "success") {
        const { databases } = await createAdminClient();

        const storePayment = await databases.createDocument(db, paymentCollection, payId, {
          user_id,
          tx_ref,
          amount,
          phone_number,
          network : "flutterwave",
          email,
          currency: "UGX",
          payment_id: payId,
          course_choice,
          status: "pending",
        });

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
