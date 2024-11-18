'use client';

import { useState } from 'react';
import { initiatePayment } from '@/utils/initiaze-payment/mobile-money-ug';
import Modal from '@/components/Modal';

export default function MobileMoney() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [network, setNetwork] = useState('AIRTEL'); // Default to Airtel
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const handlePayment = async () => {
    if (!email || !phoneNumber) {
      alert('Please enter both email and phone number.');
      return;
    }
  
    setLoading(true);
    setIsModalOpen(true);
    setModalContent(<p>Processing payment...</p>);
  
    const paymentData = {
      amount: 1000000,
      currency: 'UGX',
      tx_ref: `tx_ref_${Math.floor(Math.random() * 1000000)}`,
      email: email,
      phone_number: phoneNumber,
      network: network,
    };
  
    try {
      const res = await initiatePayment(paymentData);
  
      if (res.status === "success" && res.redirect) {
        const proxyUrl = `/api/proxy-flutterwave/fetch-redirect-content?url=${encodeURIComponent(
          res.redirect
        )}`;
  
        const redirectContent = await fetch(proxyUrl).then((response) =>
          response.text()
        );
  
        setModalContent(
          <div className="overflow-auto max-h-[80vh] p-4">
            <h2 className="text-lg font-bold mb-2">Payment Page</h2>
            <div
              className="border p-4 bg-gray-100"
              dangerouslySetInnerHTML={{ __html: redirectContent }}
            ></div>
          </div>
        );
      } else {
        setModalContent(<p>Payment initiation failed. Please try again.</p>);
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setModalContent(<p>Something went wrong. Please try again later.</p>);
    } finally {
      setLoading(false);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
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

      <Modal isOpen={isModalOpen} content={modalContent} onClose={closeModal} />
    </div>
  );
}
