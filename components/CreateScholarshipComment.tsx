import { createScholarshipComment } from "@/lib/actions/user.actions"
import { useAuthStore } from "@/lib/store/useAuthStore"
import { ScholarshipComment, UserInfo } from "@/types/schema"
import React, { useState } from "react"
import { toast, Toaster } from "react-hot-toast"

interface CreateScholarshipCommentProps {
  scholarshipId: string
}

const CreateScholarshipComment: React.FC<CreateScholarshipCommentProps> = ({ scholarshipId }) => {

  const { user } = useAuthStore((state) => state as unknown as UserInfo)
  const [loading, setLoading] = useState(false)
  const [comment, setComment] = useState<ScholarshipComment>({
    scholarship_id: scholarshipId,
    user_id: user?.user_id || "",
    comment_scholarship_id: "",
    comment: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Call the API to create a new comment
      await toast.promise(
        createScholarshipComment(comment),
        {
          loading: "Submitting...",
          success: "Comment added successfully",
          error: "Failed to add comment",
        },
        {
          duration: 3000,
        }
      );
      setComment({ ...comment, comment: "" })
      setIsSubmitted(true)
    } catch (error) {
      console.error("Failed to create comment", error)
    } finally {
      setLoading(false)
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
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      ) : (
        <p className="text-green-500">Comment added successfully</p>
      )}
    </div>
  )
}

export default CreateScholarshipComment