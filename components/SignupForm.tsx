"use client";

// import { register } from "@/lib/actions/user.actions";
import { AuthState, UserInfo } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PersonInfo from "./PersonalInfo";
import ProgressBar from "./ProgressBar";
import { BasicInfoStep } from "./BaseInfoStep";
import InputContact from "./InputContact";
import { useAuthStore } from "@/lib/store/useAuthStore";

const SignupForm = () => {
  // Form state
  const [formData, setFormData] = useState<Partial<UserInfo>>({});

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const router = useRouter();

  const { signup } = useAuthStore((state) => state as AuthState);

  const handleNext = () => {
    if (currentStep < 4) {
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
        0: ["firstname", "lastname", "email", "phone", "address", "password"],
        1: ["age"],
        2: ["gender"],
        3: ["categories"],
      };

      const fields = requiredFields[currentStep] || [];
      const isComplete = fields.every(
        (field) => formData[field as keyof UserInfo]
      );
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
      const newuser = await signup(formData as UserInfo);
      if (newuser) {
        router.push("/signIn");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md">Loading...</div>
    </div>;
  }

  return (
    <div className="w-full mx-auto p-6 bg-white h-full  flex justify-center items-center flex-col">
      {/* Progress Bar */}
      <div className="w-1/5">
        <ProgressBar currentStep={currentStep} />
      </div>
      <form onSubmit={handleSubmit} className="text-black w-full px-10 ">
        {/* Basic fields */}
        <div className="flex items-center justify-center h-[400px] px-10 py-6">
          {currentStep === 0 && (
            <BasicInfoStep formData={formData} onChange={handleChange} />
          )}
          {currentStep === 1 && (
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
          {currentStep === 2 && (
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
          {currentStep === 3 && (
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
                {formData.categories === "student" && (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Student Information
                      </h3>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Education Level
                      </label>
                      <select
                        name="education_level"
                        value={formData.education_level || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full py-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Education Level</option>
                        <option value="High School">High School</option>
                        <option value="Tertiary">Tertiary</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelors">Bachelors</option>
                        <option value="Masters">Masters</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <InputContact
                      label="Institution Name"
                      type="text"
                      name="institution_name"
                      value={formData.institution_name || ""}
                      onChange={handleChange}
                      className="py-2"
                    />
                    <InputContact
                      label="Major Subject"
                      type="text"
                      name="major_subject"
                      value={formData.major_subject || ""}
                      onChange={handleChange}
                      className="py-2"
                    />
                    <InputContact
                      label="Expected Graduation Year"
                      type="number"
                      name="expected_graduation_year"
                      value={formData.expected_graduation_year ?? 0} // Coerce to match number type
                      onChange={handleChange}
                      className="py-2"
                    />
                  </div>
                )}
                {formData.categories === "job seeker" && (
                  <div className="space-y-4">
                    <InputContact
                      label="Desired Job Title"
                      type="text"
                      name="desired_job_title"
                      value={formData.desired_job_title || ""}
                      onChange={handleChange}
                    />
                    <InputContact
                      label="Skills"
                      type="text"
                      name="skills"
                      value={formData.skills || ""}
                      onChange={handleChange}
                    />
                    <InputContact
                      label="Years of Work Experience"
                      type="number"
                      name="years_of_work_experience"
                      value={formData.years_of_work_experience?.toString() || ""}
                      onChange={handleChange}
                    />
                    <InputContact
                      label="Resume Link"
                      type="text"
                      name="resume_link"
                      value={formData.resume_link || ""}
                      onChange={handleChange}
                      isTextarea
                    />
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Availability Status
                      </label>
                      <select
                        name="availability_status"
                        value={formData.availability_status || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Availability</option>
                        <option value="immediately available">
                          Immediately Available
                        </option>
                        <option value="open to opportunities">
                          Open to Opportunities
                        </option>
                      </select>
                    </div>
                  </div>
                )}
                {formData.categories === "employer" && (
                  <div className="space-y-4">
                    <InputContact
                      label="Company Name"
                      type="text"
                      name="company_name"
                      value={formData.company_name || ""}
                      onChange={handleChange}
                    />
                    <div className="mb-4">
                      <label className="block text-gray-700">
                        Company Size
                      </label>
                      <select
                        name="company_size"
                        value={formData.company_size || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select Company Size</option>
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">
                          51-200 employees
                        </option>
                        <option value="201-500 employees">
                          201-500 employees
                        </option>
                        <option value="501+ employees">501+ employees</option>
                      </select>
                    </div>
                    <InputContact
                      label="Industry Type"
                      type="text"
                      name="industry_type"
                      value={formData.industry_type || ""}
                      onChange={handleChange}
                    />
                    <InputContact
                      label="Position in Company"
                      type="text"
                      name="position_in_company"
                      value={formData.position_in_company || ""}
                      onChange={handleChange}
                    />
                    <InputContact
                      label="Job Posting Count"
                      type="number"
                      name="job_posting_count"
                      value={formData.job_posting_count?.toString() || ""}
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
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
          {currentStep < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className={
                !isFormComplete
                  ? "px-8 py-2 bg-gray-300 text-gray-800 rounded-md"
                  : "px-8 py-2 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white rounded-md"
              }
              disabled={!isFormComplete}
            >
              {!isFormComplete ? "Next" : "Next"}
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="submit"
              className={
                !isFormComplete
                  ? "bg-black text-white/10"
                  : "px-8 py-2 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white rounded-md"
              }
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
