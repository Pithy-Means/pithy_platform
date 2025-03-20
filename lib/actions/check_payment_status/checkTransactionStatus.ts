import { courseCollection, db, paymentCollection } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { Query } from "node-appwrite";
import env from "@/env";

export async function checkTransactionStatus(transaction_id: string) {
  if (!transaction_id) {
    throw new Error("Transaction reference (transaction_id) is required.");
  }

  try {
    // Verify the transaction with Flutterwave
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${env.payment.secret}`,
        },
      },
    );

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Unexpected response format from Flutterwave.");
    }

    const data = await response.json();

    if (
      !response.ok ||
      data.status !== "success" ||
      data.data.status !== "successful"
    ) {
      throw new Error(data.message || "Payment verification failed.");
    }

    const { tx_ref, amount, currency, auth_model } = data.data;

    if (amount !== 20000) {
      throw new Error("Invalid payment amount.");
    }

    const { databases } = await createAdminClient();

    // Fetch the payment record from the database
    const paymentRecord = await databases.listDocuments(db, paymentCollection, [
      Query.equal("tx_ref", tx_ref),
    ]);

    if (!paymentRecord.documents.length) {
      throw new Error("Payment record not found.");
    }

    const payment = paymentRecord.documents[0];

    // Update the payment status
    const updatedPayment = await databases.updateDocument(
      db,
      paymentCollection,
      payment.$id,
      {
        checked: true,
        currency,
        method: auth_model,
        status: "successful",
      },
    );

    const courseDetail = await databases.getDocument(
      db,
      courseCollection,
      payment.course_choice,
    );

    if (!courseDetail) {
      throw new Error("Course not found.");
    }

    const updateStudent = courseDetail.students || [];
    const updateStudentEmail = courseDetail.students_email || [];

    updateStudent.push(data.data.customer.name);
    updateStudentEmail.push(data.data.customer.email);

    // Unlock the course associated with the payment
    const courseUpdate = await databases.updateDocument(
      db,
      courseCollection,
      payment.course_choice,
      {
        students: updateStudent,
        student_email: updateStudentEmail,
      },
    );

    return {
      success: true,
      payment: updatedPayment,
      course: courseUpdate,
      transaction: data.data,
    };
  } catch (error) {
    console.error("Error during payment verification:", error);
    throw error;
  }
}
