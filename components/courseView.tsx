"use client";

import React, { useState, useEffect, useContext } from "react";
import CourseCard from "./CourseCard";
import CourseList from "./CourseList";
import { Courses } from "@/types/schema";
import { LayoutGrid, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";

const CourseView: React.FC = () => {
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const router = useRouter();
  const { user } = useContext(UserContext);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/get-courses", { method: "GET" });
      const response = await data.json();
      console.log("Courses:", response.data);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="w-full min-h-screen">
      {/* Header Section */}
      <div className="w-[calc(100vw-410px)] py-8 px-16">
        <div className="flex justify-between items-center">
          <p className="text-xl font-extrabold text-gray-800">All Courses</p>
          <div className="flex gap-2">
            <button
              onClick={() => setLayout("grid")}
              className={`p-0.5 rounded transition-all duration-500 ease-in-out ${
                layout === "grid" ? "bg-green-600 text-white" : "text-green-600"
              }`}
            >
              <LayoutGrid size={24} strokeWidth={3} />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`p-0.5 rounded transition-all duration-500 ease-in-out ${
                layout === "list" ? "bg-green-600 text-white" : "text-green-600"
              }`}
            >
              <List size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center">
        <p className="text-gray-800 text-lg px-16">
          Welcome: <span className="font-bold">{user?.firstname}</span>
        </p>
        {user?.role === "admin" && (
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-md mr-16"
            onClick={() => router.push("/admin/addcourse")}
          >
            Create Course
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-red-600">{error}</p>
          </div>
        ) : layout === "grid" ? (
          <CourseCard courses={courses} />
        ) : (
          <CourseList courses={courses} />
        )}
      </div>

      {/* Modal */}
      {modalMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-medium text-gray-800">{modalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setModalMessage(null)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;
