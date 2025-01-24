import { getFundingComments, getUserInfo } from '@/lib/actions/user.actions';
import { FundingCommentWithUser } from '@/types/schema';
import React, { useEffect, useState } from 'react'
import { FaRegCommentDots } from 'react-icons/fa';
import { Card } from './ui/card';

const GetFundingComments = () => {
  const [comments, setComments] = useState<FundingCommentWithUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        // Fetch comments
        const data = await getFundingComments();
        console.log("Fetched comments:", data.documents);
        // Enrich comments with user info
        const enrichedComments = await Promise.all(
          data.documents.map(async (comment: FundingCommentWithUser) => {
            const user = await getUserInfo({ userId: comment.user_id });
            console.log("Fetched user info for user ID:", comment.user_id, user);
            return { ...comment, userName: `${user?.firstname} ${user?.lastname}` || "Unknown User" };
          }));
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
      <Card className="bg-gradient-to-br from-green-900 via-gray-900 to-black p-10 w-full max-w-6xl mx-auto rounded-xl shadow-xl">
        <div className="relative max-w-5xl mx-auto space-y-8">
          {/* Title Section */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-500 animate-text">
              Funding Comments
            </h1>
            <p className="mt-4 text-gray-300 text-lg">
              Explore insights and feedback from our amazing community.
            </p>
          </header>
  
          {/* Comments Section */}
          <div className="flex flex-col space-y-4">
            {comments.map((comment) => (
                <div
                  key={comment.comment_funding_id}
                  className="p-6 bg-gradient-to-r from-green-800 via-green-700 to-green-600 border border-green-500 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <div className="flex items-start space-x-4">
                    <FaRegCommentDots className="text-green-200 text-3xl flex-shrink-0" />
                    <div>
                      <p className="text-green-50 font-semibold">
                        &ldquo;{comment.comment}&quot;
                      </p>
                      <span className="block mt-2 text-sm text-green-200">
                        By: {comment.userName || "Anonymous"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>
    );
}

export default GetFundingComments;