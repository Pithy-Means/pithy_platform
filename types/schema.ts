// import { z} from 'zod';
//Base user info type (common fields for all users)
export type BaseUserInfo = {
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
  secret?: string;
};

//User categories
export type UserCategories = "student" | "job seeker" | "employer";

//Admin-specific information
export type AdminInfo = {
  // admin_level?: "super" | "moderator " // Admin level can be 'super' or 'moderator'
  role: "admin"; // Role is always 'admin'
  categories?: never; // Admins do not have categories
};

//Regular user information(non-admins)
export type RegularUserInfo = {
  role: "user"; // Role is always 'user'
  categories: UserCategories; // Categories required for regular users
} & (
  | { categories: "student"; studentInfo: StudentInfo } // Student user
  | { categories: "job seeker"; jobSeekerInfo: JobSeekerInfo } // Job seeker user
  | { categories: "employer"; employerInfo: EmployerInfo } // Employer user
);

//Category-sp studentInfo
export type StudentInfo = {
  education_level?:
    | "High School"
    | "Tertiary"
    | "Diploma"
    | "Bachelors"
    | "Masters"
    | "PhD";
  institution_name?: string;
  major_subject?: string;
  expected_graduation_year?: number;
};

// Category specific to 'job seeker'
export type JobSeekerInfo = {
  desired_job_title?: string;
  skills?: string;
  years_of_work_experience?: number;
  resume_link?: string;
  availability_status?: "immediately available" | "open to opportunities";
};

// Category specific to 'employer'
export type EmployerInfo = {
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

//Comprehensive user info type
export type UserInfo = BaseUserInfo & (AdminInfo | RegularUserInfo);

//User type
export type User = {
  user_id: string;
  userInfo: UserInfo;
};

export type GetUserInfo = {
  userId: string;
};

//Login info type
export type LoginInfo = Pick<UserInfo, "email" | "password">;

export type UpdateUser = {
  user_id?: string;
  secret?: string;
  password: string;
  passwordAgain: string;
};

export type ResetPass = {
  email: string;
  url?: string;
};

// Define the Post type based on the collection's fields
// Define the Post type based on the collection's fields
export type Post = {
  post_id?: string; // Unique identifier for the post
  user_id?: string; // User ID of the post creator
  content?: string; // Content of the post
  image?: string; // URL or path to the post image
  video?: string; // URL or path to the post video
  mediaInfo?: string; // URL or path to the post video or image
  repost_of?: string; // ID of the original post if this is a repost
  user_comment?: string; // Additional user content on top of the reposted content
};

//post with user info
export type PostWithUser = Post & {
  user: Partial<UserInfo>; //Associate user details with the post
};

// Define the type for the CommentPost collection
export interface CommentPost {
  userid: string; // Unique ID of the user who made the comment
  post_id: string; // ID of the post the comment is associated with
  comment_id: string; // Unique ID of the comment
  comment: string; // Content of the comment, max length 1000 characters
  user?: Partial<UserInfo>; // User information associated with the comment
}

export type LikePost = {
  like_post_id: string; // ID for the like
  user_id: string; // ID of the user who liked the post
  post_id: string; // ID of the post being liked
  isLiked?: boolean; // Boolean to indicate a like
  user?: Partial<UserInfo>; // User information associated with the like
};

export type FormDataState =
  | Partial<BaseUserInfo> // Common fields for all users
  | (Partial<BaseUserInfo> &
      RegularUserInfo & {
        categories?: "student";
        studentInfo?: Partial<StudentInfo>;
      })
  | (Partial<BaseUserInfo> &
      RegularUserInfo & {
        categories?: "job seeker";
        jobSeekerInfo?: Partial<JobSeekerInfo>;
      })
  | (Partial<BaseUserInfo> &
      RegularUserInfo & {
        categories?: "employer";
        employerInfo?: Partial<EmployerInfo>;
      });

export interface PaymentData {
  status?: string;
  user_id?: string;
  payment_id?: string;
  amount: number;
  currency?: string;
  tx_ref: string;
  email?: string;
  phone_number?: string;
  network?: string;
  redirect_url?: string;
  voucher?: string;
  course_choice?: string;
}

export interface PaymentResponse {
  status: string;
  message: string;
  redirect?: string;
  data?: FlutterwaveWebhookData;
}

export type FlutterwaveWebhookData = {
  id: number;
  tx_ref: string;
  status: Status;
  message: string;
  amount: number;
  currency: string;
  customer: UserInfo;
};

type Status = "success" | "error";

export interface VerifyPaymentResponse {
  status: 'success' | 'failed';
  message?: string;
  data?: PaymentData;
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

export type Courses = {
  course_id: string; // Unique identifier for the course
  user_id: string; // ID of the user who created the course
  title: string; // Title of the course
  description: string; // Detailed description of the course
  price: number; // Price of the course
  duration: string; // Duration of the course (e.g., "2 hours", "3 weeks")
  image: string; // Optional: URL or path to the course image
  requirements?: string; // Optional: Prerequisites for the course
  students?: string[]; // Array of student objects with name, email, and locked status
  student_email?: string[]; // Array of student emails
  categories?: string; // Optional: Category of the course (e.g., "Programming", "Design")
};


export type VideoFile = {
  vid: File;
}

// types/job.ts
export interface Job {
  job_id: string;
  user_id: string;
  job_title: string;
  location_of_work: string;
  job_description: string;
  country_of_work: string;
  job_earlier: string;
  closing_date: string;
  application_link: string;
  employer: string;
}

type ModuleStatus = 'open' | 'closed';

export type Modules = {
  module_id: string;                // Required: Unique identifier for the module
  course_id?: string;                // Required: Identifier for the course this module belongs to
  module_title?: string;            // Optional: Title of the module
  module_description?: string;      // Optional: Short description of the module
  video: string;            // Optional: Link or identifier to the video content
  module_duration?: string;         // Optional: Duration of the module (e.g., "30 minutes")
  module_comment?: string;          // Optional: Any comments or notes about the module
  module_status?: ModuleStatus;     // Optional: Status of the module (either "open" or "closed")
}

export type PostCourseQuestion = {
  post_course_question_id: string;
  user_id: string;
  question: string;
  choices?: string[];
}

export type PostCourseQuestionAnswer = {
  post_course_question_id: string;
  username: string;
  answer_id: string;
  answer: string;
}