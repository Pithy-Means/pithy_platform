"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentStatus = () => {
  const searchParams = useSearchParams();
  const transaction_id = searchParams.get("transaction_id");
  const status = searchParams.get("status");
  const [message, setMessage] = useState("Processing payment...");
  const [messageStyle, setMessageStyle] = useState("text-gray-700");
  const router = useRouter();

  useEffect(() => {
    if (status) {
      const verifyPayment = async () => {
        try {
          const response = await fetch(`/api/proxy-flutterwave/payment-status?transaction_id=${transaction_id}`);
          const data = await response.json();

          console.log("Payment verification data", data);

          if (data.success === true) {
            setMessage("Payment successful! Thank you for your purchase.");
            setMessageStyle("text-green-600 bg-green-50 border border-green-200");
            router.replace("/dashboard/courses");
          } else {
            setMessage("Payment failed. Please try again.");
            setMessageStyle("text-red-600 bg-red-50 border border-red-200");
          }
        } catch (error) {
          setMessage(
            "An error occurred while verifying the payment. Please try again later."
          );
          setMessageStyle("text-yellow-600 bg-yellow-50 border border-yellow-200");
          console.error("Verification error:", error);
        }
      };

      verifyPayment();
    }
  }, [transaction_id, router, status]);

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