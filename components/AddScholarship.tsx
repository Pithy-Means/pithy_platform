"use client";

import { createScholarship } from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Scholarship, UserInfo } from "@/types/schema";
import { useEffect, useState } from "react";

const AddScholarship = () => {
  const { user } = useAuthStore((state) => state as UserInfo);

  const [formData, setFormData] = useState<Scholarship>({
    scholarship_id: "",
    user_id: "",
    title: "",
    provider: "",
    study_level: "",
    amount: "",
    deadline: new Date().toISOString().split("T")[0],
    discipline: "",
    country_of_study: "",
    reference_link: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.user) {
      setFormData((prevState) => ({
        ...prevState,
        user_id: user?.user.user_id,
      }));
    }
  }, [user?.user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState: Scholarship) => ({
      ...prevState,
      [name]:
        name === "deadline"
          ? new Date(value).toISOString().split("T")[0]
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!user) {
        throw new Error("User not found. Please log in.");
      }

      const result = await createScholarship(formData);
      if (result) {
        setFormData({
          scholarship_id: "",
          user_id: user?.user.user_id,
          title: "",
          provider: "",
          study_level: "",
          amount: "",
          deadline: "",
          discipline: "",
          country_of_study: "",
          reference_link: "",
        });
        setSuccess("Scholarship added successfully!");
      }
    } catch (error) {
      setError("Failed to add scholarship. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500/5 via-purple-500/5 to-white/5 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl transform transition-transform hover:scale-105">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Add Scholarship
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <InputField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <InputField
              label="Provider"
              name="provider"
              value={formData.provider}
              onChange={handleChange}
            />
            <label>
              Study Level:
              <select
                name="study_level"
                value={formData.study_level}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded-md text-black"
              >
                <option value="" disabled>
                  Select Study Level
                </option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Doctorate">Doctorate</option>
                <option value="Diploma">Diploma</option>
                <option value="Certificate">Certificate</option>
              </select>
            </label>

            <InputField
              label="Amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
            <InputField
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
            />
            <InputField
              label="Discipline"
              name="discipline"
              value={formData.discipline}
              onChange={handleChange}
            />
            <InputField
              label="Country of Study"
              name="country_of_study"
              value={formData.country_of_study}
              onChange={handleChange}
            />
            <InputField
              label="Reference Link"
              name="reference_link"
              value={formData.reference_link}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Adding Scholarship..." : "Add Scholarship"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={`Enter ${label}`}
      className="block w-full px-4 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 border-gray-300 shadow-sm text-black"
    />
  </div>
);

export default AddScholarship;
