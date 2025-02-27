"use client";

import { generateValidPostId } from "@/lib/utils";
import { PostCourseQuestion, UserInfo } from "@/types/schema";
import { useState } from "react";
import { createPostCourseQuestions } from "../lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import toast, { Toaster } from "react-hot-toast";

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([""]);
  const [categories, setCategories] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  const handleAddChoice = () => setChoices((prev) => [...prev, ""]);

  const handleChoiceChange = (index: number, value: string) => {
    setChoices((prev) =>
      prev.map((choice, i) => (i === index ? value : choice))
    );
  };

  const handleRemoveChoice = (index: number) => {
    setChoices((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to add a question.");
      return;
    }

    // Validate form data
    if (!questionText.trim() || choices.some((choice) => !choice.trim())) {
      toast.error("Please fill out the question and all choices.");
      return;
    }

    // Construct the questions array
    const questionsArray = [
      {
        text: questionText.trim(),
        choices: choices.map((choice) => choice.trim()),
      },
    ];

    // Construct the question object
    const newQuestion: PostCourseQuestion = {
      post_course_question_id: generateValidPostId(), // Appwrite will generate this automatically
      user_id: user?.user_id || "", // Replace with dynamic user ID
      question: questionText.trim(),
      choices: choices.map((choice) => choice.trim()),
      categories,
    };

    setIsSubmitting(true);
    try {
      await createPostCourseQuestions(newQuestion, questionsArray);
      toast.success("Question added successfully!");
      resetForm();
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error("Failed to add the question. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setQuestionText("");
    setChoices([""]);
    setCategories("");
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#4CAF50",
            color: "#fff",
          },
          error: {
            style: {
              background: "#FF5252",
              color: "#fff",
            },
          },
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-gradient-to-br from-green-50 to-white shadow-2xl p-8 rounded-2xl max-w-md mx-auto transform transition-transform hover:scale-105"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">
          Add Post-Course Question
        </h1>

        {/* Question Input */}
        <div className="space-y-2">
          <label
            htmlFor="questionText"
            className="block text-sm font-medium text-gray-700"
          >
            Question
          </label>
          <input
            id="questionText"
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full mt-1 p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-black placeholder-gray-400"
            placeholder="Enter your question"
            required
          />
        </div>

        {/* Choices Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Choices
          </label>
          <div className="space-y-3">
            {choices.map((choice, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 animate-fade-in"
              >
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => handleChoiceChange(index, e.target.value)}
                  className="flex-1 p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-black placeholder-gray-400"
                  placeholder={`Choice ${index + 1}`}
                  required
                />
                {choices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChoice(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                    aria-label="Remove choice"
                  >
                    ✖
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddChoice}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 active:bg-green-700 transition-all w-full"
          >
            Add Choice
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="categories"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="categories"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            required
            className="w-full mt-1 p-3 border-2 border-green-100 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-black"
          >
            <option value="">Select a category</option>
            <option value="student">Student</option>
            <option value="job seeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full px-6 py-3 rounded-lg text-white font-semibold ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 active:bg-green-700"
          } transition-all`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Save Question"
          )}
        </button>
      </form>
    </>
  );
};

export default AddQuestionForm;