/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useLoggedInUser } from "@/lib/hooks/useLoggedInUser";
import { PaymentStatusModal } from "./PaymentSuccessful";
import { generateValidId } from "@/lib/utils";
import usePayment from "@/lib/hooks/usePayment";
import { useRouter, useSearchParams } from "next/navigation";

export default function MobileMoney() {
  const [loading, setLoading] = useState(false);
  const { user } = useLoggedInUser();
  const [network, setNetwork] = useState("AIRTEL"); // Default to Airtel
  const { initiatePayment } = usePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    status: 'idle' | 'success' | 'failed';
    details: string | null;
    message: string;
  }>({
    status: "idle",
    details: null,
    message: "",
  });
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    if (!user) {
      console.log("User not logged in");
      setLoading(false);
      return;
    }

    const paymentData = {
      amount: 10000,
      currency: "UGX",
      tx_ref: `tx_ref_${generateValidId()}`,
      email: user?.email || "",
      phone_number: user?.phone || "",
      network: network,
      redirect_url: `${window.location.origin}/payment-status`, // Use current origin
    };

    try {
      const response = await initiatePayment(paymentData);
      if (response && response.status === "success") {
        // Redirect handled by Flutterwave
        console.log("Payment initiated successfully");
        console.log("Redirecting to payment gateway...");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("An error occurred while processing your payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const searchParams = useSearchParams();
  // Check if redirected back from payment
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) {
      // Assume searchParams contains payment status
      if (status === 'success' || status === 'failed' || status === 'idle') {
        setPaymentStatus({
          status,
          details: Array.isArray(searchParams.get('details')) ? searchParams.getAll('details')[0] : searchParams.get('details') || "",
          message: Array.isArray(searchParams.get('message')) ? searchParams.getAll('message')[0] : "",
        });
      }
      setIsModalOpen(true);
    }
  }, [router, searchParams]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4 text-black">
      <select
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        className="px-4 py-2 border rounded w-80"
      >
        <option value="AIRTEL">Airtel</option>
        <option value="MTN">MTN</option>
      </select>
      <button
        className="bg-blue-700 text-white px-6 py-2 shadow-xl rounded"
        onClick={handlePayment}
        disabled={loading} // Disable while loading
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
      {isModalOpen && (
        <PaymentStatusModal 
          status={paymentStatus.status} 
          details={paymentStatus.details} 
          message={paymentStatus.message} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}
