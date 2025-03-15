"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import InputContact from "@/components/InputContact";
import { sendContactEmail } from "@/lib/store/emailService";

interface ContactFormProps {
  setResponseMessage: (message: string) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ setResponseMessage }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = { name, email, phone, message };

    try {
      const success = await sendContactEmail(formData);
      
      if (success) {
        setResponseMessage("Email sent successfully!");
      } else {
        setResponseMessage("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending form:", error);
      setResponseMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <Card className="bg-white py-20 px-6 h-fit w-full">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <InputContact
          label="Name"
          type="text"
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputContact
          label="Email"
          type="email"
          className="w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputContact
          label="Phone Number"
          type="tel"
          className="w-full"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <InputContact
          label="Message"
          isTextarea={true}
          className="w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-[#5AC35A] text-white p-2 rounded-lg w-fit mx-auto md:w-52 md:text-lg lg:w-72 lg:text-2xl flex justify-center text-center"
          disabled={loading}
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>
    </Card>
  );
};

export default ContactForm;