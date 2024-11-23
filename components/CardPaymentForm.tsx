"use client";

import React, { useState } from "react";

const CardPaymentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    amount: 10000,
    currency: "UGX",
    tx_ref: `tx_ref_${Math.floor(Math.random() * 1000000)}`,
    email: "",
    card_number: "",
    cvv: "",
    expiry_month: "",
    expiry_year: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/proxy-flutterwave/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "success") {
        if (data.redirect) {
          window.location.href = data.redirect; // Redirect user if needed
        } else {
          setResponseMessage("Payment processed successfully!");
        }
      } else {
        setResponseMessage(data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing payment: ", error);
      setResponseMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border shadow rounded">
      <h2 className="text-xl font-bold mb-4">Card Payment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="card_number"
          value={formData.card_number}
          onChange={handleChange}
          placeholder="Card Number"
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          placeholder="CVV"
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="expiry_month"
          value={formData.expiry_month}
          onChange={handleChange}
          placeholder="Expiry Month (MM)"
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="expiry_year"
          value={formData.expiry_year}
          onChange={handleChange}
          placeholder="Expiry Year (YYYY)"
          className="w-full mb-2 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className={`w-full py-2 mt-2 text-white ${
            loading ? "bg-gray-400" : "bg-blue-500"
          } rounded`}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
      {responseMessage && <p className="mt-4 text-center">{responseMessage}</p>}
    </div>
  );
};

export default CardPaymentForm;
