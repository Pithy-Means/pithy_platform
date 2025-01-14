"use client";

import React, { FC, useState, useEffect } from "react";
import { getJob } from "@/lib/actions/user.actions";
import { Job } from "@/types/schema";
import { useParams } from "next/navigation";

const JobDetail: FC = () => {
  const { job_id } = useParams();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (job_id) {
      const fetchData = async () => {
        const validJobId = Array.isArray(job_id) ? job_id[0] : job_id;
        const data = await getJob(validJobId);
        console.log("Job data", data);
        setJob(data);
      };
      fetchData();
    }
  }, [job_id]);

  if (!job) return <div className="text-center text-gray-500 mt-10">Loading...</div>;

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-lg border border-gray-200 mt-10 mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{job.job_title}</h1>
      <p className="text-gray-800 leading-relaxed mb-4">{job.job_description}</p>
      <div className="space-y-2">
        <p className="text-gray-600">
          <span className="font-semibold">Country of Work:</span> {job.country_of_work}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Employer:</span> {job.employer}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Location:</span> {job.location_of_work}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Posted On:</span> {job.job_earlier}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Closing Date:</span> {job.closing_date}
        </p>
      </div>
      <a
        href={job.application_link}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-6 text-center bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Apply Now
      </a>
    </div>
  );
};

export default JobDetail;
