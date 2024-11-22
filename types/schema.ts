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
  education_level?:
    | "Tertiary"
    | "High School"
    | "Bachelor’s"
    | "Diploma"
    | "Master’s"
    | "PhD";
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
  company_size?:
    | "1-10 employees"
    | "11-50 employees"
    | "51-200 employees"
    | "201-500 employees"
    | "501+ employees";
  industry_type?: string;
  position_in_company?: string;
  job_posting_count?: number;
  url?: string;
};

export type LoginInfo = {
  email: string;
  password: string;
};

export type ResetPass = {
  email: string;
  url?: string;
};

export type UpdateUser = {
  user_id?: string;
  secret?: string;
  password: string;
  passwordAgain: string;
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
  education_level?:
    | "Tertiary"
    | "High School"
    | "Bachelor’s"
    | "Diploma"
    | "Master’s"
    | "PhD";
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
  company_size?:
    | "1-10 employees"
    | "11-50 employees"
    | "51-200 employees"
    | "201-500 employees"
    | "501+ employees";
  industry_type?: string;
  position_in_company?: string;
  job_posting_count?: number;
};

export type GetUserInfo = {
  userId: string;
};

// Define the Post type based on the collection's fields
export type Post = {
  post_id?: string; // Unique identifier for the post
  user_id?: string; // User ID of the post creator
  content?: string; // Content of the post
  created_at?: string; // Optional, creation date
  updated_at?: string; // Optional, last updated date
  repost_of?: string; // ID of the original post if this is a repost
  user_comment?: string; // Additional user content on top of the reposted content
};

export type PostWithUser = {
  post_id?: string;
  user_id?: string;
  content?: string;
  created_at?: string;
  updated_at?: string;
  user?: { name: string };
};

// Define the type for the CommentPost collection
export interface CommentPost {
  user_id: string; // Unique ID of the user who made the comment
  post_id: string; // ID of the post the comment is associated with
  comment_id: string; // Unique ID of the comment
  comment: string; // Content of the comment, max length 1000 characters
  created_at?: string; // Timestamp when the comment was created
  updated_at?: string; // Timestamp when the comment was last updated
  user?: { name: string }; // User information associated with the comment
}

export type LikePost = {
  like_post_id: string; // ID for the like
  user_id: string; // ID of the user who liked the post
  post_id: string; // ID of the post being liked
  isLiked?: boolean; // Boolean to indicate a like
  created_at?: string; // Optional timestamp for when the like was created
  updated_at?: string; // Optional timestamp for the last update
  user?: { name: string }; // User information associated with the like
};

export interface PaymentData {
  amount: number;
  currency: string;
  tx_ref: string;
  email: string;
  phone_number: string;
  network: string;
}

export interface PaymentResponse {
  status: string;
  message: string;
  redirect?: string;
  tx_ref?: string;
}

export interface CardPaymentData {
  card_number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  currency: string;
  amount: number;
  email: string;
  tx_ref: string;
  redirect_url: string;
  fullname: string;
  phone_number: string;
  enckey: string;
}
