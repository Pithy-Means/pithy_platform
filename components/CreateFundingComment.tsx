import { createFundingComment } from "@/lib/actions/user.actions";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { FundingComment, UserInfo } from "@/types/schema"
import { useState } from "react";
import { toast } from "react-hot-toast";

interface CreateFundingCommentProps {
  fundingId: string;
}

const CreateFundingComment: React.FC<CreateFundingCommentProps> = ({ fundingId }) => {
  const { user } = useAuthStore((state) => state as unknown as UserInfo); // Get the user information from the store
  const [comment, setcomment] = useState<FundingComment>({
    funding_id: fundingId,
    user_id: user?.user_id || "",
    comment_funding_id: "",
    comment: ""
  }); // Create a new state to hold the comment

  const [loading, setLoading] = useState(false); // Create a new state to hold the loading status

  const [isSubmitted, setIsSubmitted] = useState(false); // Create a new state to hold the submitted status

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission
    setLoading(true); // Set the loading state to true
    try {
      // Call the API to create a new comment
      await toast.promise(
        createFundingComment(comment),
        {
          loading: "Submitting...",
          success: "Comment added successfully",
          error: "Failed to add comment",
        },
        {
          duration: 4000,
        }
      );
      setcomment({ ...comment, comment: "" }); // Clear the comment field
      setIsSubmitted(true); // Mark the form as submitted
    } catch (error) {
      console.error("Failed to create comment", error); // Log the error to the console
    } finally {
      setLoading(false); // Set the loading state to false
    }
  };

  return (
    <div>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-green-500 text-black/70"
            placeholder="Write your comment here..."
            value={comment.comment}
            onChange={(e) => setcomment({ ...comment, comment: e.target.value })}
            rows={4}
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      ) : (
        <div className="text-green-500">Comment added successfully</div>
      )}
    </div>
  )
}

export default CreateFundingComment