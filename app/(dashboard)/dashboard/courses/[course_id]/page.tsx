"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Courses, UserInfo } from "@/types/schema";
import ModuleForm from "@/components/ModuleForm"; // Import ModuleForm
import ModulesPage from "@/components/ModulesPage";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/store/useAuthStore";


const CourseDetail = () => {
  const { course_id } = useParams(); // Get the course_id from the URL
  const [course, setCourse] = useState<Courses | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  useEffect(() => {
    if (course_id) {
      const fetchCourse = async () => {
        try {
          const response = await fetch(`/api/get-courses/${course_id}`);
          const data = await response.json();

          if (data?.message === "Course fetched successfully") {
            setCourse(data.data);
          } else {
            setError("Course not found");
          }
        } catch (error) {
          setError("Error fetching course details");
        }
      };
      fetchCourse();
    }
  }, [course_id]);

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      {course && (
        <>
          {/* Modal to create a new module */}
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <button
                  className="absolute top-2 right-2 text-gray-600 text-2xl hover:text-black"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>

                <ModuleForm
                  course_id={course.course_id}
                  closeModal={() => setIsModalOpen(false)}
                />
              </div>
            </div>
          )}
          <div className="w-[80%] mx-auto">
            <ModulesPage />
            {/* Button to open the Create Module modal */}
            {user?.role === "admin" && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Create Module
              </Button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CourseDetail;
