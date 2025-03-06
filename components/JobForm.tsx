"use client";

import { useEffect, useState } from "react";
import { Job, UserInfo } from "@/types/schema";
import { getJobs, updateJob, deleteJob, createJob } from "@/lib/actions/user.actions";
import { Button } from "./ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";

// Optional: Create a context for job management if you want to use it across multiple components
// This is a simplified version that combines both components

const JobDashboard = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [editFormData, setEditFormData] = useState<Job | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  // Fetch jobs when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const jobsData = await getJobs();
        console.log("Fetched jobs:", jobsData);
        if (jobsData) {          
          // Ensure jobsData is always treated as an array
          const jobsArray = jobsData.documents || [];
          setJobs(jobsArray);
          console.log("Updated jobs state:", jobsArray);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user]);

  useEffect(() => {
    // When the user data is fetched, update the formData with the user_id
    if (user) {
      setFormData((prevState) => ({
        ...prevState,
        user_id: user?.user_id,
      }));
    }
  }, [user]);



  // Form handling for creating a new job
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState: Job) => ({
      ...prevState,
      [name]: name === "closing_date" ? new Date(value).toISOString().split('T')[0] : value,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      if (!user) {
        throw new Error("User not found. Please log in.");
      }

      // Ensure user_id is set
      const jobToCreate = {
        ...formData,
        user_id: user.user_id,
      };

      // Create job document
      const createdJob = await createJob(jobToCreate);
      
      if (createdJob) {
        setFormSuccess("Job created successfully!");
        
        // Add the new job to the jobs list immediately
        setJobs(prevJobs => [...prevJobs, createdJob]);
        
        // Reset form
        setFormData({
          job_id: "",
          user_id: user.user_id,
          job_title: "",
          job_description: "",
          location_of_work: "",
          employer: "",
          job_earlier: "",
          country_of_work: "",
          closing_date: new Date().toISOString().split('T')[0],
          application_link: ""
        });
        
        // Close the form after a short delay
        setTimeout(() => {
          setShowCreateForm(false);
          setFormSuccess(null);
        }, 2000);
      }
    } catch (error) {
      setFormError("Failed to create job. Please try again.");
      console.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  // Editing job functionality
  const handleEditClick = (job: Job) => {
    setEditingJob(job);
    setEditFormData(job);
    setUpdateSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingJob(null);
    setEditFormData(null);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (editFormData) {
      setEditFormData({
        ...editFormData,
        [name]: name === "closing_date" ? new Date(value).toISOString().split('T')[0] : value,
      });
    }
  };

  const handleUpdateJob = async () => {
    if (!editingJob || !editFormData) return;
    
    setLoading(true);
    try {
      const result = await updateJob(editingJob.job_id, editFormData);
      if (result) {
        setUpdateSuccess("Job updated successfully!");
        // Update the jobs list with the updated job
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.job_id === editingJob.job_id ? { ...job, ...editFormData } : job
          )
        );
        // Close edit form after short delay
        setTimeout(() => {
          setEditingJob(null);
          setEditFormData(null);
          setUpdateSuccess(null);
        }, 2000);
      }
    } catch (error) {
      setError("Failed to update job. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Delete job functionality
  const handleDeleteConfirm = (jobId: string) => {
    setDeleteConfirm(jobId);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    setLoading(true);
    try {
      await deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.job_id !== jobId));
      setDeleteConfirm(null);
    } catch (error) {
      setError("Failed to delete job. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading && jobs.length === 0 && !showCreateForm) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Job Dashboard</h2>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? "Cancel" : "Create New Job"}
        </Button>
      </div>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      {/* Create Job Form */}
      {showCreateForm && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Create a New Job</h3>
          {formSuccess && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{formSuccess}</div>}
          {formError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{formError}</div>}
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="job_title" className="block text-sm font-medium text-black">Job Title</label>
                <input
                  id="job_title"
                  name="job_title"
                  placeholder="Job Title"
                  value={formData.job_title}
                  onChange={handleFormInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
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
                  onChange={handleFormInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="job_description" className="block text-sm font-medium text-black">Job Description</label>
              <textarea
                id="job_description"
                name="job_description"
                placeholder="Job Description"
                value={formData.job_description}
                onChange={handleFormInputChange}
                className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location_of_work" className="block text-sm font-medium text-black">Location of Work</label>
                <input
                  type="text"
                  id="location_of_work"
                  name="location_of_work"
                  placeholder="Location of Work"
                  value={formData.location_of_work}
                  onChange={handleFormInputChange}
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
                  onChange={handleFormInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="job_earlier" className="block text-sm font-medium text-black">Job Earlier</label>
                <input
                  type="text"
                  id="job_earlier"
                  name="job_earlier"
                  placeholder="Job Earlier"
                  value={formData.job_earlier}
                  onChange={handleFormInputChange}
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
                  onChange={handleFormInputChange}
                  className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="application_link" className="block text-sm font-medium text-black">Application Link</label>
              <input
                type="url"
                id="application_link"
                name="application_link"
                placeholder="Application Link"
                value={formData.application_link}
                onChange={handleFormInputChange}
                className="w-full mt-1 p-2 border border-gray-300 text-black rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={formLoading}
            >
              {formLoading ? (
                <div className="flex items-center justify-center">
                  <span>Creating Job...</span>
                  <svg
                    className="animate-spin h-5 w-5 ml-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8v-4a4 4 0 00-4-4H4z"
                    ></path>
                  </svg>
                </div>
              ): (
                "Create Job"
              )}
            </Button>
          </form>
        </div>
      )}
      
      {/* Job List Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">{jobs.length > 0 ? "Your Jobs" : ""}</h3>
        
        {jobs.length === 0 && !showCreateForm ? (
          <div className="text-center py-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 mb-4">You haven&apos;t posted any jobs yet.</p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Job
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job.job_id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {deleteConfirm === job.job_id ? (
                  <div className="space-y-4">
                    <p className="font-medium text-red-600">Are you sure you want to delete this job?</p>
                    <div className="flex space-x-2">
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDeleteJob(job.job_id)}
                        disabled={loading}
                      >
                        Yes, Delete
                      </Button>
                      <Button 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                        onClick={handleDeleteCancel}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : editingJob && editingJob.job_id === job.job_id ? (
                  <div className="space-y-4">
                    {updateSuccess && (
                      <div className="bg-green-100 text-green-700 p-2 rounded mb-4">
                        {updateSuccess}
                      </div>
                    )}
                    
                    <div>
                      <label htmlFor="job_title" className="block text-sm font-medium text-gray-700">Job Title</label>
                      <input
                        id="job_title"
                        name="job_title"
                        value={editFormData?.job_title || ''}
                        onChange={handleEditInputChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="job_description" className="block text-sm font-medium text-gray-700">Job Description</label>
                      <textarea
                        id="job_description"
                        name="job_description"
                        value={editFormData?.job_description || ''}
                        onChange={handleEditInputChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location_of_work" className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        id="location_of_work"
                        name="location_of_work"
                        value={editFormData?.location_of_work || ''}
                        onChange={handleEditInputChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="employer" className="block text-sm font-medium text-gray-700">Employer</label>
                      <input
                        id="employer"
                        name="employer"
                        value={editFormData?.employer || ''}
                        onChange={handleEditInputChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="closing_date" className="block text-sm font-medium text-gray-700">Closing Date</label>
                      <input
                        type="date"
                        id="closing_date"
                        name="closing_date"
                        value={editFormData?.closing_date.toString().split('T')[0] || ''}
                        onChange={handleEditInputChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="application_link" className="block text-sm font-medium text-gray-700">Application Link</label>
                      <input
                        type="url"
                        id="application_link"
                        name="application_link"
                        value={editFormData?.application_link || ''}
                        onChange={handleEditInputChange}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleUpdateJob}
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Job"}
                      </Button>
                      <Button 
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{job.job_title}</h3>
                    <p className="text-gray-600 mb-2">{job.employer}</p>
                    <p className="text-gray-600 mb-2">{job.location_of_work}</p>
                    <p className="text-sm text-gray-500 mb-4">
                      Closing: {new Date(job.closing_date).toLocaleDateString()}
                    </p>
                    
                    <div className="mb-4 h-24 overflow-hidden text-ellipsis">
                      <p className="text-gray-700 text-sm">{job.job_description.substring(0, 150)}
                        {job.job_description.length > 150 ? '...' : ''}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm flex-1"
                        onClick={() => handleEditClick(job)}
                      >
                        Edit
                      </Button>
                      <Button 
                        className="bg-red-600 hover:bg-red-700 text-white text-sm flex-1"
                        onClick={() => handleDeleteConfirm(job.job_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDashboard;