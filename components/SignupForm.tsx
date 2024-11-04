"use client";

import { register } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InputContact from "./InputContact";
import PersonInfo from "./PersonalInfo";
import ProgressBar from "./ProgressBar";

const SignupForm = () => {
  // Form state
  const [formData, setFormData] = useState<Partial<UserInfo>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    const checkFormCompletion = () => {
      // Define required fields based on current step
      const requiredFields: { [key: number]: string[] } = {
        0: ["firstname", "lastname"],
        1: ["phone", "address"],
        2: ["age"],
        3: ["gender"],
        4: ["categories"],
        5: ["email", "password"], // Assuming password and email are required at step 5
      };

      const fields = requiredFields[currentStep] || [];
      const isComplete = fields.every((field) => formData[field as keyof UserInfo]);
      setIsFormComplete(isComplete);
    };

    checkFormCompletion();
  }, [formData, currentStep]);

  // Update form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  if (isLoading)
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md">Loading...</div>
    </div>;

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
              <InputContact
                label="Institution Name"
                type="text"
                name="institution_name"
                value={formData.institution_name || ""}
                onChange={handleChange}
                />
            </div>
            <div className="mb-4">
              <InputContact
                label="Major Subject"
                type="text"
                name="major_subject"
                value={formData.major_subject || ""}
                onChange={handleChange}
                />
            </div>
            <div className="mb-4">
              <InputContact
                label="Expected Graduation Year"
                type="number"
                name="expected_graduation_year"
                value={formData.expected_graduation_year || ""}
                onChange={handleChange}
                />
            </div>
          </>
        );
      case "job seeker":
        return (
          <>
            {/* Job seeker specific fields */}
            <div className="mb-4">
              <InputContact
                label="Desired Job Title"
                type="text"
                name="desired_job_title"
                value={formData.desired_job_title || ""}
                onChange={handleChange}
                />
            </div>
            <div className="mb-4">
              <InputContact
                label="Skills"
                type="text"
                name="skills"
                value={formData.skills || ""}
                onChange={handleChange}
                />
            </div>
            <div className="mb-4">
              <InputContact
                label="Years of Work Experience"
                type="number"
                name="years_of_work_experience"
                value={formData.years_of_work_experience || ""}
                onChange={handleChange}
                />
            </div>
            <div className="mb-4">
              <InputContact
                label="Resume Link"
                type="text"
                name="resume_link"
                value={formData.resume_link || ""}
                onChange={handleChange}
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
              <InputContact
                label="Company Name"
                type="text"
                name="company_name"
                value={formData.company_name || ""}
                onChange={handleChange}
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
              <InputContact
                label="Industry Type"
                type="text"
                name="industry_type"
                value={formData.industry_type || ""}
                onChange={handleChange}
                />
            </div>
            <div className="mb-4">
              <InputContact
                label="Position in Company"
                type="text"
                name="position_in_company"
                value={formData.position_in_company || ""}
                onChange={handleChange}
                />
            </div>
            <div className="mb-4">
              <InputContact
                label="Job Posting Count"
                type="number"
                name="job_posting_count"
                value={formData.job_posting_count || ""}
                onChange={handleChange}
                />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-white h-full  flex justify-center items-center flex-col">
      {/* Progress Bar */}
      <div className="w-1/4">
        <ProgressBar
          currentStep={currentStep}
          />
      </div>
      <form onSubmit={handleSubmit} className="text-black w-full px-10 ">
        {/* Basic fields */}
        <div className="flex items-center justify-center h-[400px] px-10 py-6">
          {currentStep === 0 && (
            <div className="flex flex-col justify-center space-y-4 w-3/5 mx-auto">
              <h2 className="text-lg font-semibold mb-4 text-center">Basic Info</h2>
              <p className="text-center text-gray-500 mb-6">
                Please provide your basic information to get started.
              </p>
              {/**First Name */}
              <InputContact
                label="First Name"
                type="text"
                name="firstname"
                value={formData.firstname || ""}
                onChange={handleChange}
              />

              {/**Last Name */}
              <InputContact
                label="Last Name"
                type="text"
                name="lastname"
                value={formData.lastname || ""}
                onChange={handleChange}
              />
            </div>
          )}
          {currentStep === 1 && (
            <div className="flex flex-col justify-center space-y-4 w-3/5 mx-auto">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Contact Info
              </h2>
              <p className="text-gray-500 mb-6">
                Please provide your contact information.
              </p>
              <InputContact
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
              />
              <InputContact
                label="Address"
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex flex-col justify-center space-y-4 w-3/5 mx-auto">
              <PersonInfo
                question="What is your age group?"
                options={["18-25", "26-35", "36-45", "46 and +"]}
                description="Please select your age group."
                selectedValue={formData.age || ""}
                onselect={(value) =>
                  handleChange({
                    target: { name: "age", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
          )}
          {currentStep === 3 && (
            <div className="flex flex-col justify-center space-y-4 w-3/5 mx-auto">
              <PersonInfo
                question="Select your gender"
                options={["male", "female"]}
                description="Please select your gender."
                selectedValue={formData.gender || ""}
                onselect={(value) =>
                  handleChange({
                    target: { name: "gender", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
            </div>
          )}
          {currentStep === 4 && (
            <div className="flex w-full space-y-6">
              <div className="flex flex-col justify-center space-y-4 w-3/5 mx-auto">
                <PersonInfo
                  question="Select your category"
                  options={["student", "job seeker", "employer"]}
                  description="Please select your category."
                  selectedValue={formData.categories || ""}
                  onselect={(value) =>
                    handleChange({
                      target: { name: "categories", value },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                />
                {/* Render category-specific fields */}
              </div>
              <div className="flex flex-col justify-center space-y-4 w-3/5 mx-auto">
                {renderCategoryFields()}
              </div>
            </div>
          )}
          {currentStep === 5 && (
            <div className="flex flex-col justify-center space-y-4 w-full mx-auto">
              <h2 className="text-lg font-semibold mb-4">
                Additional Info
              </h2>
              <label className="block text-gray-700">Email</label>
              <InputContact
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                label="Email"
              />
              <label className="block text-gray-700">Password</label>
              <InputContact
                type="password"
                name="password"
                value={formData.password || ""}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md" 
                label={"Password"}              
                />
            </div>
          )}
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-center items-center gap-x-4 mt-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            >
              Previous
            </button>
          )}
          {currentStep < 5 && (
            <button
              type="button"
              onClick={handleNext}
              className={!isFormComplete ? "bg-black text-white/10": "px-8 py-2 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white rounded-md"}
              disabled={!isFormComplete}
            >
              Next
            </button>
          )}
          {currentStep === 5 && (
            <button
              type="submit"
              className={!isFormComplete ? "bg-black text-white/10": "px-8 py-2 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white rounded-md"}
              disabled={!isFormComplete}
            >
              Sign up
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
