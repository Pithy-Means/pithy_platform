import React, { useState } from "react";
import { createJobComment } from "@/lib/actions/user.actions"; // Adjust the import path
import { JobComment } from "@/types/schema"; // Adjust the import path

const JobCommentForm: React.FC<{ jobId: string; userId: string }> = ({ jobId, userId }) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    const commentData: JobComment = {
      job_id: jobId,
      user_id: userId,
      comment_job_id: "", // This will be generated dynamically by `createJobComment`
      comment,
    };

    try {
      await createJobComment(commentData);
      setSuccessMessage("Comment added successfully!");
      setComment("");
    } catch (err) {
      setError("Failed to add comment. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gradient-to-r from-purple-500 to-blue-600 text-gray-100 p-8 rounded-3xl shadow-2xl">
      <h2 className="text-4xl font-extrabold mb-6 text-center">Share Your Thoughts</h2>
      {error && <p className="text-red-500 text-center mb-4 font-medium">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4 font-medium">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="comment" className="text-lg font-semibold mb-2">
            Your Comment
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-40 px-5 py-3 text-gray-800 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-300 resize-none"
            placeholder="Write your comment here..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full py-4 px-6 text-xl font-bold text-white bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Add Comment"}
        </button>
      </form>
    </div>
  );
};

export default JobCommentForm;
