import { courseCollection, db, paymentCollection } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import env from "@/env";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const transaction_id = searchParams.get("transaction_id");

  if (!transaction_id) {
    return NextResponse.json({ error: "Transaction reference (transaction_id) is required." }, { status: 400 });
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
        { error: "Unexpected response format from Flutterwave.", details: await response.text() },
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
        { error: data.message || "Payment verification failed.", details: data },
        { status: 400 }
      );
    }

    const { tx_ref, amount, currency, auth_model } = data.data;

    // Ensure the payment amount matches the expected amount (10000 in your case)
    if (amount !== 20000) {
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
      return NextResponse.json({ error: "Payment record not found." }, { status: 404 });
    }

    const payment = paymentRecord.documents[0];

    // Step 4: Update the payment status
    const updatedPayment = await databases.updateDocument(db, paymentCollection, payment.$id, {
      checked: true,
      currency,
      method: auth_model,
      status: "successful",
    });

    const courseDeatil = await databases.getDocument(db, courseCollection, payment.course_choice);

    if (!courseDeatil) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    const updateStudent = courseDeatil.students || [];
    const updateStudentEmail = courseDeatil.students_email || [];
    console.log("Update Student:", updateStudent);
    console.log("Update Student Email:", updateStudentEmail);

    // Add the student to the course
    updateStudent.push(data.data.customer.name);
    updateStudentEmail.push(data.data.customer.email);
    console.log("Update Student:", updateStudent);
    console.log("Update Student Email:", updateStudentEmail);

    // Step 5: Unlock the course associated with the payment
    const courseUpdate = await databases.updateDocument(db, courseCollection, payment.course_choice, {
      students: updateStudent,
      student_email: updateStudentEmail,
    });

    // Log and respond with success
    console.log("Updated Payment:", updatedPayment);
    console.log("Updated Course:", courseUpdate);

    return NextResponse.json({
      success: true,
      payment: updatedPayment,
      course: courseUpdate,
      transaction: data.data,
    });
  } catch (error) {
    console.error("Error during payment verification:", error);
    return NextResponse.json(
      { error: "Internal server error during payment verification.", details: error },
      { status: 500 }
    );
  }
}
