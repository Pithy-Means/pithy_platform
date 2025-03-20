"use client";

import { useState } from "react";
import { UserInfo } from "@/types/schema";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { updateUserProfile } from "@/lib/actions/user.actions";
import toast, { Toaster } from "react-hot-toast"; // Import toast

export default function EditProfilePage() {
  const { user, setUser } = useAuthStore(
    (state) =>
      state as unknown as {
        user: UserInfo;
        setUser: (user: UserInfo) => void;
      },
  );

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserInfo>>(user || {});

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading user info...
        </p>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clean up the data for submission
      const dataToSubmit = { ...formData };

      // Format category-specific data based on selected category
      if (formData.categories) {
        if (formData.categories === "student") {
          education_level: formData.education_level as string;
          institution_name: formData.institution_name;
          major_subject: formData.major_subject;
          expected_graduation_year: Number(formData.expected_graduation_year);
        }

        if (formData.categories === "job seeker") {
          desired_job_title: formData.desired_job_title;
          skills: formData.skills;
          years_of_work_experience: Number(formData.years_of_work_experience);
          resume_link: formData.resume_link;
          availability_status: formData.availability_status as string;
        }
        if (formData.categories === "employer") {
          company_name: formData.company_name;
          company_size: formData.company_size as string;
          industry_type: formData.industry_type;
          position_in_company: formData.position_in_company;
          url: formData.url;
        }
      }

      const result = await updateUserProfile(user.user_id, dataToSubmit);
      console.log("Profile updated:", result);

      setUser({ ...user, ...dataToSubmit } as UserInfo);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please, try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[70vh] overflow-auto rounded-md shadow-md bg-gray-100">
      {/* Add Toaster component to render notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "#10B981",
              color: "white",
            },
            duration: 3000,
          },
          error: {
            style: {
              background: "#EF4444",
              color: "white",
            },
            duration: 4000,
          },
        }}
      />

      <main className="flex items-center justify-center py-4">
        <div className="w-full max-w-4xl bg-white rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-6">
            Edit Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
              {user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt="User Avatar"
                  width={96}
                  height={96}
                  className="w-20 h-20 rounded-full shadow-md mb-4"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center rounded-full shadow-md bg-gray-200 mb-4 text-gray-700 text-xl font-semibold">
                  {user.firstname?.[0] || user?.lastname?.[0] || "?"}
                </div>
              )}
              {/* Avatar upload could be added here */}
            </div>

            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Changing email requires password verification
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Range
                  </label>
                  <select
                    name="age"
                    value={formData.age || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Age Range</option>
                    <option value="18-25">18-25</option>
                    <option value="26-35">26-35</option>
                    <option value="36-45">36-45</option>
                    <option value="46 and +">46 and +</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Category Selection */}
            <section>
              <h2 className="text-xl font-semibold mb-4">User Category</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="categories"
                  value={formData.categories || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select Category</option>
                  <option value="student">Student</option>
                  <option value="job seeker">Job Seeker</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
            </section>

            {/* Category-specific fields */}
            {formData.categories === "student" && (
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  Student Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education Level
                    </label>
                    <select
                      name="education_level"
                      value={formData.education_level || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      name="institution_name"
                      value={formData.institution_name || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Major Subject
                    </label>
                    <input
                      type="text"
                      name="major_subject"
                      value={formData.major_subject || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Graduation Year
                    </label>
                    <input
                      type="number"
                      name="expected_graduation_year"
                      value={formData.expected_graduation_year || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </section>
            )}

            {formData.categories === "job seeker" && (
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  Job Seeker Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Desired Job Title
                    </label>
                    <input
                      type="text"
                      name="desired_job_title"
                      value={formData.desired_job_title || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Skills
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                      placeholder="Separate skills with commas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      name="years_of_work_experience"
                      value={formData.years_of_work_experience || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume Link
                    </label>
                    <input
                      type="url"
                      name="resume_link"
                      value={formData.resume_link || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <select
                      name="availability_status"
                      value={formData.availability_status || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
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
              </section>
            )}

            {formData.categories === "employer" && (
              <section>
                <h2 className="text-xl font-semibold mb-4">
                  Employer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Size
                    </label>
                    <select
                      name="company_size"
                      value={formData.company_size || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="">Select Company Size</option>
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="51-200 employees">51-200 employees</option>
                      <option value="201-500 employees">
                        201-500 employees
                      </option>
                      <option value="501+ employees">501+ employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry Type
                    </label>
                    <input
                      type="text"
                      name="industry_type"
                      value={formData.industry_type || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position in Company
                    </label>
                    <input
                      type="text"
                      name="position_in_company"
                      value={formData.position_in_company || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url || ""}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* Password Update Section (Optional) */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Update Password (Optional)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center pt-4 pb-8">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 rounded-lg font-medium text-white ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
