"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Fix the unknow data type
interface VerificationResponse {
  status: string;
  message: string;
  data?: unknown;
}

export default function VerifyPayment() {
  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );
  const router = useRouter();
  const { tx_ref } = router.query;

  const verifyTransaction = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy-flutterwave/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tx_ref }),
      });

      const data: VerificationResponse = await res.json();
      if (data.status === "success") {
        setVerificationStatus("Payment verified successfully");
        // Redirect to course or success page
        router.push("/course");
      } else {
        setVerificationStatus("Payment verification failed or pending");
      }
    } catch (error) {
      console.error("Error verifying transaction:", error);
      setVerificationStatus("An error occurred during verification");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tx_ref) verifyTransaction();
  }, [tx_ref]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <p>{loading ? "Verifying payment..." : verificationStatus}</p>
    </div>
  );
}
