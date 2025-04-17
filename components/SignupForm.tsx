"use client";

import { AuthState, UserInfo } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PersonInfo from "./PersonalInfo";
import ProgressBar from "./ProgressBar";
import { BasicInfoStep } from "./BaseInfoStep";
import InputContact from "./InputContact";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { createVerify } from "@/lib/actions/user.actions";
import { Button } from "./ui/button";
import { CircleX, MoveLeft } from "lucide-react";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import toast, { Toaster } from "react-hot-toast";
import { useSignupFormStore } from "@/lib/store/useSignupFormStore";
import {
  createUserValidationSchema,
  baseUserSchema,
  ageSchema,
  genderSchema,
  categorySchema,
  studentSchema,
  jobSeekerSchema,
  employerSchema,
} from "@/lib/validations/auth-schema";
import { z } from "zod";

const SignupForm = () => {
  // Use the persistent store
  const {
    formData,
    currentStep,
    termsAgreed,
    updateFormData,
    updateCurrentStep,
    updateTermsAgreed,
    resetForm,
  } = useSignupFormStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("referral");

  const { signup } = useAuthStore((state) => state as AuthState);

  // Validate form based on current step
  useEffect(() => {
    const validateCurrentStep = () => {
      try {
        switch (currentStep) {
          case 0:
            baseUserSchema.parse(formData);
            break;
          case 1:
            ageSchema.parse(formData);
            break;
          case 2:
            genderSchema.parse(formData);
            break;
          case 3:
            categorySchema.parse(formData);
            // Validate category specific fields
            if (formData.categories) {
              switch (formData.categories) {
                case "student":
                  studentSchema.parse(formData);
                  break;
                case "job seeker":
                  jobSeekerSchema.parse(formData);
                  break;
                case "employer":
                  employerSchema.parse(formData);
                  break;
              }
            }
            break;
        }
        setIsFormValid(true);
        setFormErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const field = err.path[0];
            newErrors[field as string] = err.message;
          });
          setFormErrors(newErrors);
          setIsFormValid(false);
        }
      }
    };

    validateCurrentStep();
  }, [currentStep, formData]);

  // Set referral code from URL if present
  useEffect(() => {
    if (referralCode) {
      updateFormData({ referral_code: referralCode });
    }
  }, [referralCode, updateFormData]);

  const handleNext = () => {
    if (currentStep < 4 && isFormValid) {
      updateCurrentStep(currentStep + 1);
    } else if (!isFormValid) {
      // Show toast with form errors
      const errorKeys = Object.keys(formErrors);
      if (errorKeys.length > 0) {
        toast.error(`Please fix the following: ${formErrors[errorKeys[0]]}`);
      } else {
        toast.error("Please complete all required fields correctly");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      updateCurrentStep(currentStep - 1);
    }
  };

  const handleDisplayTerms = () => {
    setShowTerms(!showTerms);
  };

  const handleDisplayPrivacyPoliciesContent = () => {
    setShowPrivacy(!showPrivacy);
  };

  useEffect(() => {
    const checkFormCompletion = () => {
      // Define required fields based on current step
      const requiredFields: { [key: number]: string[] } = {
        0: [
          "firstname",
          "lastname",
          "email",
          "phone",
          "country",
          "city",
          "password",
        ],
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
    updateFormData({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation before submission
    try {
      const schema = createUserValidationSchema(formData.categories);
      schema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0];
          newErrors[field as string] = err.message;
        });
        setFormErrors(newErrors);

        // Show first error in toast
        const errorKeys = Object.keys(newErrors);
        if (errorKeys.length > 0) {
          toast.error(`Please fix: ${newErrors[errorKeys[0]]}`);
        }

        return;
      }
    }
    setIsLoading(true);
    if (!isFormComplete) {
      toast.error("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (!termsAgreed) {
      toast.error("Please agree to the terms and conditions");
      setIsLoading(false);
      return;
    }
    const linkUsed = window.location.href;
    const updatedFormData = { ...formData, signup_url: linkUsed };
    try {
      const newUser = await signup(updatedFormData as UserInfo);
      if (newUser) {
        // Toast success message
        toast.success("User registered successfully");
        resetForm();
        await createVerify(); // Trigger email verification
        // Reset the form store after successful registration
        // Redirect to the "Check Your Email" page
        router.push("/check-email");
      }
    } catch (error) {
      // Display the error message

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error registering user. Please try again.";

      toast.error(errorMessage);
      console.error("Error registering user:", `${ error instanceof Error ? error.message : 'Error occurred'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white backdrop-blur-sm z-50">
        <div className="relative">
          {/* Glowing circle */}
          <div className="absolute inset-0 bg-green-500 rounded-full filter blur-md animate-pulse"></div>

          {/* Spinning loader */}
          <div className="relative z-10 w-24 h-24">
            <div className="absolute inset-0 border-4 border-t-green-400 border-r-transparent border-b-green-200 border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-t-transparent border-r-green-400 border-b-transparent border-l-green-200 rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-t-green-200 border-r-transparent border-b-green-400 border-l-transparent rounded-full animate-spin animation-delay-150"></div>
          </div>

          <p className="mt-8 text-green-400 font-medium tracking-wider animate-pulse text-center">
            CREATING ACCOUNT IN PROCESS<span className="animate-ping">...</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4 sm:p-6 bg-white flex justify-center items-center flex-col relative min-h-screen overflow-y-auto">
      <Button
        onClick={() => router.push("/")}
        className="absolute top-4 right-4 sm:bottom-6 sm:right-6 bg-transparent text-gray-800 hover:text-zinc-200 hover:bg-green-500"
      >
        <MoveLeft className="mr-2" />
        Go Back
      </Button>
      <Toaster />
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 mt-16 sm:mt-6">
        Sign up
      </h1>
      {/* Progress Bar */}
      <div className="flex items-center justify-center w-full my-6 sm:my-10">
        <ProgressBar currentStep={currentStep} />
      </div>
      <form onSubmit={handleSubmit} className="text-black w-full max-w-6xl">
        {/* Basic fields - Responsive container */}
        <div className="flex items-center justify-center min-h-fit py-6 px-4">
          {currentStep === 0 && (
            <BasicInfoStep formData={formData} onChange={handleChange} />
          )}
          {currentStep === 1 && (
            <div className="flex flex-col justify-center space-y-4 w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto">
              <PersonInfo
                question="What is your age group?"
                options={["16-25", "26-35", "36-45", "46 and +"]}
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
            <div className="flex flex-col justify-center space-y-4 w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto">
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
            <div className="flex flex-col lg:flex-row w-full space-y-6 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col justify-center space-y-4 w-full lg:w-1/2 mx-auto">
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
              </div>
              {/* Render category-specific fields */}
              {formData.categories && (
                <div className="flex flex-col justify-center space-y-4 w-full lg:w-1/2 mx-auto z-40">
                  {formData.categories === "student" && (
                    <div className="flex flex-col space-y-4 z-40 bg-white p-4 rounded-lg shadow-sm">
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
                          <option value="Diploma">Diploma</option>
                          <option value="Bachelor">Bachelor</option>
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
                        value={formData.expected_graduation_year ?? 0}
                        onChange={handleChange}
                        className="py-2"
                      />
                    </div>
                  )}
                  {formData.categories === "job seeker" && (
                    <div className="flex flex-col space-y-4 bg-white p-4 rounded-lg shadow-sm">
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
                        value={
                          formData.years_of_work_experience?.toString() || ""
                        }
                        onChange={handleChange}
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
                          <option value="to be confirmed">
                            To be confirmed
                          </option>
                        </select>
                      </div>
                    </div>
                  )}
                  {formData.categories === "employer" && (
                    <div className="flex flex-col space-y-4 bg-white p-4 rounded-lg shadow-sm">
                      <InputContact
                        label="Company / Organization Name"
                        type="text"
                        name="company_name"
                        value={formData.company_name || ""}
                        onChange={handleChange}
                      />
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Company / Organization Size
                        </label>
                        <select
                          name="company_size"
                          value={formData.company_size || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">
                            Select Company Or Organization Size
                          </option>
                          <option value="1-10 employees">1-10 employees</option>
                          <option value="11-50 employees">
                            11-50 employees
                          </option>
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
                        label="Sector"
                        type="text"
                        name="industry_type"
                        value={formData.industry_type || ""}
                        onChange={handleChange}
                      />
                      <InputContact
                        label="Position in Company / Organization"
                        type="text"
                        name="position_in_company"
                        value={formData.position_in_company || ""}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Terms and Conditions */}
        {currentStep === 3 && (
          <div className="flex flex-col sm:flex-row justify-center items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4 px-4">
            <input
              type="checkbox"
              name="termsAgreed"
              id="termsAgreed"
              checked={termsAgreed}
              onChange={(e) => updateTermsAgreed(e.target.checked)}
              className="rounded-md mt-1 sm:mt-0"
            />
            <div className="text-gray-600">
              <div className="flex flex-wrap items-center gap-1">
                <p className="p-1">I agree to the </p>
                <div
                  onClick={handleDisplayTerms}
                  // type="button"
                  className="text-green-600 bg-transparent hover:underline p-1 h-auto cursor-pointer"
                >
                  Terms and Conditions
                  <span className="text-red-500">*</span>
                </div>
                <p className="p-1">and</p>
                <div
                  onClick={handleDisplayPrivacyPoliciesContent}
                  // type="button"
                  className="text-green-600 bg-transparent hover:underline p-1 h-auto cursor-pointer"
                >
                  Privacy Policy
                  <span className="text-red-500">*</span>
                </div>
                <span className="text-gray-600">.</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                By checking this box, you agree to our terms and conditions.
              </p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-center items-center gap-x-4 my-6">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md z-40"
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
                  : "px-8 py-2 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white rounded-md z-40"
              }
              disabled={!isFormComplete}
            >
              Next
            </button>
          )}
          {/* Submit button */}
          {currentStep === 3 && (
            <button
              type="submit"
              className={
                !isFormComplete || !termsAgreed
                  ? "px-8 py-2 bg-gray-300 text-gray-800 rounded-md"
                  : "px-8 py-2 bg-gradient-to-r from-[#5AC35A] to-[#00AE76] text-white rounded-md z-40"
              }
              disabled={!isFormComplete || !termsAgreed || isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <span>Signing Up...</span>
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
                      d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
                    ></path>
                  </svg>
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          )}
        </div>

        {/* Bottom Note */}
        <div className="mt-8 sm:mt-12 text-center z-40 pb-8">
          <p className="text-sm text-gray-600">
            Already a member?{" "}
            <a
              href="/signIn"
              className="text-green-600 font-medium underline z-40"
            >
              Sign in
            </a>
          </p>
        </div>
      </form>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] relative">
            <button
              onClick={handleDisplayTerms}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <CircleX className="h-6 w-6" />
            </button>
            <div className="overflow-y-auto h-[calc(70vh-2rem)] p-6">
              <TermsAndConditions />
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] relative">
            <button
              onClick={handleDisplayPrivacyPoliciesContent}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              type="button"
            >
              <CircleX className="h-6 w-6" />
            </button>
            <div className="overflow-y-auto h-[calc(70vh-2rem)] p-6">
              <PrivacyPolicy />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
