export type UserInfo = {
  user_id: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  email: string;
  password: string;
  role?: "admin" | "user";
  avatar?: string;
  phone?: string;
  address?: string;
  age?: "18-25" | "26-35" | "36-45" | "46 and +";
  gender?: "male" | "female";
  categories?: "student" | "job seeker" | "employer";

  // Attributes specific to 'student'
  education_level?: "Tertiary" | "High School" | "Bachelor’s" | "Diploma" | "Master’s" | "PhD";
  institution_name?: string;
  major_subject?: string;
  expected_graduation_year?: number;

  // Attributes specific to 'job seeker'
  desired_job_title?: string;
  skills?: string;
  years_of_work_experience?: number;
  resume_link?: string;
  availability_status?: "immediately available" | "open to opportunities";

  // Attributes specific to 'employer'
  company_name?: string;
  company_size?: "1-10 employees" | "11-50 employees" | "51-200 employees" | "201-500 employees" | "501+ employees";
  industry_type?: string;
  position_in_company?: string;
  job_posting_count?: number;
};

export type LoginInfo = {
  email: string;
  password: string;
};

export type User = {
  $id: string;
  $created: number;
  $updated: number;
  firstname?: string;
  lastname?: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
  phone?: string;
  address?: string;
  age?: "18-25" | "26-35" | "36-45" | "46 and +";
  categories?: "student" | "job seeker" | "employer";
    // Attributes specific to 'student'
    education_level?: "Tertiary" | "High School" | "Bachelor’s" | "Diploma" | "Master’s" | "PhD";
    institution_name?: string;
    major_subject?: string;
    expected_graduation_year?: number;
  
    // Attributes specific to 'job seeker'
    desired_job_title?: string;
    skills?: string;
    years_of_work_experience?: number;
    resume_link?: string;
    availability_status?: "immediately available" | "open to opportunities";
  
    // Attributes specific to 'employer'
    company_name?: string;
    company_size?: "1-10 employees" | "11-50 employees" | "51-200 employees" | "201-500 employees" | "501+ employees";
    industry_type?: string;
    position_in_company?: string;
    job_posting_count?: number;
};

export type GetUserInfo = {
  userId: string;
};