"use client";

import { useContext, useEffect, useState } from "react";
import { Job } from "@/types/schema"; // Assuming Job interface exists
import { createJob } from "@/lib/actions/user.actions"; // Assuming createJob function is exported
import { UserContext } from "@/context/UserContext";

const JobForm = () => {
  const [formData, setFormData] = useState<Job>({
    job_id: "",
    user_id: "", // Set this dynamically based on the logged-in user
    job_title: "",
    job_description: "",
    job_location: "",
    job_status: "open", // Default to "open"
    job_experience: "entry", // Default to "entry"
    job_education: "bachelor", // Default to "bachelor"
    job_employment: "full_time", // Default to "full_time"
    job_type: "remote", // Default to "remote"
    job_salary: "",
    created_at: "",
    updated_at: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    // When the user data is fetched, update the formData with the user_id
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        user_id: user.user_id, // Dynamically set user_id
      }));
    }
  }, [user]); // This runs when the user is fetched

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: Job) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: Job) => ({ ...prevState, [name]: value }));
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

      // Ensure user_id is set
      const now = new Date().toISOString();
      setFormData((prevState: Job) => ({
        ...prevState,
        job_id: formData.job_id, // Assuming generateJobId is a function to generate job IDs
        created_at: now,
        updated_at: now,
      }));

      // Create job document by calling the createJob function
      const createdJob = await createJob(formData);
      setSuccess("Job created successfully!");
      console.log("Created Job: ", createdJob);
    } catch (error) {
      setError("Failed to create job. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Job Title</label>
            <input
              id="job_title"
              name="job_title"
              placeholder="Job Title"
              value={formData.job_title}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="job_description" className="block text-sm font-medium text-gray-700">Job Description</label>
            <textarea
              id="job_description"
              name="job_description"
              placeholder="Job Description"
              value={formData.job_description}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="job_location" className="block text-sm font-medium text-gray-700">Job Location</label>
            <input
              type="text"
              id="job_location"
              name="job_location"
              placeholder="Job Location"
              value={formData.job_location}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="job_salary" className="block text-sm font-medium text-gray-700">Salary</label>
            <input
              type="text"
              id="job_salary"
              name="job_salary"
              placeholder="Salary"
              value={formData.job_salary}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-between">
            <div>
              <label htmlFor="job_type" className="block text-sm font-medium text-gray-700">Job Type</label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleSelectChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="remote">Remote</option>
                <option value="office">Office</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label htmlFor="job_experience" className="block text-sm font-medium text-gray-700">Experience Level</label>
              <select
                id="job_experience"
                name="job_experience"
                value={formData.job_experience}
                onChange={handleSelectChange}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Job"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
        </form>
      </div>
    </div>
  );
};

export default JobForm;
