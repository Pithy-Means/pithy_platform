'use client';

import { useState } from 'react';
import { initiatePayment } from '@/utils/initiaze-payment/mobile-money-ug';

export default function MobileMoney() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('AIRTEL'); // Default to Airtel

  const handlePayment = async () => {
    if (!email || !phoneNumber) {
      alert('Please enter both email and phone number.');
      return;
    }

    setLoading(true);
    const paymentData = {
      amount: 1000000,
      currency: 'UGX',
      tx_ref: `tx_ref_${Math.floor(Math.random() * 1000000)}`,
      email: email,
      phone_number: phoneNumber,
      network: network
    };

    try {
      const res = await initiatePayment(paymentData);
      console.log('Payment response:', res);
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-4 py-2 border rounded w-80"
      />
      <input
        type="text"
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="px-4 py-2 border rounded w-80"
      />
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
        disabled={loading}
      >
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
}
