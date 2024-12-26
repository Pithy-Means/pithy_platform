"use client";

import { PaymentData, PaymentResponse } from "@/types/schema";
import { useState, useCallback } from "react";

const usePayment = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentResponse, setPaymentResponse] =
    useState<PaymentResponse | null>(null);

  const initiatePayment = useCallback(async (paymentData: PaymentData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('api/proxy-flutterwave/mobile-money', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      console.log("Resposnse data: ", response);

      console.log("Payment data: ", paymentData);

      const result: PaymentResponse = await response.json();
      console.log("Payment response: ", result);

      if (result.status === "success") {
        setPaymentResponse(result);
        if (result.message === "Payment initiated successfully") {
          // Redirect user to the payment page
          window.open(result.redirect, "_blank");
        } else {
          setError("Payment initiation failed: " + result.message);
        }
      }
      return result;
    } catch (error) {
      console.error("Error: ", error);
      setError(
        "Payment initiation failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    paymentResponse,
    initiatePayment,
  };
};

export default usePayment;
