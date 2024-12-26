"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useFlutterwavePaymentVerification } from "@/lib/hooks/useFlutterwavePaymentVerifaction";

const PaymentVerificationPage = () => {
  const { tx_ref, status } = useParams(); // Extract tx_ref and status from URL
  const { isVerifying, paymentStatus, retryVerification } = useFlutterwavePaymentVerification();

  // Log the parameters to ensure they're available
  useEffect(() => {
    console.log('Route params:', { tx_ref, status });
  }, [tx_ref, status]);

  // Show loading state while verifying payment
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-bold">Verifying your payment, please wait...</p>
      </div>
    );
  }

  // Handle success status
  if (paymentStatus.status === 'success') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center bg-green-100 rounded-lg">
          <h1 className="text-2xl font-bold text-green-600">Payment Verified Successfully! ✅</h1>
          <p className="mt-4">Transaction Reference: <strong>{tx_ref}</strong></p>
          <p className="mt-2">Status: <strong>{status}</strong></p>
          <p className="mt-2">Message: {paymentStatus.message}</p>
          {paymentStatus.details && (
            <pre className="mt-4 p-4 bg-white rounded-lg shadow">{JSON.stringify(paymentStatus.details, null, 2)}</pre>
          )}
        </div>
      </div>
    );
  }

  // Handle failed status
  if (paymentStatus.status === 'failed') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-8 text-center bg-red-100 rounded-lg">
          <h1 className="text-2xl font-bold text-red-600">Payment Verification Failed ❌</h1>
          <p className="mt-4">Transaction Reference: <strong>{tx_ref}</strong></p>
          <p className="mt-2">Status: <strong>{status}</strong></p>
          <p className="mt-2">Message: {paymentStatus.message}</p>
          <button
            onClick={retryVerification}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry Verification
          </button>
        </div>
      </div>
    );
  }

  // Handle default idle state (when no verification has been triggered)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 text-center bg-gray-100 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">Waiting for Payment Verification</h1>
        <p className="mt-4">Transaction Reference: <strong>{tx_ref}</strong></p>
        <p className="mt-2">Status: <strong>{status}</strong></p>
      </div>
    </div>
  );
};

export default PaymentVerificationPage;
