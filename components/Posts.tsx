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
import {
  CommentPost,
  CommentPostWithUser,
  Post,
  PostWithUser,
  UserInfo,
} from "@/types/schema";
import usePostInitialization from "@/lib/hooks/usePostInitialization";
import PostItem from "./PostItem";
import { useAuthStore } from "@/lib/store/useAuthStore";
import InfiniteScroll from "react-infinite-scroll-component";

interface PostsProps {
  searchPosts?: Post[];
}

const Loader = () => (
  <div className="space-y-4 flex flex-col mt-4">
    {Array.from({ length: 5 }).map((_, index) => (
      <div
        key={index}
        className="flex animate-pulse bg-white shadow rounded-lg p-4 sm:space-x-4 space-y-4 flex-col sm:flex-row items-start sm:items-center w-full"
      >
        <div className="rounded-full bg-gray-300 h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16"/>
        <div className="flex-1 space-y-4 w-full">
          <div className="h-4 bg-gray-300 rounded w-1/3 sm:w-1/4 md:w-1/6"/>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-full"/>
            <div className="h-4 bg-gray-300 rounded w-5/6"/>
            <div className="h-4 bg-gray-300 rounded w-4/6"/>
          </div>
          <div className="flex space-x-4 pt-2 justify-center sm:justify-start">
            <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 md:w-14"/>
            <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 md:w-14"/>
            <div className="h-4 bg-gray-300 rounded w-10 sm:w-12 md:w-14"/>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NoMorePost = () => (
  <div className="flex items-center justify-center h-96">
    <p className="text-2xl font-semibold text-gray-400">No posts available</p>
  </div>
);

const Posts: React.FC<PostsProps> = ({ searchPosts }) => {
  const [loading, setLoading] = useState(false);

  const { posts, loadingPosts, hasMore, loadMorePosts } = usePosts();
  console.log("Posts", posts);
  const [post, setPost] = useState<PostWithUser[]>([]);
  const [comments, setComments] = useState<{
    [key: string]: CommentPostWithUser[];
  }>({});
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
    posts,
    user,
    setPost,
    setComments,
    setLikeStatus,
    setLoading
  );

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPost((prevPosts) =>
        prevPosts.filter((post) => post.post_id !== postId)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (postId: string, content: string) => {
    try {
      const updatedPost = await updatePost(postId, { content });
      setPost((prevPosts) =>
        prevPosts.map((post) => (post.post_id === postId ? updatedPost : post))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddComment = async (postId: string, comment: string) => {
    if (!comment) return;

    const commentData: CommentPost = {
      comment_id: "",
      post_id: postId,
      user_id: user?.user_id ?? "",
      comment,
    };

    const createdComment = await createComment(commentData);
    console.log("Created Comment", createdComment);
    if (createdComment) {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), createdComment],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    }
    // Empthy the comment input
    setNewComment((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="flex flex-col gap-4 text-black">
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={<NoMorePost />}
      >
        <div className="flex space-y-4 flex-col">
          {posts.map((post) => (
            <PostItem
              key={post.post_id}
              post={post}
              loggedInUserId={user?.user_id || null}
              likeStatus={
                post.post_id
                  ? likeStatus[post.post_id] || {
                      isLiked: false,
                      likeCount: 0,
                    }
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
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Posts;
