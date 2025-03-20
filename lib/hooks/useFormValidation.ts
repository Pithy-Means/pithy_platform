"use client";

import { useState, useEffect } from "react";
import {
  BaseUserInfo,
  UserCategories,
  StudentInfo,
  JobSeekerInfo,
  EmployerInfo,
} from "@/types/schema";

// Define the complete form data type including all possible fields
type FormDataType = BaseUserInfo & {
  categories?: UserCategories;
  studentInfo?: StudentInfo;
  jobSeekerInfo?: JobSeekerInfo;
  employerInfo?: EmployerInfo;
};

// Custom hook to handle form validation based on current step
export const useFormValidation = (
  formData: Partial<FormDataType>,
  currentStep: number,
) => {
  // State to track whether the current step is complete
  const [isFormComplete, setIsFormComplete] = useState(false);

  useEffect(() => {
    // Function to validate fields based on current step
    const validateStep = () => {
      switch (currentStep) {
        case 0: // Basic Info step
          const basicFields: (keyof BaseUserInfo)[] = [
            "firstname",
            "lastname",
            "email",
            "password",
            "phone",
            "address",
          ];
          return basicFields.every((field) => !!formData[field]);

        case 1: // Age step
          return formData.age !== undefined && formData.age !== null;

        case 2: // Gender step
          return formData.gender !== undefined && formData.gender !== null;

        case 3: // Categories and specific info step
          if (!formData.categories) return false;

          // Validate category-specific fields
          switch (formData.categories) {
            case "student":
              return (
                !!formData.studentInfo?.education_level &&
                !!formData.studentInfo?.institution_name &&
                !!formData.studentInfo?.major_subject &&
                !!formData.studentInfo?.expected_graduation_year
              );

            case "job seeker":
              return (
                !!formData.jobSeekerInfo?.desired_job_title &&
                !!formData.jobSeekerInfo?.skills &&
                !!formData.jobSeekerInfo?.years_of_work_experience &&
                !!formData.jobSeekerInfo?.availability_status
              );

            case "employer":
              return (
                !!formData.employerInfo?.company_name &&
                !!formData.employerInfo?.company_size &&
                !!formData.employerInfo?.industry_type &&
                !!formData.employerInfo?.position_in_company
              );
            default:
              return false;
          }
        default:
          return false;
      }
    };

    // Update form completion status
    setIsFormComplete(validateStep());
  }, [formData, currentStep]);

  return isFormComplete;
};
