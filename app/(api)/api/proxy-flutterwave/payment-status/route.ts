import {
  courseCollection,
  db,
  paymentCollection,
  userCollection,
} from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import env from "@/env";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transaction_id = searchParams.get("transaction_id");
  const requesting_user_id = searchParams.get("user_id"); // Add this parameter

  if (!transaction_id) {
    return NextResponse.json(
      { error: "Transaction reference (transaction_id) is required." },
      { status: 400 }
    );
  }

  try {
    // Step 1: Verify the transaction with Flutterwave
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${env.payment.secret}`,
        },
      }
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        {
          error: "Unexpected response format from Flutterwave.",
          details: await response.text(),
        },
        { status: 500 }
      );
    }

    const data = await response.json();

    // Step 2: Validate the transaction details
    if (
      !response.ok ||
      data.status !== "success" ||
      data.data.status !== "successful"
    ) {
      return NextResponse.json(
        {
          error: data.message || "Payment verification failed.",
          details: data,
        },
        { status: 400 }
      );
    }

    const { tx_ref, amount, currency, auth_model } = data.data;

    // Ensure the payment amount matches the expected amount
    if (amount !== data.data.amount) {
      return NextResponse.json(
        { error: "Invalid payment amount.", details: { amount } },
        { status: 400 }
      );
    }

    const { databases } = await createAdminClient();

    // Step 3: Fetch the payment record from the database
    const paymentRecord = await databases.listDocuments(db, paymentCollection, [
      Query.equal("tx_ref", tx_ref),
    ]);

    if (!paymentRecord.documents.length) {
      return NextResponse.json(
        { error: "Payment record not found." },
        { status: 404 }
      );
    }

    const payment = paymentRecord.documents[0];

    // Verify requesting user matches the payment customer email
    if (requesting_user_id) {
      const requestingUser = await databases.listDocuments(db, userCollection, [
        Query.equal("user_id", requesting_user_id),
      ]);

      if (requestingUser.documents.length > 0) {
        const user = requestingUser.documents[0];
        if (user.email !== data.data.customer.email) {
          return NextResponse.json(
            {
              error:
                "Unauthorized: requesting user does not match payment customer.",
            },
            { status: 403 }
          );
        }
      }
    }

    // Step 4: Update the payment status
    const updatedPayment = await databases.updateDocument(
      db,
      paymentCollection,
      payment.$id,
      {
        checked: true,
        currency,
        method: auth_model,
        status: "successful",
        user_id: requesting_user_id, // Store user_id with payment for security
      }
    );

    const courseDeatil = await databases.getDocument(
      db,
      courseCollection,
      payment.course_choice
    );

    if (!courseDeatil) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const updateStudent = courseDeatil.students || [];
    const updateStudentEmail = courseDeatil.students_email || [];
    // Add the student to the course
    // Check if the name and email already exist in the arrays
    if (!updateStudent.includes(data.data.customer.name)) {
      updateStudent.push(data.data.customer.name);
    } else {
      throw new Error("Student already exists in the course.");
    }

    if (!updateStudentEmail.includes(data.data.customer.email)) {
      updateStudentEmail.push(data.data.customer.email);
    } else {
      throw new Error("Student email already exists in the course.");
    }

    // Step 5: Unlock the course associated with the payment
    const courseUpdate = await databases.updateDocument(
      db,
      courseCollection,
      payment.course_choice,
      {
        students: updateStudent,
        student_email: updateStudentEmail,
      }
    );

    // Step A: Process referral fee if applicable and update user's paid status
    let updatedUser = null;
    try {
      // Fetch the user who made the payment to get their referral code
      const userQuery = await databases.listDocuments(db, userCollection, [
        Query.equal("email", data.data.customer.email),
      ]);

      if (userQuery.documents.length > 0) {
        const user = userQuery.documents[0];

        // Update the user's paid status to true
        updatedUser = await databases.updateDocument(
          db,
          userCollection,
          user.$id,
          {
            paid: true,
          }
        );

        // If this user was referred by someone (check user's registration data)
        if (user.referral_by) {
          console.log(`User ${user.user_id} was referred by someone.`);
          // Find the referrer and award them a referral fee
          const referrerQuery = await databases.listDocuments(
            db,
            userCollection,
            [
              Query.equal("referral_code", user.referral_by),
              Query.notEqual("user_id", user.user_id),
            ]
          );

          if (referrerQuery.documents.length > 0) {
            const referrer = referrerQuery.documents[0];



            console.log(
              `User ${user.user_id} was referred by ${referrer.user_id}`
            );

            const referralFee = Math.round(amount * 0.1); // 10% referral fee

          console.log(`Converted amount in USD: ${referralFee}`);

            await databases.updateDocument(db, userCollection, referrer.$id, {
              earned_referral_fees: Math.round(Number(referralFee)),
            });
            console.log(
              `Referral fee of ${referralFee} awarded to user ${referrer.user_id}`
            );
          }
        }
      }
    } catch (referralError) {
      // Log the error but don't fail the payment verification
      console.error(
        "Error processing referral fee or updating user:",
        referralError
      );
    }

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      course: courseUpdate,
      transaction: data.data,
      courseUnlocked: true, // Indicate that the course is unlocked
      userUpdated: updatedUser ? true : false, // Indicate whether the user was updated
    });
  } catch (error) {
    console.error("Error during payment verification:", error);
    return NextResponse.json(
      {
        error: "Internal server error during payment verification.",
        details: error,
      },
      { status: 500 }
    );
  }
}


          //   try {
          //   const exchangeResponse = await fetch(
          //     `https://api.exchangerate-api.com/v4/latest/USD`
          //   );
            
          //   if (!exchangeResponse.ok) {
          //     throw new Error("Failed to fetch exchange rate");
          //   }
      
          //   const exchangeData = await exchangeResponse.json();
          //   exchangeRate = exchangeData.rates[currency] || 1;
            
          //   console.log(`Exchange rate for ${currency}: ${exchangeRate}`);
          // } catch (exchangeError) {
          //   console.error("Error fetching exchange rate:", exchangeError);
          //   // Fallback to 1 if exchange rate fetch fails
          //   exchangeRate = 1;
          // }
      
          // // Convert amount to USD
          // const convertedAmount = referralFee / exchangeRate;
      
