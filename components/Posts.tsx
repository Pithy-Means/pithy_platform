/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { usePosts } from "@/lib/hooks/usePosts";
import {
  deletePost,
  updatePost,
  createComment,
  toggleLike,
  repost,
} from "@/lib/actions/user.actions";
import { CommentPost, PostWithUser, UserInfo } from "@/types/schema";
import usePostInitialization from "@/lib/hooks/usePostInitialization";
import PostItem from "./PostItem";
import { useAuthStore } from "@/lib/store/useAuthStore";

const Posts = () => {
  const [loading, setLoading] = useState(false);
  
  const fetchedPosts = usePosts();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [comments, setComments] = useState<{ [key: string]: CommentPost[] }>(
    {}
  );
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [likePostId, setLikePostId] = useState<string>("");
  const [likeStatus, setLikeStatus] = useState<{
    [key: string]: { isLiked: boolean; likeCount: number };
  }>({});
  const [repostingPostId, setRepostingPostId] = useState<string | null>(null);
  const [repostContent, setRepostContent] = useState<{ [key: string]: string }>(
    {}
  );

  const handleRepost = async (post: PostWithUser) => {
    try {
      if (!post.post_id || !repostContent[post.post_id]) return;

      const repostData = {
        post_id: post.post_id,
        user_id: user?.user_id,
        content: post.content, // Original post content
        repost_of: post.post_id, // Indicate it's a repost
        user_comment: repostContent[post.post_id], // User's additional comment
        mediaInfo: post.mediaInfo, // Include mediaInfo
      };

      const newRepost = await repost(repostData);

      if (newRepost) {
        console.log("Repost created successfully", newRepost);
        setRepostingPostId(null); // Close the modal or input area
        if (post.post_id) {
          if (post.post_id) {
            if (post.post_id) {
              setRepostContent((prev) => ({
                ...prev,
                [post.post_id || ""]: "",
              }));
            }
          }
        }
      }
    } catch (error) {
      console.error("Error creating repost:", error);
    }
  };

  const handleLike = async (postId: string) => {
    if (loading) return;

    try {
      const currentStatus = likeStatus[postId] || {
        isLiked: false,
        likeCount: 0,
      };

      const data = {
        post_id: postId,
        user_id: user?.user_id || "",
        like_post_id: likePostId,
      };

      const result = await toggleLike(data);

      if (result) {
        setLikeStatus((prev) => ({
          ...prev,
          [postId]: {
            isLiked: !currentStatus.isLiked,
            likeCount: currentStatus.isLiked
              ? Math.max(currentStatus.likeCount - 1, 0)
              : currentStatus.likeCount + 1,
          },
        }));

        if (!currentStatus.isLiked) {
          setLikePostId(result.like_post_id);
        } else {
          setLikePostId("");
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const { user } = useAuthStore((state) => state as unknown as UserInfo);

  usePostInitialization(
    fetchedPosts,
    user?.user,
    setPosts,
    setComments,
    setLikeStatus,
    setLoading
  );

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.post_id !== postId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (postId: string, content: string) => {
    try {
      const updatedPost = await updatePost(postId, { content });
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.post_id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (postId: string, comment: string) => {
    if (!comment) return;

    // Set loading state to block input for the current post
    // setLoading((prev) => ({ ...prev, [postId]: true }));

    const commentData: CommentPost = {
      comment_id: "",
      post_id: postId,
      user_id: user?.user_id ?? "",
      comment,
    };

    const createdComment = await createComment(commentData);
    if (createdComment) {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), createdComment],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    }
    // Empthy the comment input
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
    // setLoading((prev) => ({ ...prev, [postId]: false }));
  };

  return (
    <div className="flex flex-col gap-4 text-black w-full">
      {loading ? (
        <div className="py-4 flex flex-col space-y-4">
          <div className="border border-gray-300 shadow rounded-md p-4 w-full">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="flex space-x-4">
                <div className="rounded-full bg-slate-700 h-8 w-8"></div>
                <div className="flex flex-col space-y-2 w-full">
                  <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-1.5 bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
              <div className="flex-1 space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-16 bg-slate-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 shadow rounded-md p-4 w-full">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="flex space-x-4">
                <div className="rounded-full bg-slate-700 h-8 w-8"></div>
                <div className="flex flex-col space-y-2 w-full">
                  <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-1.5 bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
              <div className="flex-1 space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-16 bg-slate-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-300 shadow rounded-md p-4 w-full">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="flex space-x-4">
                <div className="rounded-full bg-slate-700 h-8 w-8"></div>
                <div className="flex flex-col space-y-2 w-full">
                  <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                  <div className="h-1.5 bg-slate-700 rounded w-1/3"></div>
                </div>
              </div>
              <div className="flex-1 space-y-6 py-1">
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-700 rounded col-span-1"></div>
                    <div className="h-2 bg-slate-700 rounded"></div>
                  </div>
                  <div className="h-16 bg-slate-800 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostItem
              key={post.post_id}
              post={post}
              loggedInUserId={user?.user_id || null}
              likeStatus={
                post.post_id
                  ? likeStatus[post.post_id] || { isLiked: false, likeCount: 0 }
                  : { isLiked: false, likeCount: 0 }
              }
              comments={post.post_id ? comments[post.post_id] || [] : []}
              onLike={handleLike}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
              onAddComment={handleAddComment}
              onRepost={handleRepost}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Posts;
