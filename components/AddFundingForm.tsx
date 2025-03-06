"use client";

import { createFunding } from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Funding, UserInfo } from "@/types/schema";
import React, { useState } from "react";

const FundingForm = () => {
  // Access the user context to get user information
  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  // Initialize the form with the user_id populated from the context
  const [formData, setFormData] = useState<Funding>({
    funding_id: "",
    user_id: user ? user?.user_id : "", // Use the user_id from the context if available
    title: "",
    donor: "",
    eligibre_countries: "",
    focus_earlier: "",
    grant_size: "",
    funding_type: "",
    closing_date: new Date().toISOString().split("T")[0],
    reference_link: "",
  });

  // If there's no user, show an error or message (optional)
  if (!user) {
    return <p>Please log in to create funding.</p>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState: Funding) => ({
      ...prevState,
      [name]: name === "closing_date" ? new Date(value).toISOString().split('T')[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call the createFunding function to send data to the backend
      const result = await createFunding(formData);
      console.log("Funding created:", result);
      if (result) {
        setFormData({
          funding_id: "",
          user_id: user ? user?.user_id : "", // Use the user_id from the context if available
          title: "",
          donor: "",
          eligibre_countries: "",
          focus_earlier: "",
          grant_size: "",
          funding_type: "",
          closing_date: "",
          reference_link: "",
        })
      }
      // Optionally, reset the form or show a success message
    } catch (error) {
      console.error("Error creating funding:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 w-full text-black">
      <h2 className="text-xl font-semibold">Create Funding</h2>
      {/* Other fields like Title, Donor Name, etc. */}
      {/* Title */}
      <div className="form-group">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      {/* Donor Name */}
      <div className="form-group">
        <label htmlFor="donor" className="block">
          Donor Name
        </label>
        <input
          type="text"
          id="donor"
          name="donor"
          value={formData.donor || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      {/* Eligibre Countries */}
      <div className="form-group">
        <label htmlFor="eligibre_countries" className="block">
          Eligibre Countries
        </label>
        <input
          type="text"
          id="eligibre_countries"
          name="eligibre_countries"
          value={formData.eligibre_countries || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      <div className="form-group">
        <label htmlFor="focus_earlier" className="block">
          Focus Area
        </label>
        <select
          name="focus_earlier"
          id="focus_earlier"
          onChange={handleChange}
          value={formData.focus_earlier || ""}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        >
          <option value="">Select Focus Earlier</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="environment">Environment</option>
          <option value="technology">Technology</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="grant_size" className="block">
          Grant Size
        </label>
        <select
          name="grant_size"
          id="grant_size"
          onChange={handleChange}
          value={formData.grant_size || ""}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        >
          <option value="">Select Grant Size</option>
          <option value="Up to $1000">Up to $1000</option>
          <option value="$1000 - $5000">$1000 - $5000</option>
          <option value="$5000 - $10000">$5000 - $10000</option>
          <option value="More than $10000">More than $10000</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="type" className="block">
          Type
        </label>
        <select
          name="funding_type"
          id="funding_type"
          onChange={handleChange}
          value={formData.funding_type || ""}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        >
          <option value="">Select Funding Type</option>
          <option value="fund">Fund</option>
          <option value="donation">Donation</option>
          <option value="grant">Grant</option>
          <option value="scholarship">Scholarship</option>
          <option value="fellowship">Fellowship</option>
          <option value="award">Award</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="closing_date" className="block">
          Closing Date
        </label>
        <input
          type="date"
          id="closing_date"
          name="closing_date"
          value={formData.closing_date ? formData.closing_date.split("T")[0] : ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>

      <div className="form-group">
        <label htmlFor="reference_link" className="block">
          Reference Link
        </label>
        <input
          type="url"
          id="reference_link"
          name="reference_link"
          value={formData.reference_link || ""}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md text-black"
        />
      </div>
      {/* Submit Button */}
      <div className="form-group">
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-md"
        >
          Submit Funding
        </button>
      </div>
    </form>
  );
};

export default FundingForm;
