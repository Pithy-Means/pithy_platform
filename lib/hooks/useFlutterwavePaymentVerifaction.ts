"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export const useFlutterwavePaymentVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{
    status: 'idle' | 'success' | 'failed';
    details?: any;
    message?: string;
  }>({ status: 'idle' });

  const params = useParams(); // Use params for dynamic route segments

  /**
   * Function to verify payment
   * @param {string or string[]} tx_ref - The transaction reference
   * @param {string or string[]} status - The status of the payment
   */
  const verifyPayment = async (tx_ref: string | string[], status: string | string[]) => {
    if (!tx_ref || !status) {
      console.error('Missing tx_ref or status for verification');
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`/api/proxy-flutterwave/verify-payment/${tx_ref}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPaymentStatus({
          status: 'success',
          details: data.data,
          message: data.message
        });
      } else {
        setPaymentStatus({
          status: 'failed',
          message: data.message || 'Payment verification failed'
        });
      }
    } catch (error) {
      setPaymentStatus({
        status: 'failed',
        message: 'An error occurred during verification'
      });
      console.log('Error verification', error)
    } finally {
      setIsVerifying(false);
    }
  };

  // Automatically verify when page loads if params exist
  useEffect(() => {
    const tx_ref = params?.tx_ref; // Safe optional chaining
    const status = params?.status; // Safe optional chaining

    // Only proceed if we have a transaction reference and a status
    if (tx_ref && status) {
      verifyPayment(tx_ref, status);
    }
  }, [params]); // Ensure useEffect runs when params change

  return {
    isVerifying,
    paymentStatus,
    verifyPayment, // Return verifyPayment for manual retries
    retryVerification: () => {
      // Retry verification if it fails
      const tx_ref = params?.tx_ref; 
      const status = params?.status;
      if (tx_ref && status) verifyPayment(tx_ref, status);
    }
  };
};
