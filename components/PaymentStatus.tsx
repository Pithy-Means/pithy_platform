"use client";

import React from 'react';

const PaymentStatus = ({ status, message }: { status: string, message: string }) => {
  return (
    <div className={`p-4 rounded-lg ${status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
      <h2 className="text-white text-center">
        {status === 'success' ? 'Payment Successful' : 'Payment Failed'}
      </h2>
      {message && <p className="text-white mt-2 text-center">{message}</p>}
    </div>
  );
};

export default PaymentStatus;
