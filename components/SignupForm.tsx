"use client";

import { register } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignupForm = () => {
  // Form state
  const [formData, setFormData] = useState<Partial<UserInfo>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Update form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newuser = await register(formData as UserInfo);
      if (newuser) {
        router.push("/signIn");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading) (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"> 
      <div className="bg-white p-4 rounded-md">Loading...</div> 
    </div>
  )

  // Handle category-specific fields
  const renderCategoryFields = () => {
    switch (formData.categories) {
      case "student":
        return (
          <>
            {/* Student specific fields */}
            <div className="mb-4">
              <label className="block text-gray-700">Education Level</label>
              <select
                name="education_level"
                value={formData.education_level || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="Tertiary">Tertiary</option>
                <option value="High School">High School</option>
                <option value="Bachelor’s">Bachelor’s</option>
                <option value="Diploma">Diploma</option>
                <option value="Master’s">Master’s</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Institution Name</label>
              <input
                name="institution_name"
                value={formData.institution_name || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Major Subject</label>
              <input
                name="major_subject"
                value={formData.major_subject || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Expected Graduation Year
              </label>
              <input
                type="number"
                name="expected_graduation_year"
                value={formData.expected_graduation_year || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        );
      case "job seeker":
        return (
          <>
            {/* Job seeker specific fields */}
            <div className="mb-4">
              <label className="block text-gray-700">Desired Job Title</label>
              <input
                name="desired_job_title"
                value={formData.desired_job_title || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Skills</label>
              <input
                name="skills"
                value={formData.skills || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Years of Work Experience
              </label>
              <input
                type="number"
                name="years_of_work_experience"
                value={formData.years_of_work_experience || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Resume Link</label>
              <input
                name="resume_link"
                value={formData.resume_link || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Availability Status</label>
              <select
                name="availability_status"
                value={formData.availability_status || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="immediately available">
                  Immediately Available
                </option>
                <option value="open to opportunities">
                  Open to Opportunities
                </option>
              </select>
            </div>
          </>
        );
      case "employer":
        return (
          <>
            {/* Employer specific fields */}
            <div className="mb-4">
              <label className="block text-gray-700">Company Name</label>
              <input
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Company Size</label>
              <select
                name="company_size"
                value={formData.company_size || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select</option>
                <option value="1-10 employees">1-10 employees</option>
                <option value="11-50 employees">11-50 employees</option>
                <option value="51-200 employees">51-200 employees</option>
                <option value="201-500 employees">201-500 employees</option>
                <option value="501+ employees">501+ employees</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Industry Type</label>
              <input
                name="industry_type"
                value={formData.industry_type || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Position in Company</label>
              <input
                name="position_in_company"
                value={formData.position_in_company || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Job Posting Count</label>
              <input
                type="number"
                name="job_posting_count"
                value={formData.job_posting_count || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <form
        onSubmit={handleSubmit}
        className="text-black bg-white/80 w-full h-full px-10"
      >
        {/* Basic fields */}
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            name="firstname"
            value={formData.firstname || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            name="lastname"
            value={formData.lastname || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <select
            name="age"
            value={formData.age || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Age Group</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46 and +">46 and +</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Gender</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        {/* Category selection */}
        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            name="categories"
            value={formData.categories || ""}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Category</option>
            <option value="student">Student</option>
            <option value="job seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>

        {/* Render category-specific fields */}
        {renderCategoryFields()}

        <div className="mt-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
            Sign Up
          </button>
        </div>
      </form>
  );
};

export default SignupForm;
