"use client";

import { register } from "@/lib/actions/user.actions";
import { UserInfo } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PersonInfo from "./PersonalInfo";
import ProgressBar from "./ProgressBar";
import { BasicInfoStep } from "./BaseInfoStep";
import { StudentFields } from "./StudentFields";
import { JobSeekerFields } from "./JobSeekerFields";
import { EmployerFields } from "./EmployerFields";

const SignupForm = () => {
  // Form state
  const [formData, setFormData] = useState<Partial<UserInfo>>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const router = useRouter();

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
        (field) => formData[field as keyof UserInfo],
      );
      setIsFormComplete(isComplete);
    };

    checkFormCompletion();
  }, [formData, currentStep]);

  // Update form fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
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

  if (isLoading) {
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md">Loading...</div>
    </div>;
  }

  // Handle category-specific fields
  const renderCategoryFields = () => {
    switch (formData.categories) {
      case "student":
        if (formData.studentInfo) {
        return (
          <>
            {/* Student specific fields */}
            <StudentFields data={formData.studentInfo} onChange={handleChange} />
          </>
        );
      }
      break;
      case "job seeker":
        if (formData.jobSeekerInfo) {
        return (
          <>
            {/* Job seeker specific fields */}
            <JobSeekerFields data={formData.jobSeekerInfo} onChange={handleChange} />
          </>
        );
      }
      break;
      case "employer":
        if (formData.employerInfo){
        return (
          <>
            {/* Employer specific fields */}
            <EmployerFields data={formData.employerInfo} onChange={handleChange} />
          </>
        );
      }
      default:
        return null;
    }
  };

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
                {renderCategoryFields()}
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
                  ? "text-red-500 p-2 "
                  : "px-8 py-2 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white rounded-md"
              }
              disabled={!isFormComplete}
            >
              {!isFormComplete ? "Complete the missing space" : "Next"}
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