/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useContext, useEffect, useRef } from "react";
import { usePosts } from "@/lib/hooks/usePosts";
import {
  deletePost,
  updatePost,
  createComment,
  // getCommentsByPostId,
  // likePost,
  toggleLike,
  repost,
} from "@/lib/actions/user.actions";
import { CommentPost, PostWithUser } from "@/types/schema";
import usePostInitialization from "@/lib/hooks/usePostInitialization";
import PostItem from "./PostItem";
import { UserContext } from "@/context/UserContext";
import { PostsContext, usePost } from "@/context/PostContext";
import SkeletonLoader from "./SkeletonLoader";

const Posts = () => {
  // const [loading, setLoading] = useState(false);
  const fetchedPosts = usePosts();
  // const [posts, setPosts] = useState<PostWithUser[]>([]);
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

  // creating a reference for the last post
  // const { posts, setPosts, fetchMorePosts, hasMore, loading, setLoading } = useContext(PostsContext);
  const { posts, setPosts, fetchMorePosts, setLoading,  hasMore, loading } = usePost();
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = (node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchMorePosts();
      }
    });
    if (node) observer.current.observe(node);
  };

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

  const { user } = useContext(UserContext);
  console.log("User,:", user);

  usePostInitialization(
    fetchedPosts,
    user,
    setPosts,
    setComments,
    setLikeStatus,
    setLoading
  );

  useEffect(() => {
    if (fetchedPosts.length > 0) {
      setPosts((prev) => [...prev, ...fetchedPosts]);
    };
  }, [fetchedPosts, setPosts]);

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

    const commentData: CommentPost = {
      comment_id: "",
      post_id: postId,
      userid: user?.user_id ?? "",
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
  };

  return (
    <div className="flex flex-col gap-4 text-black md:mt-6 sm:pr-2 overflow-y-auto  space-y-4">
      {/* Skeleton Loader */}
      {loading ? (
        // <div className="py-4 flex flex-col space-y-4 justify-center sm:space-y-2">
        //   {[...Array(5)].map((_, index) => (
        //     <div key={index} className="border border-gray-300 shadow rounded-md p-4  sm:p-2">
        //       <div className="animate-pulse flex flex-col space-y-4 sm:space-y-2 ">
        //         <div className="flex space-x-4 items-center">
        //           <div className="rounded-full bg-slate-700 h-8 w-8 sm:h-6 sm:w-6"></div>
        //           <div className="flex flex-col space-y-2 w-full">
        //             <div className="h-2 bg-slate-700 rounded w-1/2"></div>
        //             <div className="h-1.5 bg-slate-700 rounded w-1/3 sm:w-1/2"></div>
        //           </div>
        //         </div>
        //         <div className="flex-1 space-y-6 py-1 sm:space-y-3">
        //           <div className="space-y-3 sm:space-y-2">
        //             <div className="grid grid-cols-3 gap-4 sm:gap-2">
        //               <div className="h-2 bg-slate-700 rounded "></div>
        //               <div className="h-2 bg-slate-700 rounded "></div>
        //               <div className="h-2 bg-slate-700 rounded"></div>
        //             </div>
        //             <div className="h-16 bg-slate-800 rounded sm:h-12"></div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //   ))}
        // </div>
        <SkeletonLoader />
      ) : (
        <div className="space-y-4 sm:space-y-2">
          {posts.map((post, index) => (
            <div
              key={post.post_id || index}
              ref={posts.length === index + 1 ? lastPostRef : null} // Add the ref to the last post
            >
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
            </div>
          ))}

          {/* No More Posts */}
          {!loading && !hasMore && (
            <div className="text-center text-gray-500 py-4">No more posts</div>
          )}
        </div>
      )};
    </div>
  );
};

export default Posts;
