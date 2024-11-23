import React from 'react';
import Image from 'next/image';

const PaymentForm: React.FC = () => {
  return (
    <div className="bg-[#F7F7F7] py-10 text-black">
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-xl font-bold text-center mb-2">Payment Details</h1>
        <p className="text-center text-gray-600 mb-4">
          To Access The Full Services Offered By Pithy Means, Note That Will Be
          Charged $50, To Have Pass Any Test
          To Access The Full Services Offered By Pithy Means, Note That Will Be Charged
          $50, To Have Pass Any Test
        </p>

        {/* Product Card */}
        <div className="border-2 border-green-300 p-4 rounded-md mb-2 flex items-center">
          <div className="w-16 h-16 bg-gray-300 rounded mr-4"></div>
          <div>
            <h2 className="font-semibold">Pithy Means Modules</h2>
            <p className="text-sm text-gray-600">
              For Career Path Discovery, Career Changes, Subsd Businesses
              Venture
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-bold">UGX 190.000</p>
            <p className="text-sm text-black">One-Time Payment</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
          <div>
            <label className="block mb-1 font-medium">Name*</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Arnaud Bandoyake"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Expiry*</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="08 / 2030"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Card number*</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Arnaud Bandoyake"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">CVV*</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="***"
            />
          </div>
        </div>

        {/* Email Radio Buttons */}
        <div className="mb-2">
          <label className="block mb-1 font-medium">Send To</label>
          <div className="flex items-center mb-2">
            <input
              type="radio"
              name="emailOption"
              className="mr-2"
              id="account-email"
            />
            <label htmlFor="account-email">Send To My Account Email</label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              name="emailOption"
              className="mr-2"
              id="alternative-email"
              defaultChecked
            />
            <label htmlFor="alternative-email">
              Send To Alternative Account Email
            </label>
          </div>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
            placeholder="RobinBandoyake@gmail.com"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-2">
          <label className="block mb-1 font-medium">Payment Method</label>
          <div className="flex space-x-4">
            <div className="p-2 border border-green-500 rounded-xl">
              <Image
                src="/assets/visa.png"
                alt="Visa"
                width={40}
                height={40}
                className="h-12" />
            </div>
            <div className="p-2 border border-green-500 rounded-xl">
              <Image
                src="/assets/airtel.png"
                alt="Airtel"
                width={40}
                height={40}
                className="h-12"
              />
            </div>
            <div className="p-2 border border-green-500 rounded-xl">
              <Image
                src="/assets/mtn.png"
                alt="Mastercard"
                width={40}
                height={40}
                className="h-12"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition">
            Proceed
          </button>
          <button className="text-gray-500">Skip</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
