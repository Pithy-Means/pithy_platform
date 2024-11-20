import React, { useState } from "react";
import { likePost, unlike } from "@/lib/actions/user.actions";

interface LikePostProps {
  postId: string; // ID of the post to be liked
  userId: string; // ID of the user liking the post
  like_post_id: string; // Unique like-post ID
  handleLikeSuccess?: () => void; // Callback for a successful like action
}

const LikePost: React.FC<LikePostProps> = ({
  postId,
  userId,
  like_post_id,
  handleLikeSuccess,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return; // Prevent redundant actions during loading
    setLoading(true);

    try {
      const data = {
        post_id: postId,
        user_id: userId,
        like_post_id: like_post_id,
      };

      if (!isLiked) {
        // Like the post
        await likePost(data);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        // Unlike the post
        await unlike(like_post_id);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(prev - 1, 0)); // Prevent negative count
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
        className={`px-4 py-2 rounded-md w-fit transition-colors ${
          isLiked
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
      >
        {loading ? "Processing..." : isLiked ? "Liked" : "Like"}
      </button>
      <span>
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </span>
    </div>
  );
};

export default LikePost;
