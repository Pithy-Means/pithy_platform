"use client";

import { UserInfo } from "@/types/schema";
import Image from "next/image";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ProfilePage() {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  console.log("Use Category", user);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg animate-pulse">Loading user info...</p>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center">
      <div className="w-full bg-white shadow-lg rounded-3xl p-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          {user?.avatar ? (
            <Image
              src={user?.avatar}
              alt="User Avatar"
              width={96}
              height={96}
              className="w-24 h-24 rounded-full shadow-md mb-4"
            />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center rounded-full shadow-md bg-gray-200 mb-4 text-gray-700 text-xl font-semibold">
              {user.firstname?.[0] || user?.lastname?.[0] || "?"}
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900">
            {user?.firstname || ""} {user?.lastname || ""}
          </h1>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-gray-700">
          <InfoCard label="Phone" value={user?.phone || "Not specified"} />
          <InfoCard label="Address" value={user?.country || "Not specified"} />
          <InfoCard label="Age Range" value={user?.age || "Not specified"} />
          <InfoCard label="Gender" value={user?.gender || "Not specified"} />
        </div>

        {/* Role and Category Section */}
        <div className="mt-8">
          {user?.categories === "student" && (
            <CategoryInfo
              title="Student Details"
              data={{
                Institution: user?.institution_name,
                "Major Subject": user?.major_subject,
                "Graduation Year": user?.expected_graduation_year,
              }}
            />
          )}
          {user?.categories === "job seeker" && (
            <CategoryInfo
              title="Job Seeker Details"
              data={{
                "Desired Job": user?.desired_job_title,
                Skills: user?.skills,
                "Work Experience": user?.years_of_work_experience
                  ? `${user?.years_of_work_experience} years`
                  : "Not specified",
              }}
            />
          )}
          {user?.categories === "employer" && (
            <CategoryInfo
              title="Employer Details"
              data={{
                "Company Name": user?.company_name,
                "Company Size": user?.company_size,
                Industry: user?.industry_type,
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
    <p className="font-semibold text-gray-600">{label}</p>
    <p className="text-gray-800">{value}</p>
  </div>
);

const CategoryInfo = ({
  title,
  data,
}: {
  title: string;
  data: Record<string, string | undefined>;
}) => (
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <p key={key} className="text-gray-700">
          <span className="font-semibold">{key}:</span> {value || "Not specified"}
        </p>
      ))}
    </div>
  </div>
);
