"use client";

import { useCourseStore } from "@/lib/store/courseStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get parameters from URL
  const transaction_id = searchParams.get("transaction_id");
  let course_id = searchParams.get("course_id");

  // Fallback: try to get course_id from sessionStorage if not in URL
  if (!course_id && typeof window !== 'undefined') {
    course_id = sessionStorage.getItem("pending_course_purchase");
    console.log("Retrieved course_id from sessionStorage:", course_id);
  }

  // Debug all URL parameters
  console.log("=== PAYMENT STATUS DEBUG ===");
  console.log("All URL parameters:", Object.fromEntries(searchParams.entries()));
  console.log("Transaction ID:", transaction_id);
  console.log("Course ID from URL:", searchParams.get("course_id"));
  console.log("Course ID final:", course_id);
  console.log("Full URL:", typeof window !== 'undefined' ? window.location.href : 'SSR');
  console.log("SessionStorage course:", typeof window !== 'undefined' ? sessionStorage.getItem("pending_course_purchase") : 'SSR');

  const [message, setMessage] = useState("Processing payment...");
  const [loading, setLoading] = useState<boolean>(true);
  const [messageStyle, setMessageStyle] = useState("text-gray-700");

  // Get the auth store and course store
  const { user, updateUserPaidStatus } = useAuthStore();
  const { setUserCoursePurchase, syncPurchasesFromServer } = useCourseStore();

  useEffect(() => {
    if (!transaction_id) {
      setMessage("Invalid transaction. Missing transaction ID.");
      setMessageStyle("text-red-600 bg-red-50 border border-red-200");
      setLoading(false);
      return;
    }

    // Check for course_id after attempting to get it from sessionStorage
    if (!course_id) {
      setMessage("Warning course ID. Please contact support with your transaction ID: " + transaction_id);
      setMessageStyle("text-yellow-600 bg-yellow-50 border border-yellow-200");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        // Send course_id along with the payment verification request
        const url = `/api/proxy-flutterwave/payment-status?transaction_id=${transaction_id}&course_id=${course_id}`;
        console.log("Verification URL:", url);

        const response = await fetch(url);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Payment verification failed");
        }

        const data = await response.json();
        console.log("Payment verification response:", data);

        if (data.success && data.courseUnlocked) {
          // Ensure we have both course_id and user before proceeding
          if (!course_id || !user?.user_id) {
            console.warn("Missing course ID or user information during payment verification.");
            throw new Error("Missing course ID or user information during payment verification.");
          }

          console.log("=== UNLOCKING COURSE ===");
          console.log("User:", user.user_id);
          console.log("Course:", course_id);

          // Update user's paid status first
          updateUserPaidStatus(true);

          // Mark this course as purchased by this user
          setUserCoursePurchase(user.user_id, course_id, true);

          // Clear the pending purchase from sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem("pending_course_purchase");
          }

          // Sync all purchases from server to ensure consistency
          try {
            await syncPurchasesFromServer(user.user_id);
          } catch (syncError) {
            console.warn("Failed to sync purchases from server:", syncError);
            // Continue anyway as the local purchase was set
          }

          // Verify the course is now marked as purchased
          const courseStore = useCourseStore.getState();
          const isPurchased = courseStore.isCoursePurchased(user.user_id, course_id);
          console.log("Course purchase status after update:", isPurchased);
          console.log("All user purchases:", courseStore.getUserPurchases(user.user_id));

          setMessage("Payment successful! Your course has been unlocked.");
          setMessageStyle("text-green-600 bg-green-50 border border-green-200");

          // Redirect after a delay to allow user to see the message
          setTimeout(() => {
            router.push(`/dashboard`);
          }, 3000); // Reduced from 10000 to 3000 for better UX

        } else if (
          data.error === "Student already exists in the course." ||
          data.error === "Student email already exists in the course."
        ) {
          if (!course_id || !user?.user_id) {
            throw new Error("Missing course ID or user information");
          }

          console.log("=== COURSE ALREADY PURCHASED ===");
          console.log("User:", user.user_id);
          console.log("Course:", course_id);

          // Ensure the course is marked as purchased for this user
          updateUserPaidStatus(true);
          setUserCoursePurchase(user.user_id, course_id, true);

          // Clear the pending purchase from sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem("pending_course_purchase");
          }

          // Sync purchases to ensure consistency
          try {
            await syncPurchasesFromServer(user.user_id);
          } catch (syncError) {
            console.warn("Failed to sync purchases from server:", syncError);
          }

          setMessage("You have already purchased this course. Redirecting to dashboard...");
          setMessageStyle("text-blue-600 bg-blue-50 border border-blue-200");

          // Redirect after a delay
          setTimeout(() => {
            router.push(`/dashboard`);
          }, 3000); // Reduced from 10000 to 3000 for better UX

        } else {
          throw new Error(data.error || "Payment verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage(
          error instanceof Error
            ? error.message
            : "An error occurred while verifying the payment. Please try again later.",
        );
        setMessageStyle(
          "text-red-600 bg-red-50 border border-red-200",
        );
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [
    transaction_id,
    course_id,
    router,
    user,
    setUserCoursePurchase,
    syncPurchasesFromServer,
    updateUserPaidStatus,
  ]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`max-w-md p-6 rounded-lg shadow-md ${messageStyle} transition duration-300`}
      >
        <h1 className="text-xl font-semibold mb-2">Payment Status</h1>
        <p className="text-sm mb-4">{message}</p>

        {/* Debug info for development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs bg-gray-100 p-2 rounded mb-4">
            <p>Debug Info:</p>
            <p>Transaction: {transaction_id}</p>
            <p>Course ID: {course_id}</p>
            <p>User: {user?.user_id}</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          </div>
        )}

        {!loading && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
            >
              Go to Dashboard
            </button>
            {!course_id && (
              <button
                onClick={() => router.push("/courses")}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition duration-200"
              >
                Browse Courses
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;