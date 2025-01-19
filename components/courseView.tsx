/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import CourseCard from "./CourseCard";
import CourseList from "./CourseList";
import { Courses, UserInfo } from "@/types/schema";
import { LayoutGrid, List } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCourseStore } from "@/lib/store/courseStore";
import { useAuthStore } from "@/lib/store/useAuthStore";

const CourseView: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [courses, setCourses] = useState<Courses[]>([]);

  const { setLocked, isLocked } = useCourseStore();

  console.log("Locked", isLocked);

  const router = useRouter();
  const { user } = useAuthStore((state) => state as UserInfo);

  // Fetch courses from the API
  const fetchCourses = useCallback(
    async (userCategory: string) => {
      setLoading(true);
      try {
        const response = await fetch("/api/get-courses", { method: "GET" });
        const data = await response.json();
        if (!response.ok || !data?.data) {
          throw new Error(data?.message || "Failed to fetch courses."); // Throw an error if the response is not okay
        }
        console.log("Courses", data.data);
        const filteredData = data.data.filter((course: Courses) => {
          console.log("Course Categories", course.categories?.toLowerCase());
          return course.categories?.toLowerCase() === userCategory;
        });
        console.log("Filtered Courses before", filteredData);
        setLocked(filteredData.isLocked);
        setCourses(filteredData);
      } catch (error) {
        setError((error as Error).message || "Error fetching courses");
      } finally {
        setLoading(false);
      }
    },
    [setLocked] // Re-run the function when the dispatch function changes
  );

  // Fetch courses once when the component mounts
  useEffect(() => {
    if (user && user?.user.categories) {  
        fetchCourses(user?.user.categories.toLowerCase());
    }
  }, [user, fetchCourses]);

  return (
    <div className="w-full h-full">
      {/* Header Section */}
      <div className="w-[calc(100vw-210px)] p-16 ">
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

      {/* Admin and User Welcome Section */}
      <div className="flex justify-end items-center">
        <p className="text-gray-800 text-lg px-16">
          Welcome: <span className="font-bold">{user?.user.firstname}</span>
        </p>
        {user?.user.role === "admin" && (
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
    </div>
  );
};

export default CourseView;
