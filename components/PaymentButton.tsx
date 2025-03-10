/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Courses, PaymentData, UserInfo } from "@/types/schema";
import { FaArrowRight } from "react-icons/fa";
import { useAuthStore } from "@/lib/store/useAuthStore";
import countries from "@/types/countries"; // Assuming you have a list of countries and their currencies

type PaymentButtonProps = {
  course: Partial<Courses>;
};

const PaymentButton: React.FC<PaymentButtonProps> = ({ course }) => {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  const [formData, setFormData] = useState<Partial<PaymentData>>({
    user_id: user?.user_id,
    email: user?.email,
    course_choice: course.course_id,
    amount: 6, // Starting amount in USD
    tx_ref: "",
    currency: "USD", // Default currency
  });
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [exchangeRate, setExchangeRate] = useState(1); // Exchange rate for selected country currency

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        if (!response.ok) throw new Error("Failed to fetch exchange rate");

        const data = await response.json();
        setExchangeRate(data.rates[selectedCountry.currency] || 1);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, [selectedCountry]);

  const initiatePayment = async () => {
    setLoading(true);
    try {
      const amountInSelectedCurrency = Math.floor((formData.amount || 6) * exchangeRate); // Convert USD to selected currency and round down to nearest integer
      console.log("Amount in selected currency:", amountInSelectedCurrency);

      const tx_ref = `${Date.now()}-${formData.user_id}-${formData.course_choice}`;

      const response = await fetch("/api/proxy-flutterwave/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tx_ref: tx_ref,
          amount: amountInSelectedCurrency,
          currency: selectedCountry.currency,
          email: user?.email,
          name: `${user?.lastname} ${user?.firstname}`,
        }),
      });

      const data = await response.json();

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
    <form
      onSubmit={initiatePayment}
      className="flex flex-col space-y-6 p-10 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-3xl shadow-2xl hover:shadow-3xl transform transition-all duration-500 ease-in-out hover:scale-105 w-full backdrop-blur-lg"
    >
      {/* Course Details */}
      {course.title ? (
        <div className="flex flex-col space-y-6 text-white p-6 bg-gradient-to-t from-green-700 via-green-800 to-green-900 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-300 ease-in-out">
          <div className="flex items-center space-x-4">
            <span className="text-lg font-semibold">{course.title}</span>
          </div>
        </div>
      ) : (
        <p className="text-white">Course details are currently unavailable.</p>
      )}

      {/* Currency Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Currency:</label>
        <select
          value={selectedCountry.code}
          onChange={(e) => {
            const country = countries.find((c) => c.code === e.target.value);
            if (country) {
              setSelectedCountry(country);
            }
          }}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
        >
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.flag} {country.name} ({country.currency})
            </option>
          ))}
        </select>
      </div>

      {/* Display Converted Amount */}
      <div className="flex items-center space-x-4">
        <span className="text-lg font-semibold text-yellow-300">
          {selectedCountry.currency} {((formData.amount || 6) * exchangeRate).toFixed(2)}
        </span>
      </div>

      {/* Payment Button */}
      <Button
        className="flex items-center justify-between bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white text-lg font-semibold py-4 px-8 rounded-xl transform transition-all duration-300 ease-in-out hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
        onClick={initiatePayment}
        disabled={loading}
      >
        <span>{loading ? "Processing..." : "Pay Now"}</span>
        {!loading && <FaArrowRight className="ml-3 text-xl animate-pulse" />}
      </Button>

      {/* Terms and Conditions */}
      <div className="text-sm text-white/80 text-center">
        <p>
          By proceeding, you agree to our{" "}
          <a href="#" className="text-indigo-200 hover:underline">
            terms and conditions
          </a>.
        </p>
      </div>

      {/* Floating Tooltip (Micro Interaction) */}
      {loading && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white bg-black/60 px-4 py-2 rounded-lg shadow-xl">
          <span className="text-lg font-semibold">Processing payment...</span>
        </div>
      )}

      {/* Additional Micro Interaction with Payment Status */}
      {loading ? (
        <div className="absolute bottom-4 right-4 p-4 bg-gradient-to-r from-green-500 via-green-600 to-green-700 rounded-full shadow-2xl transform transition-all hover:scale-110">
          <div className="animate-bounce text-white font-bold">Loading...</div>
        </div>
      ) : null}
    </form>
  );
};

export default PaymentButton;
