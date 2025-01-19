"use client";

import { UserInfo } from "@/types/schema";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ProfilePage() {
  const { user } = useAuthStore((state) => state as UserInfo);

  if (!user?.user) {
    return <p className="text-center mt-10 text-gray-500">Loading user info...</p>;
  }

  return (
    <main className="flex flex-col items-center p-6 space-y-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-6">
        {/* Avatar */}
        {user?.user.avatar ? (
          <Image
            src={user?.user.avatar}
            alt="User Avatar"
            className="w-24 h-24 mx-auto rounded-full shadow-md mb-4"
          />
        ) : (
          <div className="w-24 h-24 mx-auto rounded-full shadow-md bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold mb-4">
            {user?.user.firstname?.[0] || user?.user.lastname?.[0] || "?"}
          </div>
        )}

        {/* User Info */}
        <h1 className="text-2xl text-black/50 font-bold text-center mb-2">
          {user?.user.firstname || ""} {user?.user.lastname || ""}
        </h1>
        <p className="text-center text-gray-500 mb-4">{user?.user.email}</p>

        {/* Base Info */}
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {user?.user.phone || "Not specified"}
          </p>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {user?.user.address || "Not specified"}
          </p>
          <p>
            <span className="font-semibold">Age Range:</span>{" "}
            {user?.user.age || "Not specified"}
          </p>
          <p>
            <span className="font-semibold">Gender:</span>{" "}
            {user?.user.gender || "Not specified"}
          </p>
        </div>

        {/* Role and Category */}
        {user?.user.role === "admin" && (
          <p className="mt-4 text-center text-sm text-gray-500 bg-gray-100 rounded py-1">
            Role: Admin
          </p>
        )}
        {user?.user.role === "user" && (
          <>
            <p className="mt-4 text-center text-sm text-gray-500 bg-gray-100 rounded py-1">
              Role: User ({user?.user.categories})
            </p>
            {user?.user.categories === "student" && (
              <div className="mt-4">
                <p>
                  <span className="font-semibold">Institution:</span>{" "}
                  {user?.user.studentInfo?.institution_name || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Major Subject:</span>{" "}
                  {user?.user.studentInfo?.major_subject || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Graduation Year:</span>{" "}
                  {user?.user.studentInfo?.expected_graduation_year || "Not specified"}
                </p>
              </div>
            )}
            {user?.user.categories === "job seeker" && (
              <div className="mt-4">
                <p>
                  <span className="font-semibold">Desired Job:</span>{" "}
                  {user?.user.jobSeekerInfo?.desired_job_title || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Skills:</span>{" "}
                  {user?.user.jobSeekerInfo?.skills || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Work Experience:</span>{" "}
                  {user?.user.jobSeekerInfo?.years_of_work_experience
                    ? `${user?.user.jobSeekerInfo.years_of_work_experience} years`
                    : "Not specified"}
                </p>
              </div>
            )}
            {user?.user.categories === "employer" && (
              <div className="mt-4">
                <p>
                  <span className="font-semibold">Company Name:</span>{" "}
                  {user?.user.employerInfo?.company_name || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Company Size:</span>{" "}
                  {user?.user.employerInfo?.company_size || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Industry:</span>{" "}
                  {user?.user.employerInfo?.industry_type || "Not specified"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
