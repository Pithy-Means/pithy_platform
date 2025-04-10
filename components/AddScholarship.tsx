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
    setLoading(true);
    try {
      const data = await getScholarships();
      setScholarships(data?.documents || []);
    } catch (error) {
      console.error("Error fetching scholarships:", error);
      setMessage({
        type: "error",
        text: "Failed to load scholarships. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (scholarship: Scholarship) => {
    setFormData(scholarship);
    setEditingId(scholarship.scholarship_id);
    setShowForm(true);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (user) {
      setFormData((prevState) => ({ ...prevState, user_id: user?.user_id }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
      setShowForm(false);
      setTimeout(() => setMessage({ type: null, text: null }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to add scholarship. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateScholarship = async (e: React.FormEvent) => {
    e.preventDefault();
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
              : scholarship,
          ),
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
          setShowForm(false);
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
    if (!window.confirm("Are you sure you want to delete this scholarship?")) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteScholarship(scholarshipId);
      setMessage({
        type: "success",
        text: "Scholarship deleted successfully!",
      });
      fetchScholarships();
      setTimeout(() => setMessage({ type: null, text: null }), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to delete scholarship. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "No deadline";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="w-full px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Scholarship Management
          </h1>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="py-2 px-4 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
            >
              Add New Scholarship
            </button>
          )}
        </div>

        {/* Status message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-md ${
              message.type === "error"
                ? "bg-red-50 text-red-700 border-l-4 border-red-500"
                : "bg-green-50 text-green-700 border-l-4 border-green-500"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Scholarship Form */}
        {showForm && (
          <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {editingId ? "Edit Scholarship" : "Add New Scholarship"}
            </h2>
            <form
              onSubmit={editingId ? handleUpdateScholarship : handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Study Level
                  </label>
                  <select
                    name="study_level"
                    value={formData.study_level}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required
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
                </div>
                <InputField
                  label="Discipline"
                  name="discipline"
                  value={formData.discipline}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Country of Study"
                  name="country_of_study"
                  value={formData.country_of_study}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Reference Link"
                  name="reference_link"
                  value={formData.reference_link}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      scholarship_id: "",
                      user_id: user?.user_id || "",
                      title: "",
                      provider: "",
                      study_level: "",
                      amount: "",
                      deadline: new Date().toISOString().split("T")[0],
                      discipline: "",
                      country_of_study: "",
                      reference_link: "",
                    });
                  }}
                  className="py-2 px-4 bg-gray-200 rounded text-gray-800 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`py-2 px-6 rounded text-white font-medium ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : editingId
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  } transition-colors`}
                >
                  {loading
                    ? editingId
                      ? "Updating..."
                      : "Adding..."
                    : editingId
                    ? "Update Scholarship"
                    : "Add Scholarship"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List of Scholarships */}
        <div className="bg-white rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Available Scholarships
          </h2>
          {loading && !scholarships.length ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading scholarships...</p>
            </div>
          ) : scholarships.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-600">
                No scholarships found. Add one to get started!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Scholarship</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Study Level</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scholarships.map((scholarship) => (
                    <tr key={scholarship.scholarship_id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{scholarship.title}</div>
                        <div className="text-sm text-gray-500">{scholarship.discipline}</div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">{scholarship.provider}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{scholarship.amount}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{scholarship.deadline && formatDate(scholarship.deadline)}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">{scholarship.study_level}</td>
                      <td className="py-4 px-4 text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(scholarship)}
                            className="text-blue-600 hover:text-blue-900 py-1 px-3 rounded border border-blue-600 hover:bg-blue-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(scholarship.scholarship_id)}
                            className="text-red-600 hover:text-red-900 py-1 px-3 rounded border border-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900"
    />
  </div>
);

const studyLevels = [
  "Undergraduate",
  "Postgraduate",
  "Doctorate",
  "Diploma",
  "Certificate",
];

export default AddScholarship;