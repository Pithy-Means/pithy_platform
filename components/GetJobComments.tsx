import { getJobComments, getUserInfo } from "@/lib/actions/user.actions";
import { JobCommentWithUser } from "@/types/schema";
import React, { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { Card } from "./ui/card";

const GetJobComments = () => {
  const [comments, setComments] = useState<JobCommentWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Fetch comments
        const data = await getJobComments();
        // Enrich comments with user info
        const enrichedComments = await Promise.all(
          data.documents.map(async (comment: JobCommentWithUser) => {
            // Fetch user info
            const user = await getUserInfo({ userId: comment.user_id });
            console.log(
              "Fetched user info for user ID:",
              comment.user_id,
              user
            );
            // Enrich comment with user info
            return {
              ...comment,
              userName:
                `${user?.firstname} ${user?.lastname}` || "Unknown User",
            };
          })
        );
        // Final enriched comments
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
    <Card className="bg-gradient-to-br from-black via-green-900 to-black p-12 w-full max-w-7xl mx-auto rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,255,0,0.2)] border border-green-700 relative overflow-hidden">
      {/* Floating 3D Sphere */}
      <div className="absolute top-10 -right-20 w-96 h-96 bg-gradient-to-r from-white/10 to-green-300 rounded-full blur-3xl animate-rotate3D"></div>
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-2xl opacity-70 animate-bounce3D"></div>

      <div className="relative space-y-16">
        {/* Title Section */}
        <header className="text-center space-y-4">
          <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-500 animate-glow3D">
            Job Comments
          </h1>
          <p className="mt-2 text-gray-300 text-lg tracking-wide max-w-3xl mx-auto">
            Explore insights and feedback from our vibrant community.
          </p>
        </header>

        {/* Comments Section */}
        <div className="flex flex-col space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.comment_job_id}
                className="group relative p-6 bg-gradient-to-b from-green-800 to-green-700 rounded-xl border border-green-500 shadow-md transition-transform duration-300 transform hover:rotate-3 hover:translate-y-1 hover:shadow-2xl"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 to-green-500 opacity-10 group-hover:opacity-30 transition duration-300"></div>

                <div className="relative flex items-start space-x-4">
                  <FaRegCommentDots className="text-green-200 text-4xl flex-shrink-0 animate-pulse3D" />
                  <div className="space-y-2">
                    <p className="text-green-50 font-medium text-lg leading-relaxed">
                      &ldquo;{comment.comment}&rdquo;
                    </p>
                    <span className="block mt-1 text-sm text-green-200 italic">
                      By: {comment.userName || "Anonymous"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-xl col-span-full">
              No comments yet. Share your first thoughts today!
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GetJobComments;
