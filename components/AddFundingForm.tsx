"use client";

import React, { useState, useEffect } from "react";
import {
  createFunding,
  getFunding,
  updateFunding,
  deleteFunding,
  getFundings,
} from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Funding, UserInfo } from "@/types/schema";

const FundingForm = ({ editingId = "" }) => {
  // Access the user context to get user information
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  const [fundings, setFundings] = useState<Funding[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showForm, setShowForm] = useState(false);

  // Initialize the form with the user_id populated from the context
  const [formData, setFormData] = useState<Funding>({
    funding_id: "",
    user_id: user ? user?.user_id : "",
    title: "",
    donor: "",
    eligibre_countries: "",
    focus_earlier: "",
    grant_size: "",
    funding_type: "",
    closing_date: new Date().toISOString().split("T")[0],
    reference_link: "",
  });

  // Fetch all fundings on component mount
  useEffect(() => {
    loadFundings();
  }, []);

  // If editing ID is provided, load that funding
  useEffect(() => {
    if (!user) return;
    if (editingId) {
      loadFundingDetails(editingId);
      setShowForm(true);
    }
  }, [editingId, user]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
        <p className="text-gray-700 text-lg">
          Please log in to create or manage funding.
        </p>
      </div>
    );
  }

  const loadFundings = async () => {
    setIsLoading(true);
    try {
      const result = await getFundings();
      if (result && Array.isArray(result.documents)) {
        setFundings(result.documents);
      }
    } catch (error) {
      console.error("Error loading fundings:", error);
      setMessage({ text: "Failed to load fundings", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadFundingDetails = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await getFunding(id);
      if (result) {
        setFormData({
          ...result,
          closing_date: result.closing_date
            ? result.closing_date.split("T")[0]
            : new Date().toISOString().split("T")[0],
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error loading funding details:", error);
      setMessage({ text: "Failed to load funding details", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState: Funding) => ({
      ...prevState,
      [name]:
        name === "closing_date"
          ? new Date(value).toISOString().split("T")[0]
          : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      funding_id: "",
      user_id: user ? user?.user_id : "",
      title: "",
      donor: "",
      eligibre_countries: "",
      focus_earlier: "",
      grant_size: "",
      funding_type: "",
      closing_date: new Date().toISOString().split("T")[0],
      reference_link: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let result: Funding;
      if (isEditing) {
        // Update existing funding
        result = await updateFunding(formData.funding_id, formData);
        setMessage({ text: "Funding updated successfully!", type: "success" });

        // Update the funding in the local state
        setFundings((prevFundings) =>
          prevFundings.map((item) =>
            item.funding_id === formData.funding_id ? { ...formData } : item
          )
        );
      } else {
        // Create new funding
        result = await createFunding(formData);
        setMessage({ text: "Funding created successfully!", type: "success" });

        // Add the new funding to the local state immediately
        if (result) {
          setFundings((prevFundings) => [...prevFundings, result]);
        }
      }

      // Reset form and hide it after successful submission
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error(
        isEditing ? "Error updating funding:" : "Error creating funding:",
        error
      );
      setMessage({
        text: isEditing ? "Error updating funding" : "Error creating funding",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fundingId: string) => {
    if (!window.confirm("Are you sure you want to delete this funding?")) {
      return;
    }

    setIsLoading(true);
    try {
      await deleteFunding(fundingId);
      setMessage({ text: "Funding deleted successfully!", type: "success" });

      // Remove the deleted funding from the local state immediately
      setFundings((prevFundings) =>
        prevFundings.filter((item) => item.funding_id !== fundingId)
      );

      // Reset form if we're editing the deleted funding
      if (isEditing && formData.funding_id === fundingId) {
        resetForm();
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error deleting funding:", error);
      setMessage({ text: "Error deleting funding", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (funding: Funding) => {
    setFormData({
      ...funding,
      closing_date: funding.closing_date
        ? funding.closing_date.split("T")[0]
        : new Date().toISOString().split("T")[0],
    });
    setIsEditing(true);
    setShowForm(true);
  };

  return (
    <div className="space-y-6 p-4 w-full bg-white">
      {/* Message Display */}
      {message.text && (
        <div
          className={`p-3 rounded-md shadow-md ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Call to Action when form is hidden */}
      {!showForm ? (
        <div className="flex flex-col items-center justify-center p-8 my-8 bg-white rounded-lg shadow-lg border border-gray-200 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Funding Opportunities
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl">
            Unlock new possibilities for your projects by exploring and managing
            funding opportunities. Add new funding sources, track applications,
            and stay organized in one place.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="py-3 px-6 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-all duration-300 shadow-md flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add New Funding
          </button>
        </div>
      ) : (
        /* Form Section */
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-lg bg-white border border-gray-200 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-700">
              {isEditing ? "Edit Funding" : "Create Funding"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Title */}
          <div className="form-group">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Donor Name */}
          <div className="form-group">
            <label
              htmlFor="donor"
              className="block text-sm font-medium text-gray-700"
            >
              Donor Name
            </label>
            <input
              type="text"
              id="donor"
              name="donor"
              value={formData.donor || ""}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Eligible Countries */}
          <div className="form-group">
            <label
              htmlFor="eligibre_countries"
              className="block text-sm font-medium text-gray-700"
            >
              Eligible Countries
            </label>
            <input
              type="text"
              id="eligibre_countries"
              name="eligibre_countries"
              value={formData.eligibre_countries || ""}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Grid for smaller fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Focus Area */}
            <div className="form-group">
              <label
                htmlFor="focus_earlier"
                className="block text-sm font-medium text-gray-700"
              >
                Focus Area
              </label>
              <select
                name="focus_earlier"
                id="focus_earlier"
                onChange={handleChange}
                value={formData.focus_earlier || ""}
                className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                required
              >
                <option value="">Select Focus Area</option>
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="environment">Environment</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Grant Size */}
            <div className="form-group">
              <label
                htmlFor="grant_size"
                className="block text-sm font-medium text-gray-700"
              >
                Grant Size
              </label>
              <select
                name="grant_size"
                id="grant_size"
                onChange={handleChange}
                value={formData.grant_size || ""}
                className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                required
              >
                <option value="">Select Grant Size</option>
                <option value="Up to $1000">Up to $1000</option>
                <option value="$1000 - $5000">$1000 - $5000</option>
                <option value="$5000 - $10000">$5000 - $10000</option>
                <option value="More than $10000">More than $10000</option>
              </select>
            </div>

            {/* Funding Type */}
            <div className="form-group">
              <label
                htmlFor="funding_type"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <select
                name="funding_type"
                id="funding_type"
                onChange={handleChange}
                value={formData.funding_type || ""}
                className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                required
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

            {/* Closing Date */}
            <div className="form-group">
              <label
                htmlFor="closing_date"
                className="block text-sm font-medium text-gray-700"
              >
                Closing Date
              </label>
              <input
                type="date"
                id="closing_date"
                name="closing_date"
                value={
                  formData.closing_date
                    ? formData.closing_date.split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Reference Link */}
          <div className="form-group">
            <label
              htmlFor="reference_link"
              className="block text-sm font-medium text-gray-700"
            >
              Reference Link
            </label>
            <input
              type="url"
              id="reference_link"
              name="reference_link"
              value={formData.reference_link || ""}
              onChange={handleChange}
              className="w-full p-2 mt-1 bg-white border border-gray-300 rounded-md text-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
            />
          </div>

          {/* Form Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className={`py-2 px-4 rounded-md ${
                isEditing ? "bg-blue-500" : "bg-green-600"
              } text-white hover:bg-opacity-90 transition-all`}
              disabled={isLoading}
            >
              {isLoading
                ? "Processing..."
                : isEditing
                  ? "Update Funding"
                  : "Submit Funding"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-opacity-90 transition-all"
                onClick={resetForm}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* Fundings List */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Your Fundings
        </h2>
        {isLoading && (
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent"></div>
          </div>
        )}

        {!isLoading && fundings.length === 0 && (
          <p className="text-gray-600">
            No fundings found. Create your first one using the button above!
          </p>
        )}

        {!isLoading && fundings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fundings.map((funding) => (
              <div
                key={funding.funding_id}
                className="p-6 rounded-lg bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {funding.title}
                </h3>
                <div className="my-3">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    {funding.funding_type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Donor: {funding.donor}
                </p>
                <p className="text-sm text-gray-600">
                  Grant Size: {funding.grant_size}
                </p>
                <p className="text-sm text-gray-600">
                  Closing Date:{" "}
                  {funding.closing_date
                    ? new Date(funding.closing_date).toLocaleDateString()
                    : "N/A"}
                </p>
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleEdit(funding)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(funding.funding_id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FundingForm;
