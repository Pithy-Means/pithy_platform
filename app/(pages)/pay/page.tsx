"use client"

import { useState } from "react";

const PaymentButton = () => {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/proxy-flutterwave/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: Date.now().toString(),
          amount: 10000,
          email: "bandonkeyea@gmail.com",
          name: "Arnaud Bandonkeye",
        }),
      });

      const paymentLink = await response.json();
      console.log("payemnt Link", paymentLink)
      if (response.ok) {
        window.location.href = paymentLink; // Redirect to Flutterwave payment link
      } else {
        console.error("Payment initiation failed:", paymentLink);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button className="bg-white text-black px-4 py-2" onClick={initiatePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentButton;
