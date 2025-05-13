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

// Helper function to log important events with timestamps
const logEvent = (message: string, data?: Record<string, unknown>, level: 'INFO' | 'WARNING' | 'ERROR' = 'INFO') => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level,
        messagePrefix: "PAYMENT-VERIFICATION:",
        message,
        data: data || {}
    };
    // console.log(JSON.stringify(logEntry, null, 2)); // For structured logging if preferred
    console.log(`[${logEntry.timestamp}] [${level}] ${logEntry.messagePrefix} ${message}`, data ? JSON.stringify(data) : '');
};

// Helper function to create a structured error object for storing in the database
const createErrorPayload = (step: string, error: Error, context?: object) => {
    return JSON.stringify({
        timestamp: new Date().toISOString(),
        step,
        message: error.message || "An unknown error occurred",
        name: error.name || "Error",
        // code: error.code || null, // Appwrite errors often have a code
        // stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Optionally include stack in dev
        context: context || {},
    });
};

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const transaction_id = searchParams.get("transaction_id");
    const requesting_user_id = searchParams.get("user_id");

    if (!transaction_id) {
        logEvent("Validation Error: Transaction ID missing", { url: req.url }, "ERROR");
        return NextResponse.json(
            { success: false, message: "Transaction ID is required for payment verification." },
            { status: 400 }
        );
    }

    logEvent(`Processing payment verification for Flutterwave transaction: ${transaction_id}`, { requesting_user_id });

    let paymentRecordId: string | null = null; // To store payment.$id if available for general error catch

    try {
        // Step 1: Verify the transaction with Flutterwave
        logEvent("Step 1: Verifying transaction with Flutterwave", { transaction_id });
        const flutterwaveResponse = await fetch(
            `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
            { headers: { Authorization: `Bearer ${env.payment.secret}` } }
        );

        const contentType = flutterwaveResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const responseText = await flutterwaveResponse.text();
            logEvent("Error: Received non-JSON response from Flutterwave", { status: flutterwaveResponse.status, contentType, responseText }, "ERROR");
            // Cannot update payment record here as we don't have tx_ref yet
            return NextResponse.json(
                { success: false, message: "We couldn't verify your payment with the payment provider due to an unexpected response. Please contact support." },
                { status: 502 }
            );
        }

        const flutterwaveData = await flutterwaveResponse.json();
        logEvent("Flutterwave verification API response received", { status: flutterwaveData.status, dataPresent: !!flutterwaveData.data });

        if (!flutterwaveResponse.ok || flutterwaveData.status !== "success" || !flutterwaveData.data || flutterwaveData.data.status !== "successful") {
            logEvent("Error: Payment verification failed with Flutterwave", { flutterwaveResponseStatus: flutterwaveResponse.status, flutterwaveData }, "ERROR");
            // If we have tx_ref, we could try to update our payment record
            const tx_ref_from_error = flutterwaveData?.data?.tx_ref;
            if (tx_ref_from_error) {
                try {
                    const { databases: tempDb } = await createAdminClient();
                    const paymentQuery = await tempDb.listDocuments(db, paymentCollection, [Query.equal("tx_ref", tx_ref_from_error), Query.limit(1000)]);
                    if (paymentQuery.documents.length > 0) {
                        await tempDb.updateDocument(db, paymentCollection, paymentQuery.documents[0].$id, {
                            status: "flutterwave_declined",
                            error_details: createErrorPayload("FLUTTERWAVE_VERIFY_FAIL", new Error(flutterwaveData.message || "Flutterwave payment not successful")),
                            checked: true, // Mark as checked since we attempted verification
                            flutterwave_transaction_id: transaction_id
                        });
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

        const { tx_ref, amount: paidAmount, currency, auth_model } = flutterwaveData.data;
        const customerEmail = flutterwaveData.data.customer.email.toLowerCase().trim();
        const customerName = flutterwaveData.data.customer.name;
        logEvent("Step 1 Success: Flutterwave payment verified", { tx_ref, paidAmount, currency, customerEmail, customerName });

        const { databases } = await createAdminClient();

        // Step 2: Fetch the internal payment record
        logEvent("Step 2: Fetching internal payment record from DB", { tx_ref });
        const paymentRecordQuery = await databases.listDocuments(db, paymentCollection, [Query.equal("tx_ref", tx_ref), Query.limit(1)]);

        if (!paymentRecordQuery.documents.length) {
            logEvent("Error: Internal payment record not found for tx_ref. Flutterwave payment was successful.", { tx_ref, customerEmail }, "ERROR");
            // This is a critical state; payment made but no internal record.
            // Consider creating an orphaned payment record or a high-priority alert.
            return NextResponse.json(
                { success: false, message: "Payment verified, but the initial payment record was not found in our system. Please contact support with your transaction details." },
                { status: 404 }
            );
        }
        const payment = paymentRecordQuery.documents[0];
        paymentRecordId = payment.$id; // Store for general error catch
        logEvent("Step 2 Success: Found internal payment record", { paymentId: payment.$id, courseId: payment.course_choice, currentStatus: payment.status });

        // Amount validation
        if (payment.amount && paidAmount < payment.amount) {
            const errorCtx = { expected: payment.amount, paid: paidAmount, tx_ref, currency };
            logEvent("Error: Payment amount mismatch", errorCtx, "ERROR");
            await databases.updateDocument(db, paymentCollection, payment.$id, {
                status: "amount_mismatch",
                notes: `Flutterwave paid ${paidAmount} ${currency}. Expected ${payment.amount}. FW Tx ID: ${transaction_id}`,
                checked: true,
                flutterwave_transaction_id: transaction_id,
                error_details: createErrorPayload("AMOUNT_VALIDATION", new Error("Paid amount less than expected amount"))
            });
            return NextResponse.json({ success: false, message: "Payment amount mismatch. Please contact support." }, { status: 400 });
        }

        // Step 3: Fetch Course Details
        logEvent("Step 3: Fetching course details", { courseId: payment.course_choice });
        let courseDetail;
        try {
            courseDetail = await databases.getDocument(db, courseCollection, payment.course_choice);
        } catch (courseError: unknown) {
            logEvent("Error: Course not found in DB", { courseId: payment.course_choice, error: courseError }, "ERROR");
            await databases.updateDocument(db, paymentCollection, payment.$id, {
                status: "course_not_found",
                checked: true,
                flutterwave_transaction_id: transaction_id,
                notes: `Course ID ${payment.course_choice} not found. FW Tx ID: ${transaction_id}`,
                error_details: createErrorPayload("FETCH_COURSE", courseError instanceof Error ? courseError : new Error("Course associated with payment not found"), { courseId: payment.course_choice })
            });
            return NextResponse.json({ success: false, message: "Course associated with payment not found. Contact support." }, { status: 404 });
        }
        logEvent("Step 3 Success: Course details fetched", { courseName: courseDetail.name });

        // Step 4: Idempotency Check & Course Enrollment Verification (Self-Healing)
        if (payment.status === "successful" && payment.checked === true) {
            // ... (self-healing logic remains largely the same, no new error storage here unless self-heal itself fails)
             logEvent("Step 4: Payment record already marked 'successful' and 'checked'. Verifying enrollment...", { paymentId: payment.$id });
            const isEnrolledByName = courseDetail.students && Array.isArray(courseDetail.students) && courseDetail.students.includes(customerName);
            const isEnrolledByEmail = courseDetail.students_email && Array.isArray(courseDetail.students_email) && courseDetail.students_email.includes(customerEmail);

            if (isEnrolledByName && isEnrolledByEmail) {
                logEvent("User confirmed to be already enrolled in course.", { courseId: payment.course_choice, customerEmail });
                 try { // Ensure user's 'paid' status is also true
                    const userQuery = await databases.listDocuments(db, userCollection, [Query.equal("email", customerEmail), Query.limit(1000)]);
                    if (userQuery.documents.length > 0 && !userQuery.documents[0].paid) {
                        await databases.updateDocument(db, userCollection, userQuery.documents[0].$id, { paid: true });
                        logEvent("Self-heal: Ensured user 'paid' status is true for already processed payment.", { userId: userQuery.documents[0].$id });
                    }
                } catch (userPaidUpdateError: unknown) {
                    logEvent(
                        "Warning: Error during self-heal of user 'paid' status",
                        {
                            customerEmail,
                            error: userPaidUpdateError instanceof Error ? userPaidUpdateError.message : String(userPaidUpdateError),
                        },
                        "WARNING"
                    );
                }
                return NextResponse.json({
                    success: true,
                    message: "Payment was already processed, and your access to the course is confirmed.",
                    courseUnlocked: true,
                });
            } else {
                logEvent("Warning: Payment record was 'successful', but user not fully enrolled in course. Proceeding to re-attempt enrollment.", { courseId: payment.course_choice, isEnrolledByName, isEnrolledByEmail }, "WARNING");
            }
        }


        // Step 5: CRITICAL - Enroll User in Course
        logEvent("Step 5: Attempting to enroll student in course", { courseId: payment.course_choice, customerEmail, customerName });
        const currentStudents = Array.isArray(courseDetail.students) ? courseDetail.students : [];
        const currentStudentEmails = Array.isArray(courseDetail.students_email) ? courseDetail.students_email : [];
        let needsCourseUpdate = false;
        const updatedStudents = [...currentStudents];
        const updatedStudentEmails = [...currentStudentEmails];

        if (!currentStudents.includes(customerName)) { updatedStudents.push(customerName); needsCourseUpdate = true; }
        if (!currentStudentEmails.includes(customerEmail)) { updatedStudentEmails.push(customerEmail); needsCourseUpdate = true; }

        if (needsCourseUpdate) {
            try {
                await databases.updateDocument(db, courseCollection, payment.course_choice, { students: updatedStudents, students_email: updatedStudentEmails });
                logEvent("Step 5 Success: Course updated with new student enrollment", { courseId: payment.course_choice });
            } catch (courseUpdateError: unknown) {
                const errorCtx = { courseId: payment.course_choice, customerEmail, attemptedData: { students: updatedStudents, students_email: updatedStudentEmails }};
                if (courseUpdateError instanceof Error) {
                    logEvent("CRITICAL ERROR: Failed to update course with new student", { ...errorCtx, error: courseUpdateError.message }, "ERROR");
                } else {
                    logEvent("CRITICAL ERROR: Failed to update course with new student", { ...errorCtx, error: String(courseUpdateError) }, "ERROR");
                }
                await databases.updateDocument(db, paymentCollection, payment.$id, {
                    status: "enrollment_failed",
                    checked: true,
                    flutterwave_transaction_id: transaction_id, currency, method: auth_model,
                    user_id: payment.user_id || (requesting_user_id || null),
                    error_details: createErrorPayload("COURSE_ENROLLMENT", courseUpdateError as Error, errorCtx),
                    notes: `Enrollment failed. FW Tx ID: ${transaction_id}. Error: ${courseUpdateError instanceof Error ? courseUpdateError.message : 'Unknown error'}`
                });
                return NextResponse.json({ success: false, message: "Payment successful, but critical issue enrolling you. Contact support.", courseUnlocked: false }, { status: 500 });
            }
        } else {
            logEvent("Step 5 Note: No course update needed - student already listed.", { courseId: payment.course_choice });
        }

        // Step 6: Update Internal Payment Record to "successful"
        logEvent("Step 6: Updating internal payment record to successful", { paymentId: payment.$id });
        try {
            await databases.updateDocument(db, paymentCollection, payment.$id, {
                checked: true, status: "successful", currency, method: auth_model,
                user_id: payment.user_id || (requesting_user_id || null),
                flutterwave_transaction_id: transaction_id,
                notes: `Verified ${new Date().toISOString()}. ${payment.notes || ''}`.slice(0, 500), // Max length for notes
                error_details: null // Clear previous errors if successful now
            });
            logEvent("Step 6 Success: Internal payment record updated to successful", { paymentId: payment.$id });
        } catch (paymentUpdateError: unknown) {
            if (paymentUpdateError instanceof Error) {
                logEvent("Warning: Error updating payment record to successful, but course enrollment was successful.", { paymentId: payment.$id, error: paymentUpdateError.message }, "WARNING");
            } else {
                logEvent("Warning: Error updating payment record to successful, but course enrollment was successful.", { paymentId: payment.$id, error: String(paymentUpdateError) }, "WARNING");
            }
            // Don't store this as a primary error_details if course access is fine. Note it in logs.
        }

        // Step 7: Update User's Paid Status and Process Referrals
        // ... (This section remains largely the same, focusing on logging warnings rather than critical errors on payment record)
        // If specific errors occur here that you want admins to see, you could potentially update the user record with an error note.
        // For brevity, I'll skip repeating this unchanged section but ensure its errors are logged as WARNINGS.
        logEvent("Step 7: Processing user 'paid' status update and referrals", { customerEmail });
        try {
            const userQuery = await databases.listDocuments(db, userCollection, [Query.equal("email", customerEmail), Query.limit(1000)]);
            if (userQuery.documents.length > 0) {
                const user = userQuery.documents[0];
                 const userUpdatePayload: Record<string, unknown> = {};
                if (!user.paid) userUpdatePayload.paid = true;

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
          
                      const referralFee = Math.round(paidAmount * 0.1); // 10% referral fee
          
                    console.log(`Converted amount in USD: ${referralFee}`);
          
                      await databases.updateDocument(db, userCollection, referrer.$id, {
                        earned_referral_fees: Math.round(Number(referralFee)),
                      });
                      console.log(
                        `Referral fee of ${referralFee} awarded to user ${referrer.user_id}`
                      );
                    }
                 }
                
                if (Object.keys(userUpdatePayload).length > 0) {
                    await databases.updateDocument(db, userCollection, user.$id, userUpdatePayload);
                    logEvent("User record updated (e.g., paid: true)", { userId: user.$id, updates: userUpdatePayload });
                }
            } else {
                logEvent("Warning: User record not found for customer email.", { customerEmail }, "WARNING");
            }
        } catch (userProcessingError: unknown) {
             if (userProcessingError instanceof Error) {
                 logEvent("Warning: Error during user 'paid' status update or referral processing.", { customerEmail, error: userProcessingError.message }, "WARNING");
             } else {
                 logEvent("Warning: Error during user 'paid' status update or referral processing.", { customerEmail, error: String(userProcessingError) }, "WARNING");
             }
        }


        // Final Success Response
        logEvent("Step 8: Payment verification and enrollment process completed successfully.", { tx_ref, courseId: payment.course_choice });
        return NextResponse.json({
            success: true, message: "Payment successful! You now have access to the course.", courseUnlocked: true,
            paymentId: payment.$id, courseId: payment.course_choice, transactionReference: tx_ref, flutterwaveTransactionId: transaction_id
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            logEvent("CRITICAL UNHANDLED ERROR in main payment verification try-catch block", { error: error.message, stack: error.stack, transaction_id }, "ERROR");
        } else {
            logEvent("CRITICAL UNHANDLED ERROR in main payment verification try-catch block", { error: String(error), transaction_id }, "ERROR");
        }
        if (paymentRecordId) { // If we have a payment record ID, try to mark it with this severe error
            try {
                const { databases } = await createAdminClient(); // Need DB client again
                await databases.updateDocument(db, paymentCollection, paymentRecordId, {
                    status: "system_error",
                    error_details: createErrorPayload("UNHANDLED_EXCEPTION", error as Error, { transaction_id }),
                    notes: `Critical unhandled system error during verification. FW Tx ID: ${transaction_id}`
                });
            } catch (dbUpdateError: unknown) {
                logEvent("Further error trying to log unhandled exception to payment record", { paymentRecordId, dbUpdateError: dbUpdateError instanceof Error ? dbUpdateError.message : String(dbUpdateError) }, "ERROR");
            }
        }
        return NextResponse.json(
            { success: false, message: "An unexpected critical error occurred. Please contact support with your transaction ID." },
            { status: 500 }
        );
    }
}