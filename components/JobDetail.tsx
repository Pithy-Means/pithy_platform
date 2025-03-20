"use client";

import React, { FC, useState, useEffect } from "react";
import { getJob } from "@/lib/actions/user.actions";
import { Job } from "@/types/schema";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  FaTwitter,
  FaFacebook,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const JobDetail: FC = () => {
  const { job_id } = useParams();
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (job_id) {
      const fetchData = async () => {
        const validJobId = Array.isArray(job_id) ? job_id[0] : job_id;
        const data = await getJob(validJobId);
        console.log("Job data", data);
        toast.success("Job details fetched successfully");
        setJob(data);
      };
      fetchData();
    }
  }, [job_id]);

  if (!job) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
        <p className="text-green-500 text-xl font-medium animate-pulse">
          Loading job...
        </p>
      </div>
    );
  }

  return (
    <main className="w-full mx-auto p-8 mt-2 bg-gray-50 rounded-3xl shadow-2xl border border-gray-300 relative">
      <Toaster reverseOrder={false} />
      {/* Header Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-200 text-white rounded-t-3xl shadow-lg p-10">
        <h1 className="text-4xl font-bold">{job.job_title}</h1>
        <p className="mt-4 text-lg">{job.job_description}</p>
        <p className="mt-6 text-sm italic text-gray-200">
          Posted on: {new Date(job.job_earlier).toLocaleDateString()}
        </p>
        <Image
          src="/assets/logo.png"
          alt="Company Logo"
          className="h-16 w-16 object-contain"
          width={64}
          height={64}
        />
      </section>

      {/* Job Details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Job Details
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li>
              <strong>Country of Work:</strong> {job.country_of_work}
            </li>
            <li>
              <strong>Location:</strong> {job.location_of_work}
            </li>
            <li>
              <strong>Employer:</strong> {job.employer}
            </li>
            <li>
              <strong>Closing Date:</strong>{" "}
              {new Date(job.closing_date).toLocaleDateString()}
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How to Apply
          </h2>
          <p className="text-gray-700">
            Interested candidates can apply directly using the link below:
          </p>
          <a
            href={job.application_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
          >
            Apply Now
          </a>
        </div>
      </section>

      {/* Additional Info */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800">Why Join Us?</h2>
        <p className="mt-4 text-lg text-gray-700">
          At {job.employer}, we believe in nurturing talent and providing growth
          opportunities. Our team is committed to excellence, innovation, and
          making a difference in the industry. By joining us, you&apos;ll be
          part of a dynamic and inclusive workplace.
        </p>
      </section>

      {/* Share Section */}
      <section className="mt-12 bg-gray-100 p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Share This Opportunity
        </h2>
        <div className="flex items-center gap-4">
          <a
            href={`https://twitter.com/share?text=Check%20out%20this%20job%20${job.job_title}&url=${encodeURIComponent(
              job.application_link,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-400 text-white rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
          >
            <FaTwitter /> Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              job.application_link,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            <FaFacebook /> Facebook
          </a>
          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(
              job.application_link,
            )}&text=Check%20out%20this%20job%20${job.job_title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
          >
            <FaTelegram /> Telegram
          </a>
          <a
            href={`https://wa.me/?text=Check%20out%20this%20job%20${job.job_title}%20${encodeURIComponent(
              job.application_link,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
          >
            <FaWhatsapp /> WhatsApp
          </a>
          <a
            href={`mailto:?subject=Check%20out%20this%20job!&body=Here's%20a%20great%20job%20opportunity:%20${job.job_title}%20-%20${encodeURIComponent(
              job.application_link,
            )}`}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
          >
            <FaEnvelope /> Email
          </a>
        </div>
      </section>
      <section className="mt-8 flex justify-end items-center gap-4">
        <a
          href="/dashboard/jobs"
          className="bg-green-400 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg text-center transition duration-300"
        >
          Back to Job Listings
        </a>
      </section>
    </main>
  );
};

export default JobDetail;
