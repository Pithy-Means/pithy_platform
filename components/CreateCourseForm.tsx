"use client";

import { getLoggedInUser } from "@/lib/actions/user.actions";
import { Courses, UserInfo } from "@/types/schema";
import React, { useEffect, useState } from "react";

const CreateCourseForm = () => {
  const [course, setCourse] = useState<Courses>({
    course_id: "",
    user_id: "", // You should set this based on the logged-in user's ID
    title: "",
    description: "",
    price: 0,
    duration: "",
    image: '',
    requirements: "",
    students: "",
  });

  const [user, setUser] = useState<UserInfo | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const loggedUser = await getLoggedInUser();
        setUser(loggedUser);

        // Update the user_id in the course object
        setCourse((prevCourse) => ({
          ...prevCourse,
          user_id: loggedUser?.$id,
        }));
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };
    getUser();    
  }, [])
  

  // Handle file change (image file)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFile = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64image = reader.result as string; // Base64 string
        setCourse((prevCourse) => ({
          ...prevCourse,
          image: base64image,
        }));
      };

      reader.onerror = () => {
        console.error("Failed to read the file as Base64");
      };

      reader.readAsDataURL(imageFile); // Convert the file to Base64
    }
  };


  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  // Submit form to the backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Ensure the user is logged in
      if (!course.user_id) {
        throw new Error("User not logged in");
      }
      const response = await fetch("/api/create-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();

      console.log("Course created:", result);
      return result;
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create a New Course
      </h1>
      {user && <p className="text-sm text-gray-600 mb-4">Logged in as: {user.email}</p>}

      {/* Course Title */}
      <div className="mb-4">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={course.title}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Course Description */}
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Description
        </label>
        <textarea
          id="description"
          name="description"
          value={course.description}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Course Price */}
      <div className="mb-4">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Price
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={course.price}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Course Duration */}
      <div className="mb-4">
        <label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Duration
        </label>
        <input
          type="text"
          id="duration"
          name="duration"
          value={course.duration}
          onChange={handleInputChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Course image */}
      <div className="mb-4">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Requirements */}
      <div className="mb-4">
        <label
          htmlFor="requirements"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Requirements (Optional)
        </label>
        <textarea
          id="requirements"
          name="requirements"
          value={course.requirements}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 text-white font-semibold rounded-md ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          }`}
        >
          {loading ? "Creating Course..." : "Create Course"}
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default CreateCourseForm;
