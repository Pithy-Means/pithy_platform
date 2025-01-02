"use client";

import { useLoggedInUser } from "@/lib/hooks/useLoggedInUser";
import { generateValidPostId } from "@/lib/utils";
import { PostCourseQuestion } from "@/types/schema";
import { useState } from "react";
import { createPostCourseQuestions } from "../lib/actions/user.actions";

const AddQuestionForm = () => {
  const [questionText, setQuestionText] = useState<string>("");
  const [choices, setChoices] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user } = useLoggedInUser();

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
      alert("Please log in to add a question.");
      return;
    }

    // Validate form data
    if (!questionText.trim() || choices.some((choice) => !choice.trim())) {
      alert("Please fill out the question and all choices.");
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
    };

    setIsSubmitting(true);
    try {
      await createPostCourseQuestions(newQuestion, questionsArray);
      resetForm();
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add the question. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setQuestionText("");
    setChoices([""]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white shadow-md p-6 rounded-lg max-w-md mx-auto"
    >
      <h1 className="text-2xl font-bold mb-4">Add Post-Course Question</h1>

      <div>
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
          className="w-full mt-1 p-2 border rounded focus:ring focus:ring-blue-500"
          placeholder="Enter your question"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Choices
        </label>
        <div className="space-y-2">
          {choices.map((choice, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={choice}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                className="flex-1 p-2 border rounded focus:ring focus:ring-blue-500"
                placeholder={`Choice ${index + 1}`}
                required
              />
              {choices.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveChoice(index)}
                  className="px-2 py-1 text-red-600"
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
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Choice
        </button>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`px-6 py-2 rounded text-white ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {isSubmitting ? "Submitting..." : "Save Question"}
      </button>
    </form>
  );
};

export default AddQuestionForm;
