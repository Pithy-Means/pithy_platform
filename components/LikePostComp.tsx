"use client";

import React, { useState } from "react";
import { likePost, unlike } from "@/lib/actions/user.actions";

interface LikePostProps {
  postId: string; // ID of the post to be liked
  userId: string; // ID of the user liking the post
  initialLikePostId?: string; // Optional: preloaded unique like-post ID
  initialIsLiked?: boolean; // Optional: preloaded like status
  initialLikeCount?: number; // Optional: preloaded like count
  handleLikeSuccess?: () => void; // Callback for a successful like action
}

const LikePost: React.FC<LikePostProps> = ({
  postId,
  userId,
  initialLikePostId = "",
  initialIsLiked = false,
  initialLikeCount = 0,
  handleLikeSuccess,
}) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const [likePostId, setLikePostId] = useState(initialLikePostId);

  const handleLike = async () => {
    if (loading) return; // Prevent redundant actions during loading
    setLoading(true);

    try {
      if (!isLiked) {
        // Like the post
        const data = {
          post_id: postId,
          user_id: userId,
          like_post_id: likePostId, // Current like ID or empty if new
        };
        const createdLike = await likePost(data); // Expect returned document
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);

        // Update `likePostId` with the returned document ID
        if (createdLike && createdLike.$id) {
          setLikePostId(createdLike.$id);
        }
      } else {
        // Unlike the post
        if (!likePostId) {
          console.error("Error: Missing likePostId for unlike operation");
          return;
        }
        await unlike(likePostId);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0)); // Prevent negative count
        setLikePostId(""); // Reset the ID
      }

      if (handleLikeSuccess) {
        handleLikeSuccess(); // Optional callback
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col-reverse space-y-2">
      <button
        onClick={handleLike}
        disabled={loading}
        className={`rounded-md w-fit transition-colors ${
          isLiked
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
      >
        {loading ? "Processing..." : isLiked ? "👍" : "👍"}
      </button>
      <span>
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>
    </div>
  );
};

export default LikePost;
