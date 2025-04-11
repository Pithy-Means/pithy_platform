// lib/validations/auth-schema.ts
import { z } from "zod";

// Base user info validation schema
export const baseUserSchema = z.object({
  firstname: z.string().min(3, "First name must be at least 3 characters").max(50),
  lastname: z.string().min(3, "Last name must be at least 3 characters").max(50),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  country: z.string().min(3, "Country name must be at least 3 characters"),
  city: z.string().min(3, "City name must be at least 3 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

// Age step validation schema
export const ageSchema = z.object({
  age: z.enum(["16-25", "26-35", "36-45", "46 and +"], {
    required_error: "Please select your age group",
  }),
});

// Gender step validation schema
export const genderSchema = z.object({
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender",
  }),
});

// Category step validation schema
export const categorySchema = z.object({
  categories: z.enum(["student", "job seeker", "employer"], {
    required_error: "Please select a category",
  }),
});

// Student category schema
export const studentSchema = z.object({
  education_level: z.string().min(3, "Please select an education level"),
  institution_name: z.string().min(3, "Institution name is required"),
  major_subject: z.string().min(3, "Major subject is required"),
  expected_graduation_year: z
    .number()
    .min(new Date().getFullYear(), "Year must be current or future")
    .or(z.string().regex(/^\d+$/).transform(Number)),
});

// Job seeker category schema
export const jobSeekerSchema = z.object({
  desired_job_title: z.string().min(2, "Job title is required"),
  skills: z.string().min(2, "Skills are required"),
  years_of_work_experience: z
    .number()
    .min(0, "Experience must be a positive number")
    .or(z.string().regex(/^\d+$/).transform(Number)),
  availability_status: z.string().min(1, "Please select availability status"),
});

// Employer category schema
export const employerSchema = z.object({
  company_name: z.string().min(2, "Company name is required"),
  company_size: z.string().min(1, "Please select company size"),
  industry_type: z.string().min(2, "Industry type is required"),
  position_in_company: z.string().min(2, "Position is required"),
});

// Create conditional validation schema based on selected category
export const createUserValidationSchema = (category: string | undefined) => {
  const baseSchema = baseUserSchema.merge(ageSchema).merge(genderSchema).merge(categorySchema);

  if (!category) return baseSchema;

  switch (category) {
    case "student":
      return baseSchema.merge(studentSchema);
    case "job seeker":
      return baseSchema.merge(jobSeekerSchema);
    case "employer":
      return baseSchema.merge(employerSchema);
    default:
      return baseSchema;
  }
};