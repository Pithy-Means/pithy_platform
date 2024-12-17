"use client";

import { Modules } from "@/types/schema";
import React, { useEffect, useState } from "react";

interface ModuleFormProps {
  course_id: string | string[];
  closeModal: () => void;
}

export default function ModuleForm({ course_id, closeModal }: ModuleFormProps) {
  const [formData, setFormData] = useState<Modules>({
    module_id: "",
    course_id: Array.isArray(course_id) ? course_id[0] : course_id, 
    module_title: "",
    module_description: "",
    video: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const truncatedCourseId = (id: string) => id.length > 100 ? id.substring(0, 100) : id;

  useEffect(() => {
    if (course_id) {
      setFormData((prev) => ({
        ...prev,
        course_id: truncatedCourseId(Array.isArray(course_id) ? course_id[0] : course_id), 
      }));
      console.log("Course ID:", course_id);
    }
  }, [course_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const videoFile = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Video = reader.result as string; 
        setFormData((prev) => ({
          ...prev,
          video: base64Video,
        }));
      };

      reader.onerror = () => {
        console.error("Failed to read the file as Base64");
      };

      reader.readAsDataURL(videoFile); 
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/create-module", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ...formData, 
          course_id: truncatedCourseId((formData.course_id?.toString() || "")),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Module successfully created!");
        setFormData({
          module_id: "",
          course_id: Array.isArray(course_id) ? course_id[0] : course_id,
          module_title: "",
          module_description: "",
          video: "",
        });
        setTimeout(() => closeModal(), 1500); 
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create a New Module</h1>

      {message && (
        <div className="p-3 my-4 text-white bg-blue-500 rounded">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          name="module_title" 
          value={formData.module_title} 
          onChange={handleInputChange} 
          required 
          className="w-full px-3 py-2 border rounded" 
        />

        <textarea 
          name="module_description" 
          value={formData.module_description} 
          onChange={handleInputChange} 
          required 
          className="w-full px-3 py-2 border rounded" 
        />

        <input 
          type="file" 
          name="module_video" 
          onChange={handleFileChange}
          accept="video/mp4"
          required 
          className="w-full px-3 py-2" 
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Submitting..." : "Create Module"}
        </button>
      </form>
    </div>
  );
}
