import React, { useEffect, useState } from "react";
import { getScholarshipComments, getUserInfo } from "@/lib/actions/user.actions";
import { FaRegCommentDots } from "react-icons/fa";
import { ScholarshipCommentWithUser } from "@/types/schema";
import { Card } from "./ui/card";

const GetScholarshipComments = () => {
  const [comments, setComments] = useState<ScholarshipCommentWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const data = await getScholarshipComments();
        console.log("Fetched comments:", data.documents);
  
        const enrichedComments = await Promise.all(
          data.documents.map(async (comment: ScholarshipCommentWithUser) => {
            const user = await getUserInfo({ userId: comment.user_id });
            console.log("Fetched user info for user ID:", comment.user_id, user);
            return { ...comment, userName: `${user?.firstname} ${user?.lastname}` || "Unknown User" };
          })
        );
  
        console.log("Final enriched comments:", enrichedComments);
        setComments(enrichedComments);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setError("Failed to fetch comments.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchComments();
  }, []);
  

  if (loading)
    return (
      <div className="flex items-center justify-center w-full rounded-lg p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-white to-green-400 animate-pulse">
          Fetching Comments...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center w-full rounded-lg p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-2xl font-semibold text-red-400 shadow-lg">
          Error: {error}
        </p>
      </div>
    );

  return (
    <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black p-10 w-fit">
      <div className="relative max-w-5xl mx-auto">
        {/* Title Section */}
        <header className="relative z-10 text-center mb-12">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-white to-green-500">
            Scholarship Comments
          </h1>
          <p className="mt-4 text-gray-300">
            Dive into the thoughts and feedback shared by our community.
          </p>
        </header>

        {/* Comment Cards */}
        <div className="flex flex-col items-center gap-6 relative">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.comment_scholarship_id}
                className="p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-start space-x-4">
                  <FaRegCommentDots className="text-green-500 text-2xl" />
                  <div>
                    <p className="text-gray-100 font-medium">{comment.comment}</p>
                    <span className="block mt-2 text-sm text-gray-400">
                      By: {comment.userName || "Unknown User"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-lg col-span-full">
              No comments available yet.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GetScholarshipComments;
