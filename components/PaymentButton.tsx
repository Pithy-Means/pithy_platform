"use client";

import { useContext, useState } from "react";
import { Button } from "./ui/button";
import { UserContext } from "@/context/UserContext";

const PaymentButton = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  console.log("User", user);

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
          email: user?.email,
          name: `${user?.lastname} ${user?.firstname}`,
        }),
      });

      const data = await response.json();
      console.log("payemnt Link", data);
      if (response.ok) {
        window.location.href = data.link; // Redirect to Flutterwave payment link
      } else {
        console.error("Payment initiation failed:", data);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Button
        className="bg-[#5AC35A] text-white px-4 py-2 rounded-lg"
        onClick={initiatePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
};

export default PaymentButton;
