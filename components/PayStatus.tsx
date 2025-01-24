"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { useCourseStore } from "@/lib/store/courseStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserInfo } from "@/types/schema";

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const transaction_id = searchParams.get("transaction_id");
  const status = searchParams.get("status");
  const [message, setMessage] = useState("Processing payment...");
  const [loading, setLoading] = useState<boolean>(false);
  const [messageStyle, setMessageStyle] = useState("text-gray-700");
  const router = useRouter();
  // Get user info from the store
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  // Get the setLocked function from the store
  const { setLocked } = useCourseStore();

  useEffect(() => {
    if (status) {
      const verifyPayment = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            `/api/proxy-flutterwave/payment-status?transaction_id=${transaction_id}`
          );
          const data = await response.json();

          if (data.success) {

            const userName = `${user?.lastname} ${user?.firstname}`;
            const isStudent = data.course.students.includes(userName) && data.course.student_email.includes(user?.email);

            if (isStudent) {

              setMessage("You have already purchased this course.");
              setMessageStyle(
                "text-green-600 bg-green-50 border border-green-200"
              );

              setLocked(false);

              // Redirect after a slight delay
              setTimeout(() => {
                router.push("/dashboard/courses");
              }, 2000);
            } 
          } else {
            setMessage("Payment failed. Please try again.");
            setMessageStyle("text-red-600 bg-red-50 border border-red-200");
          }
        } catch (error) {
          setMessage(
            "An error occurred while verifying the payment. Please try again later."
          );
          setMessageStyle(
            "text-yellow-600 bg-yellow-50 border border-yellow-200"
          );
          console.error("Verification error:", error);
          setLoading(false);
        } finally {
          setLoading(false);
        }
      };

      verifyPayment();
    }
  }, [transaction_id, status, router, setLocked, user?.lastname, user?.firstname, user?.email]); // Ensure dependencies are up-to-date

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-md p-6 rounded-lg shadow-md text-green-700">
          <h1 className="text-xl font-semibold mb-2">Payment Status</h1>
          <p>Processing payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className={`max-w-md p-6 rounded-lg shadow-md ${messageStyle} transition duration-300`}
      >
        <h1 className="text-xl font-semibold mb-2">Payment Status</h1>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
