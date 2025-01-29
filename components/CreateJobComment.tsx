import { createJobComment } from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { JobComment, UserInfo } from "@/types/schema";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface CreateJobCommentProps {
  jobId: string;
}

const CreateJobComment: React.FC<CreateJobCommentProps> = ({ jobId }) => {
  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  const [comment, setComment] = useState<JobComment>({
    job_id: jobId,
    comment: "",
    user_id: user?.user_id || "",
    comment_job_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Call the API to create a new comment
      await toast.promise(
        createJobComment(comment),
        {
          loading: "Submitting...",
          success: "Comment added successfully",
          error: "Failed to add comment",
        },
        {
          duration: 4000,
        }
      );
      setComment({ ...comment, comment: "" });
      setIsSubmitted(true); // Mark the form as submitted
    } catch (error) {
      console.error("Failed to create comment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster />
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-500 text-black/70"
            placeholder="Write your comment here..."
            value={comment.comment}
            onChange={(e) => setComment({ ...comment, comment: e.target.value })}
            rows={4}
            disabled={loading}
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white font-bold rounded-lg bg-green-600 hover:bg-green-700 focus:outline-none focus:ring focus:ring-green-500 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Add Comment"}
          </button>
        </form>
      ) : (
        <p className="text-green-600">Your comment has been successfully added!</p>
      )}
    </div>
  );
};

export default CreateJobComment;
