/* eslint-disable @typescript-eslint/no-explicit-any */
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

// Enhanced logging function with more detailed output
const logEvent = (message: string, data?: Record<string, unknown>, level: 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG' = 'INFO') => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    messagePrefix: "PAYMENT-VERIFICATION:",
    message,
    data: data || {}
  };

  // Always log to console for debugging
  console.log(`[${logEntry.timestamp}] [${level}] ${logEntry.messagePrefix} ${message}`);
  if (data && Object.keys(data).length > 0) {
    console.log('Data:', JSON.stringify(data, null, 2));
  }
  console.log('---'); // Separator for readability
};

// Helper function to create a structured error object for storing in the database
const createErrorPayload = (step: string, error: Error, context?: object) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    step,
    message: error.message || "An unknown error occurred",
    name: error.name || "Error",
    context: context || {},
  });
};

export async function GET(req: Request) {
  const startTime = Date.now();
  const { searchParams } = new URL(req.url);
  const transaction_id = searchParams.get("transaction_id");
  const requesting_user_id = searchParams.get("user_id");

  logEvent("=== PAYMENT VERIFICATION STARTED ===", {
    transaction_id,
    requesting_user_id,
    url: req.url,
    timestamp: new Date().toISOString()
  }, 'DEBUG');

  if (!transaction_id) {
    logEvent("Validation Error: Transaction ID missing", { url: req.url }, "ERROR");
    return NextResponse.json(
      { success: false, message: "Transaction ID is required for payment verification." },
      { status: 400 }
    );
  }

  let paymentRecordId: string | null = null;
  let currentStep = "INITIALIZATION";

  try {
    // Step 1: Verify the transaction with Flutterwave
    currentStep = "FLUTTERWAVE_VERIFICATION";
    logEvent("Step 1: Verifying transaction with Flutterwave", {
      transaction_id,
      flutterwave_url: `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`
    }, 'DEBUG');

    const flutterwaveResponse = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${env.payment.secret}`,
          'Content-Type': 'application/json'
        }
      }
    );

    logEvent("Flutterwave API Response Headers", {
      status: flutterwaveResponse.status,
      statusText: flutterwaveResponse.statusText,
      headers: Object.fromEntries(flutterwaveResponse.headers.entries())
    }, 'DEBUG');

    const contentType = flutterwaveResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await flutterwaveResponse.text();
      logEvent("Error: Received non-JSON response from Flutterwave", {
        status: flutterwaveResponse.status,
        contentType,
        responseText: responseText.substring(0, 500) // Limit response text length
      }, "ERROR");
      return NextResponse.json(
        { success: false, message: "We couldn't verify your payment with the payment provider due to an unexpected response. Please contact support." },
        { status: 502 }
      );
    }

    const flutterwaveData = await flutterwaveResponse.json();
    logEvent("Flutterwave verification API response received", {
      status: flutterwaveData.status,
      dataPresent: !!flutterwaveData.data,
      flutterwaveData: flutterwaveData // Log full response for debugging
    }, 'DEBUG');

    // Enhanced validation with detailed logging
    if (!flutterwaveResponse.ok) {
      logEvent("Flutterwave HTTP Error", {
        httpStatus: flutterwaveResponse.status,
        httpStatusText: flutterwaveResponse.statusText,
        flutterwaveData
      }, "ERROR");
    }

    if (flutterwaveData.status !== "success") {
      logEvent("Flutterwave Status Error", {
        flutterwaveStatus: flutterwaveData.status,
        message: flutterwaveData.message,
        flutterwaveData
      }, "ERROR");
    }

    if (!flutterwaveData.data) {
      logEvent("Flutterwave Data Missing", { flutterwaveData }, "ERROR");
    }

    if (flutterwaveData.data && flutterwaveData.data.status !== "successful") {
      logEvent("Flutterwave Transaction Status Error", {
        transactionStatus: flutterwaveData.data.status,
        flutterwaveData: flutterwaveData.data
      }, "ERROR");
    }

    if (!flutterwaveResponse.ok || flutterwaveData.status !== "success" || !flutterwaveData.data || flutterwaveData.data.status !== "successful") {
      logEvent("Error: Payment verification failed with Flutterwave", {
        flutterwaveResponseStatus: flutterwaveResponse.status,
        flutterwaveData
      }, "ERROR");

      const tx_ref_from_error = flutterwaveData?.data?.tx_ref;
      if (tx_ref_from_error) {
        try {
          const { databases: tempDb } = await createAdminClient();
          const paymentQuery = await tempDb.listDocuments(db, paymentCollection, [Query.equal("tx_ref", tx_ref_from_error), Query.limit(1000)]);
          if (paymentQuery.documents.length > 0) {
            await tempDb.updateDocument(db, paymentCollection, paymentQuery.documents[0].$id, {
              status: "flutterwave_declined",
              error_details: createErrorPayload("FLUTTERWAVE_VERIFY_FAIL", new Error(flutterwaveData.message || "Flutterwave payment not successful")),
              checked: false,
              flutterwave_transaction_id: transaction_id
            });
            logEvent("Updated payment record with Flutterwave decline", { paymentId: paymentQuery.documents[0].$id }, 'DEBUG');
          }
        } catch (dbUpdateError) {
          logEvent("Error updating payment record after Flutterwave decline", { tx_ref_from_error, dbUpdateError }, "ERROR");
        }
      }
      return NextResponse.json(
        { success: false, message: flutterwaveData.message || "Payment verification failed with provider. Please ensure payment was completed or contact support." },
        { status: 400 }
      );
    }

    const { tx_ref, amount: paidAmount, currency, auth_model, custphone: phone_number } = flutterwaveData.data;

    currentStep = "DATABASE_CONNECTION";
    const { databases } = await createAdminClient();
    logEvent("Database client created successfully", {}, 'DEBUG');

    const paymentRecordQuery = await databases.listDocuments(db, paymentCollection, [
      Query.equal("tx_ref", tx_ref),
      Query.limit(1000)
    ]);

    interface PaymentDocument {
      $id: string;
      amount: number;
      course_choice: string;
      status: string;
      checked: boolean;
      email?: string;
      name?: string;
      customer_name?: string;
      user_id?: string;
      notes?: string;
      [key: string]: any; // Add additional fields as needed
    }
    const payment: PaymentDocument = paymentRecordQuery.documents[0] as unknown as PaymentDocument;
    paymentRecordId = payment.$id;

    // Extract customer information ONLY from payment database record
    const customerEmail = payment.email?.toLowerCase().trim();
    const customerName = payment.name?.trim();


    // Find user by email
    // customerEmail is now defined above
    // customerName is also extracted for later use
    logEvent("Step 1 Success: Flutterwave payment verified", {
      tx_ref,
      paidAmount,
      currency,
      customerEmail,
      customerName,
      auth_model,
      phone_number,
      flutterwaveTransactionData: flutterwaveData.data
    }, 'DEBUG');


    // Step 2: Fetch the internal payment record
    currentStep = "FETCH_PAYMENT_RECORD";
    logEvent("Step 2: Fetching internal payment record from DB", { tx_ref }, 'DEBUG');
    // const payment = paymentRecordQuery.documents[0];


    logEvent("Payment record query executed", {
      queryResults: paymentRecordQuery.documents.length,
      tx_ref,
      documents: paymentRecordQuery.documents.map(doc => ({
        id: doc.$id,
        status: doc.status,
        amount: doc.amount,
        course_choice: doc.course_choice,
        checked: doc.checked
      }))
    }, 'DEBUG');

    if (!paymentRecordQuery.documents.length) {
      logEvent("Error: Internal payment record not found for tx_ref. Flutterwave payment was successful.", {
        tx_ref,
        customerEmail,
        searchedCollection: paymentCollection,
        searchedDatabase: db
      }, "ERROR");
      return NextResponse.json(
        { success: false, message: "Payment verified, but the initial payment record was not found in our system. Please contact support with your transaction details." },
        { status: 404 }
      );
    }

    logEvent("Step 2 Success: Found internal payment record", {
      paymentId: payment.$id,
      courseId: payment.course_choice,
      currentStatus: payment.status,
      currentChecked: payment.checked,
      paymentAmount: payment.amount,
      userId: payment.user_id,
      fullPaymentRecord: payment
    }, 'DEBUG');

    // Amount validation
    currentStep = "AMOUNT_VALIDATION";
    if (payment.amount && paidAmount < payment.amount) {
      const errorCtx = { expected: payment.amount, paid: paidAmount, tx_ref, currency };
      logEvent("Error: Payment amount mismatch", errorCtx, "ERROR");
      await databases.updateDocument(db, paymentCollection, payment.$id, {
        status: "amount_mismatch",
        notes: `Flutterwave paid ${paidAmount} ${currency}.Expected ${payment.amount}.FW Tx ID: ${transaction_id}`,
        checked: true,
        flutterwave_transaction_id: transaction_id,
        error_details: createErrorPayload("AMOUNT_VALIDATION", new Error("Paid amount less than expected amount"))
      });
      return NextResponse.json({ success: false, message: "Payment amount mismatch. Please contact support." }, { status: 400 });
    }
    logEvent("Amount validation passed", { expected: payment.amount, paid: paidAmount }, 'DEBUG');

    // Step 3: Fetch Course Details
    currentStep = "FETCH_COURSE_DETAILS";
    logEvent("Step 3: Fetching course details", { courseId: payment.course_choice }, 'DEBUG');
    let courseDetail;
    try {
      courseDetail = await databases.getDocument(db, courseCollection, payment.course_choice);
      logEvent("Course details fetched successfully", {
        courseId: courseDetail.$id,
        courseName: courseDetail.name,
        currentStudentsCount: courseDetail.students?.length || 0,
        currentStudentEmailsCount: courseDetail.student_email?.length || 0,
        courseDetail: courseDetail
      }, 'DEBUG');
    } catch (courseError: unknown) {
      logEvent("Error: Course not found in DB", {
        courseId: payment.course_choice,
        error: courseError,
        collection: courseCollection,
        database: db
      }, "ERROR");
      await databases.updateDocument(db, paymentCollection, payment.$id, {
        status: "course_not_found",
        checked: true,
        flutterwave_transaction_id: transaction_id,
        notes: `Course ID ${payment.course_choice} not found.FW Tx ID: ${transaction_id} `,
        error_details: createErrorPayload("FETCH_COURSE", courseError instanceof Error ? courseError : new Error("Course associated with payment not found"), { courseId: payment.course_choice })
      });
      return NextResponse.json({ success: false, message: "Course associated with payment not found. Contact support." }, { status: 404 });
    }

    // Step 4: Idempotency Check & Course Enrollment Verification
    currentStep = "IDEMPOTENCY_CHECK";
    if (payment.status === "successful" && payment.checked === true) {
      logEvent("Step 4: Payment record already marked 'successful' and 'checked'. Verifying enrollment...", {
        paymentId: payment.$id,
        currentStatus: payment.status,
        currentChecked: payment.checked
      }, 'DEBUG');

      const isEnrolledByName = courseDetail.students && Array.isArray(courseDetail.students) && courseDetail.students.includes(customerName);
      const isEnrolledByEmail = courseDetail.student_email && Array.isArray(courseDetail.student_email) && courseDetail.student_email.includes(customerEmail);

      logEvent("Enrollment verification results", {
        isEnrolledByName,
        isEnrolledByEmail,
        customerName,
        customerEmail,
        currentStudents: courseDetail.students,
        currentStudentEmails: courseDetail.student_email
      }, 'DEBUG');

      if (isEnrolledByName && isEnrolledByEmail) {
        logEvent("User confirmed to be already enrolled in course.", { courseId: payment.course_choice, customerEmail });
        try {
          let userQuery;
          if (customerEmail) {
            userQuery = await databases.listDocuments(db, userCollection, [Query.equal("email", customerEmail), Query.limit(1000)]);
          } else {
            logEvent("Error: customerEmail is undefined, cannot query userCollection", { customerEmail }, "ERROR");
            userQuery = { documents: [] };
          }
          if (userQuery.documents.length > 0 && !userQuery.documents[0].paid) {
            await databases.updateDocument(db, userCollection, userQuery.documents[0].$id, { paid: true });
            logEvent("Self-heal: Ensured user 'paid' status is true for already processed payment.", { userId: userQuery.documents[0].$id });
          }
        } catch (userPaidUpdateError: unknown) {
          logEvent("Warning: Error during self-heal of user 'paid' status", {
            customerEmail,
            error: userPaidUpdateError instanceof Error ? userPaidUpdateError.message : String(userPaidUpdateError),
          }, "WARNING");
        }
        return NextResponse.json({
          success: true,
          message: "Payment was already processed, and your access to the course is confirmed.",
          courseUnlocked: true,
        });
      } else {
        logEvent("Warning: Payment record was 'successful', but user not fully enrolled in course. Proceeding to re-attempt enrollment.", {
          courseId: payment.course_choice,
          isEnrolledByName,
          isEnrolledByEmail
        }, "WARNING");
      }
    }

    // Step 5: CRITICAL - Enroll User in Course
    currentStep = "COURSE_ENROLLMENT";
    logEvent("Step 5: Attempting to enroll student in course", {
      courseId: payment.course_choice,
      customerEmail,
      customerName,
      currentStudents: courseDetail.students,
      currentStudentEmails: courseDetail.student_email
    }, 'DEBUG');

    const currentStudents = Array.isArray(courseDetail.students) ? courseDetail.students : [];
    const currentStudentEmails = Array.isArray(courseDetail.student_email) ? courseDetail.student_email : [];
    let needsCourseUpdate = false;
    const updatedStudents = [...currentStudents];
    const updatedStudentEmails = [...currentStudentEmails];

    if (!currentStudents.includes(customerName)) {
      updatedStudents.push(customerName);
      needsCourseUpdate = true;
      logEvent("Adding customer name to students list", { customerName }, 'DEBUG');
    }
    if (!currentStudentEmails.includes(customerEmail)) {
      updatedStudentEmails.push(customerEmail);
      needsCourseUpdate = true;
      logEvent("Adding customer email to student_email list", { customerEmail }, 'DEBUG');
    }

    logEvent("Course update decision", {
      needsCourseUpdate,
      updatedStudents,
      updatedStudentEmails,
      originalStudentsCount: currentStudents.length,
      originalEmailsCount: currentStudentEmails.length,
      newStudentsCount: updatedStudents.length,
      newEmailsCount: updatedStudentEmails.length
    }, 'DEBUG');

    if (needsCourseUpdate) {
      try {
        const updatePayload = {
          students: updatedStudents,
          student_email: updatedStudentEmails
        };
        logEvent("Attempting to update course with new student enrollment", {
          courseId: payment.course_choice,
          updatePayload
        }, 'DEBUG');

        await databases.updateDocument(db, courseCollection, payment.course_choice, updatePayload);
        logEvent("Step 5 Success: Course updated with new student enrollment", {
          courseId: payment.course_choice,
          studentsAdded: updatedStudents.length - currentStudents.length,
          emailsAdded: updatedStudentEmails.length - currentStudentEmails.length
        }, 'DEBUG');
      } catch (courseUpdateError: unknown) {
        const errorCtx = {
          courseId: payment.course_choice,
          customerEmail,
          attemptedData: { students: updatedStudents, student_email: updatedStudentEmails }
        };
        logEvent("CRITICAL ERROR: Failed to update course with new student", {
          ...errorCtx,
          error: courseUpdateError instanceof Error ? courseUpdateError.message : String(courseUpdateError),
          errorStack: courseUpdateError instanceof Error ? courseUpdateError.stack : undefined
        }, "ERROR");

        await databases.updateDocument(db, paymentCollection, payment.$id, {
          status: "enrollment_failed",
          checked: true,
          flutterwave_transaction_id: transaction_id,
          currency,
          method: auth_model,
          user_id: payment.user_id || (requesting_user_id || null),
          error_details: createErrorPayload("COURSE_ENROLLMENT", courseUpdateError as Error, errorCtx),
          notes: `Enrollment failed.FW Tx ID: ${transaction_id}.Error: ${courseUpdateError instanceof Error ? courseUpdateError.message : 'Unknown error'} `
        });
        return NextResponse.json({
          success: false,
          message: "Payment successful, but critical issue enrolling you. Contact support.",
          courseUnlocked: false
        }, { status: 500 });
      }
    } else {
      logEvent("Step 5 Note: No course update needed - student already listed.", { courseId: payment.course_choice });
    }

    // Step 6: Update Internal Payment Record to "successful"
    currentStep = "UPDATE_PAYMENT_RECORD";
    logEvent("Step 6: Updating internal payment record to successful", { paymentId: payment.$id }, 'DEBUG');
    try {
      const paymentUpdatePayload = {
        checked: true,
        status: "successful",
        currency,
        phone_number,
        method: auth_model,
        user_id: payment.user_id || (requesting_user_id || null),
        flutterwave_transaction_id: transaction_id,
        notes: `Verified ${new Date().toISOString()}. ${payment.notes || ''} `.slice(0, 500),
        error_details: null
      };
      logEvent("Payment update payload", { paymentUpdatePayload }, 'DEBUG');

      await databases.updateDocument(db, paymentCollection, payment.$id, paymentUpdatePayload);
      logEvent("Step 6 Success: Internal payment record updated to successful", { paymentId: payment.$id });
    } catch (paymentUpdateError: unknown) {
      logEvent("Warning: Error updating payment record to successful, but course enrollment was successful.", {
        paymentId: payment.$id,
        error: paymentUpdateError instanceof Error ? paymentUpdateError.message : String(paymentUpdateError)
      }, "WARNING");
    }

    // Step 7: Update User's Paid Status and Process Referrals
    currentStep = "USER_UPDATE_AND_REFERRALS";
    logEvent("Step 7: Processing user 'paid' status update and referrals", { customerEmail }, 'DEBUG');
    try {
      let userQuery;
      if (customerEmail) {
        userQuery = await databases.listDocuments(db, userCollection, [Query.equal("email", customerEmail), Query.limit(1000)]);
      } else {
        logEvent("Error: customerEmail is undefined, cannot query userCollection", { customerEmail }, "ERROR");
        userQuery = { documents: [] };
      }
      const user = userQuery.documents[0];
      const updatePaidStatus = await databases.updateDocument(db, userCollection, user.$id, {
        paid: true,
      });

      logEvent("User 'paid' status updated successfully", {
        userId: user.$id,
        paidStatus: updatePaidStatus.paid,
        previousPaidStatus: user.paid
      }, 'DEBUG');

      // Process referrals if user was referred
      if (user.referral_by) {
        logEvent(`User ${user.user_id
          } was referred by someone.`, { referralCode: user.referral_by }, 'DEBUG');

        const referrerQuery = await databases.listDocuments(
          db,
          userCollection,
          [
            Query.equal("referral_code", user.referral_by),
            Query.notEqual("user_id", user.user_id),
          ]
        );

        logEvent("Referrer query results", {
          referrerCount: referrerQuery.documents.length,
          referrers: referrerQuery.documents.map(r => ({ id: r.$id, user_id: r.user_id, referral_code: r.referral_code }))
        }, 'DEBUG');

        if (referrerQuery.documents.length > 0) {
          const referrer = referrerQuery.documents[0];
          logEvent(`User ${user.user_id} was referred by ${referrer.user_id} `, {
            referrerId: referrer.$id,
            referrerUserId: referrer.user_id
          }, 'DEBUG');

          const referralFee = Math.round(paidAmount * 0.1); // 10% referral fee
          logEvent(`Calculated referral fee: ${referralFee} `, {
            paidAmount,
            referralPercentage: 0.1,
            referralFee
          }, 'DEBUG');

          // Update referrer's earned fees
          const currentEarnedFees = Number(referrer.earned_referral_fees) || 0;
          await databases.updateDocument(db, userCollection, referrer.$id, {
            earned_referral_fees: currentEarnedFees + referralFee,
          });
          logEvent(`Referral fee of ${referralFee} awarded to user ${referrer.user_id} `, {
            referrerId: referrer.$id,
            referralFee,
            previousTotal: currentEarnedFees,
            newTotal: currentEarnedFees + referralFee
          }, 'DEBUG');
        }
      }

      // Only update user if there are changes to make
      if (Object.keys(user).length > 0) {
        logEvent("Updating user record", { userId: user.$id, updates: user }, 'DEBUG');
        const updatedUser = await databases.updateDocument(db, userCollection, user.$id, { paid: true });
        logEvent("User record updated successfully", { userId: user.$id, updates: updatedUser });
      } else {
        logEvent("No user updates needed", { userId: user.$id, currentPaidStatus: user.paid }, 'DEBUG');
      }

    } catch (userProcessingError: unknown) {
      logEvent("Warning: Error during user 'paid' status update or referral processing.", {
        customerEmail,
        error: userProcessingError instanceof Error ? userProcessingError.message : String(userProcessingError),
        errorStack: userProcessingError instanceof Error ? userProcessingError.stack : undefined
      }, "WARNING");
    }

    // Final Success Response
    currentStep = "SUCCESS_RESPONSE";
    const processingTime = Date.now() - startTime;
    logEvent("Step 8: Payment verification and enrollment process completed successfully.", {
      tx_ref,
      courseId: payment.course_choice,
      processingTimeMs: processingTime
    }, 'DEBUG');

    const successResponse = {
      success: true,
      message: "Payment successful! You now have access to the course.",
      courseUnlocked: true,
      paymentId: payment.$id,
      courseId: payment.course_choice,
      transactionReference: tx_ref,
      flutterwaveTransactionId: transaction_id,
      processingTime: `${processingTime} ms`
    };

    logEvent("Returning success response", { successResponse }, 'DEBUG');
    return NextResponse.json(successResponse, { status: 200 });

  } catch (error: unknown) {
    const processingTime = Date.now() - startTime;
    const errorDetails = {
      currentStep,
      transaction_id,
      paymentRecordId,
      processingTimeMs: processingTime,
      error: error instanceof Error ? {
        message: error.message,
        name: error.name,
        stack: error.stack
      } : String(error)
    };

    logEvent("CRITICAL UNHANDLED ERROR in main payment verification try-catch block", errorDetails, "ERROR");

    if (paymentRecordId) {
      try {
        const { databases } = await createAdminClient();
        await databases.updateDocument(db, paymentCollection, paymentRecordId, {
          status: "system_error",
          error_details: createErrorPayload("UNHANDLED_EXCEPTION", error as Error, { transaction_id, currentStep }),
          notes: `Critical unhandled system error during verification at step: ${currentStep}.FW Tx ID: ${transaction_id} `
        });
        logEvent("Updated payment record with system error details", { paymentRecordId, currentStep }, 'DEBUG');
      } catch (dbUpdateError: unknown) {
        logEvent("Further error trying to log unhandled exception to payment record", {
          paymentRecordId,
          dbUpdateError: dbUpdateError instanceof Error ? dbUpdateError.message : String(dbUpdateError)
        }, "ERROR");
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected critical error occurred. Please contact support with your transaction ID.",
        debug: process.env.NODE_ENV === 'development' ? { currentStep, error: errorDetails } : undefined
      },
      { status: 500 }
    );
  }
}