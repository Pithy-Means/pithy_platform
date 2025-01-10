/* eslint-disable @typescript-eslint/no-explicit-any */
// Companion Modal Component
import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PaymentStatusModalProps {
  status: 'idle' | 'success' | 'failed';
  details?: any;
  message?: string;
  onClose: () => void;
}

export const PaymentStatusModal: React.FC<PaymentStatusModalProps> = ({
  status,
  details,
  message,
  onClose
}) => {
  if (status === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        {status === 'success' ? (
          <div>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Payment Successful
            </h2>
            <div className="mb-4 text-left">
              <p className="text-gray-700">
                <strong>Transaction Reference:</strong> {details?.tx_ref}
              </p>
              <p className="text-gray-700">
                <strong>Amount:</strong> {details?.amount} {details?.currency}
              </p>
              <p className="text-gray-700">
                <strong>Date:</strong> {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              <XCircle size={64} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Payment Failed
            </h2>
            <p className="text-gray-700 mb-4">{message}</p>
          </div>
        )}
        <button 
          onClick={onClose}
          className={`
            px-6 py-2 rounded-md transition-colors
            ${status === 'success' 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-red-500 hover:bg-red-600 text-white'}
          `}
        >
          Close
        </button>
      </div>
    </div>
  );
};