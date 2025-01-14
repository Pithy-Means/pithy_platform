"use client";

import {useCreateCourse} from "@/lib/hooks/useCreateCourse"
import { Courses } from "@/types/schema";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { UserContext } from "@/context/UserContext";


const CreateCourseForm = () => {
  const { user } = useContext(UserContext); // Use the hook
  const [course, setCourse] = useState<Courses>({
    course_id: "",
    user_id: "", // You should set this based on the logged-in user's ID
    title: "",
    description: "",
    price: 0,
    duration: "",
    image: "",
    requirements: "",
    students: [],
    categories: "",
  });

  useEffect(() => {
    if ( course.user_id ) {
        // Update the user_id in the course object
        setCourse((prevCourse) => ({
          ...prevCourse,
          user_id: user?.user_id || "",
        }));
    };
  }, [course.user_id, user?.user_id]);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCourse((prevCourse) => ({
      ...prevCourse,
      [name]: value,
    }));
  };

  const { handleSubmit, loading, error } = useCreateCourse();

  // Submit form to the backend
  const handleData = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSubmit(course);
      setCourse({
        course_id: '',
        user_id: course.user_id,
        title: '',
        description: '',
        price: 0,
        duration: '',
        image: '',
        requirements: '',
        students: [],
        categories: ''
      });
    } catch (err: unknown) {
      console.error("Failed to create course:", err);
    }
  };

  return (
    <form
      onSubmit={handleData}
      className="w-full bg-white p-6 rounded-lg shadow-md"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Create a New Course
      </h1>
      {user && (
        <p className="text-sm text-gray-600 mb-4">Logged in as: {user.email}</p>
      )}

      {/* Course Title */}
      <div className="mb-4">
        <Label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Title
        </Label>
        <Input
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
        <Label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Description
        </Label>
        <Textarea
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
        <Label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Price
        </Label>
        <Input
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
        <Label
          htmlFor="duration"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course Duration
        </Label>
        <Input
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
        <Label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Course image
        </Label>
        <Input
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
        <Label
          htmlFor="requirements"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Requirements (Optional)
        </Label>
        <Textarea
          id="requirements"
          name="requirements"
          value={course.requirements}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="mb-4">
      <Label
          htmlFor="Category"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Requirements (Optional)
        </Label>
        <select
          id="categories"
          name="categories"
          value={course.categories}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="student">Student</option>
          <option value="professional">Job Seeker</option>
          <option value="business">Owner</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between">
      <Button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 text-white font-semibold rounded-md ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <span>Creating Course...</span>
            <svg
              className="animate-spin h-5 w-5 ml-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 11-8 8z"
              ></path>
            </svg>
          </div>
        ) : (
          "Create Course"
        )}
      </Button>

      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </form>
  );
};

export default CreateCourseForm;
