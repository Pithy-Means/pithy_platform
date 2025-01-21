"use client";

import React, { useEffect, useState } from "react";
import { getJobs } from "@/lib/actions/user.actions";
import { Job } from "@/types/schema";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";
import { FaBlackTie } from "react-icons/fa6";
import { FaMarker } from "react-icons/fa";
import { CalendarCheck, Globe2Icon } from "lucide-react";

const JobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getJobs();
        console.log("Jobs", data);
        setJobs(data.documents || []);
      } catch (err) {
        setError("Failed to fetch jobs. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen p-6 relative">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
          <p className="text-green-500 text-xl font-medium animate-pulse">
            Loading jobs...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

      {jobs.length > 0 ? (
        <>
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800">
              Explore Your Dream Job
            </h1>
            <p className="text-gray-600 mt-2">
              Browse through job listings and find the right opportunity for
              you.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <Card
                key={job.job_id}
                onClick={() => router.push(`/dashboard/jobs/${job.job_id}`)}
                className="relative p-8 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-lg border border-green-200 rounded-[20px] shadow-2xl hover:shadow-[0_8px_30px_rgba(72,191,145,0.5)] transition-transform duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 bg-[url('/assets/woman.png')] bg-cover bg-center rounded-[20px] opacity-20 z-0"></div>

                {/* Content Wrapper */}
                <div className="relative z-10">
                  {/* Decorative Tag */}
                  <div className="absolute -top-4 right-4 px-4 py-2 bg-gradient-to-r from-green-400 to-green-700 text-white text-sm font-semibold rounded-full shadow-md">
                    Hot Job
                  </div>

                  {/* Job Title */}
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-4 hover:text-green-600 transition-colors duration-300">
                    {job.job_title}
                  </h2>

                  {/* Job Description */}
                  <p className="text-gray-700 text-lg mb-6 line-clamp-4 leading-relaxed">
                    {job.job_description}
                  </p>

                  {/* Job Details with Icons */}
                  <div className="grid grid-cols-2 gap-y-3 mb-8">
                    <p className="flex items-center text-sm text-gray-600">
                      <span className="text-green-600 mr-2">
                        <FaBlackTie size={24} />
                      </span>
                      Employer:{" "}
                      <span className="ml-1 font-medium">{job.employer}</span>
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <span className="text-green-600 mr-2">
                        <FaMarker size={24} />
                      </span>
                      Location:{" "}
                      <span className="ml-1 font-medium">
                        {job.location_of_work}
                      </span>
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <span className="text-green-600 mr-2">
                        <Globe2Icon />
                      </span>
                      Country:{" "}
                      <span className="ml-1 font-medium">
                        {job.country_of_work}
                      </span>
                    </p>
                    <p className="flex items-center text-sm text-gray-600">
                      <span className="text-green-600 mr-2">
                        <CalendarCheck />
                      </span>
                      Closing Date:{" "}
                      <span className="ml-1 font-medium">
                        {new Date(job.closing_date).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
            <p className="text-green-500 text-xl font-medium animate-pulse">
              No jobs found. Check back later.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default JobList;
