"use client";

import { useCourseStore } from "@/lib/store/courseStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const transaction_id = searchParams.get("transaction_id");
  const course_id = searchParams.get("course_id"); // Make sure you pass course_id in your payment flow
  const [message, setMessage] = useState("Processing payment...");
  const [loading, setLoading] = useState<boolean>(true);
  const [messageStyle, setMessageStyle] = useState("text-gray-700");
  const router = useRouter();
  
  // Get the course store functions
  const { setCourseLockStatus } = useCourseStore();

  useEffect(() => {
    if (!transaction_id) {
      setMessage("Invalid transaction. Missing transaction ID.");
      setMessageStyle("text-red-600 bg-red-50 border border-red-200");
      setLoading(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `/api/proxy-flutterwave/payment-status?transaction_id=${transaction_id}`
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Payment verification failed");
        }
        
        const data = await response.json();

        if (data.success && data.courseUnlocked) {
          setMessage("Payment successful! Your course has been unlocked.");
          setMessageStyle("text-green-600 bg-green-50 border border-green-200");
          
          // Immediately unlock the course using the updated store
          if (course_id) {
            setCourseLockStatus(course_id, false);
          }
          
          // Redirect after a slight delay
          setTimeout(() => {
            router.push("/dashboard/courses");
          }, 2000);
        } else if (data.error === "Student already exists in the course." || 
                  data.error === "Student email already exists in the course.") {
          setMessage("You have already purchased this course.");
          setMessageStyle("text-blue-600 bg-blue-50 border border-blue-200");
          
          // Ensure the course is unlocked
          if (course_id) {
            setCourseLockStatus(course_id, false);
          }
          
          // Redirect after a slight delay
          setTimeout(() => {
            router.push("/dashboard/courses");
          }, 2000);
        } else {
          setMessage(data.error || "Payment verification failed. Please try again.");
          setMessageStyle("text-red-600 bg-red-50 border border-red-200");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setMessage(
          error instanceof Error 
            ? error.message 
            : "An error occurred while verifying the payment. Please try again later."
        );
        setMessageStyle("text-yellow-600 bg-yellow-50 border border-yellow-200");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [transaction_id, course_id, router, setCourseLockStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`max-w-md p-6 rounded-lg shadow-md ${messageStyle} transition duration-300`}
      >
        <h1 className="text-xl font-semibold mb-2">Payment Status</h1>
        <p className="text-sm">{message}</p>
        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;