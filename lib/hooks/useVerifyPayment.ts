"use client";

import { VerifyPaymentResponse } from '@/types/schema';
import { useState, useCallback } from 'react';



const useVerifyPayment = () => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationResponse, setVerificationResponse] = useState<VerifyPaymentResponse | null>(null);

  const verifyPayment = useCallback(async (tx_ref: string) => {
    setIsVerifying(true);
    setVerificationError(null);

    try {
      const response = await fetch(`/api/proxy-flutterwave/verify-payment?tx_ref=${tx_ref}`);
      console.log("Response data: ", response);
      const result: VerifyPaymentResponse = await response.json();
      console.log("Result data: ", result);
      
      if (response.ok) {
        console.log("Payment verification successful: ", result);
        setVerificationResponse(result);
      } else {
        setVerificationError(result.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error("Error verifying payment: ", error);
      setVerificationError("Payment verification failed: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return {
    isVerifying,
    verificationError,
    verificationResponse,
    verifyPayment,
  };
};

export default useVerifyPayment;
