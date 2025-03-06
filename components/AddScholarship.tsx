"use client";

import {
  createScholarship,
  deleteScholarship,
  getScholarships,
  updateScholarship,
} from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { Scholarship, UserInfo } from "@/types/schema";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AddScholarship = () => {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
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
  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string | null;
  }>({ type: null, text: null });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    const data = await getScholarships();
    setScholarships(data?.documents || []);
  };

  const handleEdit = async (scholarship: Scholarship) => {
    setFormData(scholarship);
    setEditingId(scholarship.scholarship_id);
    setShowForm(true);
  };

  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({ ...prevState, user_id: user?.user_id }));
    }
  }, [user]);

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
    setMessage({ type: null, text: null });

    try {
      if (!user) {
        throw new Error("User not found. Please log in.");
      }
      await createScholarship(formData);
      setFormData({
        scholarship_id: "",
        user_id: user?.user_id,
        title: "",
        provider: "",
        study_level: "",
        amount: "",
        deadline: "",
        discipline: "",
        country_of_study: "",
        reference_link: "",
      });
      setMessage({ type: "success", text: "Scholarship added successfully!" });
      fetchScholarships();
      setShowForm(false); // Hide the form after submission
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add scholarship. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScholarship = async () => {
    if (!editingId) return;

    setLoading(true);
    try {
      const result = await updateScholarship(editingId, formData);
      if (result) {
        setMessage({
          type: "success",
          text: "Scholarship updated successfully!",
        });
        setScholarships((prevScholarships) =>
          prevScholarships.map((scholarship) =>
            scholarship.scholarship_id === editingId
              ? { ...scholarship, ...formData }
              : scholarship
          )
        );
        setTimeout(() => {
          setEditingId(null);
          setFormData({
            scholarship_id: "",
            user_id: user?.user_id || "",
            title: "",
            provider: "",
            study_level: "",
            amount: "",
            deadline: "",
            discipline: "",
            country_of_study: "",
            reference_link: "",
          });
          setMessage({ type: null, text: null });
          setShowForm(false); // Hide the form after update
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update scholarship. Please try again.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (scholarshipId: string) => {
    setLoading(true);
    setMessage({ type: null, text: null });

    try {
      await deleteScholarship(scholarshipId);
      setMessage({
        type: "success",
        text: "Scholarship deleted successfully!",
      });
      fetchScholarships();
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete scholarship. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500/5 via-purple-500/5 to-white/5"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl transition-transform"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Scholarships
        </h1>

        {/* Display message */}
        {message.text && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}
          >
            {message.text}
          </motion.p>
        )}

        {/* Button to show the form */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-2 px-4 rounded-md text-white font-semibold bg-blue-500 hover:bg-blue-600 transition-all mb-6"
          >
            Add New Scholarship
          </button>
        )}

        {/* Scholarship Form */}
        {showForm && (
          <form
            onSubmit={editingId ? handleUpdateScholarship : handleSubmit}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 gap-4">
              {fields.map(({ label, name, type }) => (
                <InputField
                  key={name}
                  label={label}
                  name={name}
                  type={type}
                  value={formData[name as keyof Scholarship] as string}
                  onChange={handleChange}
                />
              ))}
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
                  {studyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-all ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              {loading
                ? editingId
                  ? "Updating Scholarship..."
                  : "Adding Scholarship..."
                : editingId
                  ? "Update Scholarship"
                  : "Add Scholarship"}
            </button>
          </form>
        )}

        {/* List of Scholarships */}
        {/* List of Scholarships */}
        <div className="mt-6">
          {scholarships.length === 0 ? (
            <p className="text-center text-gray-600">
              No scholarships found. Add one to get started!
            </p>
          ) : (
            scholarships.map((scholarship) => (
              <motion.div
                key={scholarship.scholarship_id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-4 border rounded-lg shadow-sm mb-4 bg-green-50"
              >
                <h2 className="text-xl font-semibold text-green-800">
                  {scholarship.title}
                </h2>
                <p className="text-green-700">{scholarship.provider}</p>
                <p className="text-green-700">Amount: {scholarship.amount}</p>
                <p className="text-green-700">
                  Deadline:{" "}
                  {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString() : "No deadline"}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(scholarship)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(scholarship.scholarship_id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
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
  </motion.div>
);

const fields: { label: string; name: keyof Scholarship; type?: string }[] = [
  { label: "Title", name: "title" },
  { label: "Provider", name: "provider" },
  { label: "Amount", name: "amount" },
  { label: "Deadline", name: "deadline", type: "date" },
  { label: "Discipline", name: "discipline" },
  { label: "Country of Study", name: "country_of_study" },
  { label: "Reference Link", name: "reference_link" },
];

const studyLevels = [
  "Undergraduate",
  "Postgraduate",
  "Doctorate",
  "Diploma",
  "Certificate",
];

export default AddScholarship;
