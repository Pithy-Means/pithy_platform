  "use client";

  import React, { useEffect, useState } from "react";
  import { getJobs } from "@/lib/actions/user.actions";
  import { Job } from "@/types/schema";
import { Card } from "./ui/card";
import { useRouter } from "next/navigation";

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
            <p className="text-blue-500 text-xl font-medium animate-pulse">
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
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
                >
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {job.job_title}
                  </h2>
                  <p className="text-gray-600 mb-4">{job.job_description}</p>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>{job.employer}</p>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    <p>
                      <strong>Location:</strong> {job.location_of_work}
                    </p>
                    <p>
                      <strong>Country:</strong> {job.country_of_work}
                    </p>
                    <p>
                      <strong>Closing Date:</strong>{" "}
                      {new Date(job.closing_date).toLocaleDateString()}
                    </p>
                  </div>
                  <a
                    href={job.application_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 text-sm font-medium text-white bg-[#5AC35A] hover:bg-green-700 rounded transition-colors duration-200"
                  >
                    Apply Now
                  </a>
                </Card>
              ))}
            </div>
          </>
        ) : (
          !loading && (
            <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
            <p className="text-blue-500 text-xl font-medium animate-pulse">
              No jobs found. Check back later.
            </p>
          </div>
          )
        )}
      </div>
    );
  };

  export default JobList;
