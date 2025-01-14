"use client";

import { useContext, useEffect, useState } from "react";
import { Job } from "@/types/schema"; // Assuming Job interface exists
import { createJob } from "@/lib/actions/user.actions"; // Assuming createJob function is exported
import { UserContext } from "@/context/UserContext";

const JobForm = () => {

  const [formData, setFormData] = useState<Job>({
    job_id: "",
    user_id: "",
    job_title: "",
    job_description: "",
    location_of_work: "",
    employer: "",
    job_earlier: "",
    country_of_work: "",
    closing_date: new Date().toISOString().split('T')[0],
    application_link: ""
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
    setFormData((prevState: Job) => ({
      ...prevState,
      [name]: name === "closing_date" ? new Date(value).toISOString().split('T')[0] : value,
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

      // Ensure user_id is set
      setFormData((prevState: Job) => ({
        ...prevState,
        job_id: formData.job_id, // Assuming generateJobId is a function to generate job IDs
        user_id: user.user_id,
      }));

      // Create job document by calling the createJob function
      const createdJob = await createJob(formData);
      if (createdJob) {
        setSuccess("Job created successfully!");
        setFormData({
          job_id: "",
          user_id: "",
          job_title: "",
          job_description: "",
          location_of_work: "",
          employer: "",
          job_earlier: "",
          country_of_work: "",
          closing_date: new Date().toISOString().split('T')[0],
          application_link: ""
        });
      }
    } catch (error) {
      setError("Failed to create job. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a Job</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Welcome, {user?.firstname}! Fill in the form below to create a job.</p>
        </div>
        {/* Job Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="job_title" className="block text-sm font-medium text-black">Job Title</label>
            <input
              id="job_title"
              name="job_title"
              placeholder="Job Title"
              value={formData.job_title}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="job_description" className="block text-sm font-medium text-black">Job Description</label>
            <textarea
              id="job_description"
              name="job_description"
              placeholder="Job Description"
              value={formData.job_description}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="location_of_work" className="block text-sm font-medium text-black">Location of Work</label>
            <input
              type="text"
              id="location_of_work"
              name="location_of_work"
              placeholder="Location of Work"
              value={formData.location_of_work}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="job_earlier" className="block text-sm font-medium text-black">Job Earlier</label>
            <input
              type="text"
              id="job_earlier"
              name="job_earlier"
              placeholder="Job Earlier"
              value={formData.job_earlier}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="country_of_work" className="block text-sm font-medium text-black">Country of Work</label>
            <input
              type="text"
              id="country_of_work"
              name="country_of_work"
              placeholder="Country of Work"
              value={formData.country_of_work}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="employer" className="block text-sm font-medium text-black">Employer</label>
            <input
              type="text"
              id="employer"
              name="employer"
              placeholder="Employer"
              value={formData.employer}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="closing_date" className="block text-sm font-medium text-black">Closing Date</label>
            <input
              type="date"
              id="closing_date"
              name="closing_date"
              value={formData.closing_date.toString().split('T')[0]}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="application_link" className="block text-sm font-medium text-black">Application Link</label>
            <input
              type="url"
              id="application_link"
              name="application_link"
              placeholder="Application Link"
              value={formData.application_link}
              onChange={handleInputChange}
              className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
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
