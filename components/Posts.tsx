import React, { useState, useEffect, useCallback } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  ThumbsUp,
  MessageCircleMore,
  BookCopy,
  Share,
  CircleUserRound,
} from "lucide-react";
import { usePosts } from "@/lib/hooks/usePosts";
import {
  deletePost,
  getLoggedInUser,
  updatePost,
  createComment,
  getCommentsByPostId,
  likePost,
  unlike,
  getLikesByPostId,
  repost,
} from "@/lib/actions/user.actions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CommentPost, LikePost, PostWithUser } from "@/types/schema";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";
import InputContact from "./InputContact";

dayjs.extend(relativeTime);

const Posts = () => {
  const [loading, setLoading] = useState(false);
  const fetchedPosts = usePosts();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loggedIn, setLoggedIn] = useState<{
    user_id: string;
    firstname: string;
  } | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showOptions, setShowOptions] = useState<string | null>(null);
  const [comments, setComments] = useState<{ [key: string]: CommentPost[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [hasMore, setHasMore] = useState(true);
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [likePostId, setLikePostId] = useState<string>("");
  const [likeStatus, setLikeStatus] = useState<{
    [key: string]: { isLiked: boolean; likeCount: number };
  }>({});
  const [showAddComment, setShowAddComment] = useState<boolean>(false);
  const [repostContent, setRepostContent] = useState<{ [key: string]: string }>(
    {},
  );
  const [repostingPostId, setRepostingPostId] = useState<string | null>(null);

  const handleRepost = async (post: PostWithUser) => {
    try {
      if (!post.post_id || !repostContent[post.post_id]) return;

      const repostData = {
        post_id: post.post_id,
        user_id: loggedIn?.user_id,
        content: post.content, // Original post content
        repost_of: post.post_id, // Indicate it's a repost
        user_comment: repostContent[post.post_id], // User's additional comment
      };

      const newRepost = await repost(repostData);

      if (newRepost) {
        console.log("Repost created successfully", newRepost);
        setRepostingPostId(null); // Close the modal or input area
        if (post.post_id) {
          if (post.post_id) {
            if (post.post_id) {
              setRepostContent((prev) => ({ ...prev, [post.post_id || ""]: "" }));
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

      if (!currentStatus.isLiked) {
        // Like the post
        const data = {
          post_id: postId,
          user_id: loggedIn?.user_id || "",
          like_post_id: likePostId,
        };
        const createLike = await likePost(data);

        setLikeStatus((prev) => ({
          ...prev,
          [postId]: {
            isLiked: true,
            likeCount: currentStatus.likeCount + 1,
          },
        }));

        if (createLike && createLike.$id) {
          setLikePostId(createLike.$id);
        }
      } else {
        // Unlike the post
        if (!likePostId) {
          console.error("Error: Missing likePostId for unlike operation");
          return;
        }
        await unlike(likePostId);

        setLikeStatus((prev) => ({
          ...prev,
          [postId]: {
            isLiked: false,
            likeCount: Math.max(currentStatus.likeCount - 1, 0),
          },
        }));
        setLikePostId(""); // Reset the ID
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const fetchMorePosts = () => {
    if (fetchedPosts.length === 0) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await getLoggedInUser();
      console.log("LoggedIn user", user);
      setLoggedIn(user);
    };
    fetchLoggedInUser();
  }, []);

  // Fetch posts and initialize like statuses
  useEffect(() => {
    const initializeLikes = async () => {
      if (fetchedPosts.length > 0) {
        setLoading(true);
        setPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.post_id));
          const newPosts = fetchedPosts.filter(
            (post) => !existingIds.has(post.post_id),
          );
          return [...prevPosts, ...newPosts.reverse()];
        });

        const [likeData, commentData] = await Promise.all([
          Promise.all(
            fetchedPosts.map(async (post) => {
              const likes = await getLikesByPostId(post.post_id || "");
              const isLiked = likes.some(
                (like: LikePost) => like.user_id === loggedIn?.user_id,
              );
              return {
                postId: post.post_id,
                isLiked,
                likeCount: likes.length,
              };
            }),
          ),
          Promise.all(
            fetchedPosts.map(async (post) => {
              const postComments = await getCommentsByPostId(
                post.post_id || "",
              );
              return { postId: post.post_id, comments: postComments };
            }),
          ),
        ]);

        setComments((prev) => {
          const updatedComments = { ...prev };
          commentData.forEach(({ postId, comments }) => {
            if (postId) {
              updatedComments[postId] = comments;
            }
          });
          return updatedComments;
        });

        setLikeStatus((prev) => {
          const updatedStatus = { ...prev };
          likeData.forEach(({ postId, isLiked, likeCount }) => {
            if (postId) {
              updatedStatus[postId] = { isLiked, likeCount };
            }
          });
          return updatedStatus;
        });

        setHasMore(fetchedPosts.length > 0);
        setLoading(false);
      }
    };

    initializeLikes();
  }, [fetchedPosts, loggedIn]);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (postId: string) => {
    try {
      const updatedPost = await updatePost(postId, { content: editedContent });
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.post_id === postId ? updatedPost : post)),
      );
      setEditingPostId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleOptions = (postId: string) => {
    setShowOptions(showOptions === postId ? null : postId);
  };

  // Use `useCallback` to memoize the function
  const memoizedFetchComments = useCallback(
    async (postId: string) => {
      if (!comments[postId]) {
        // Only fetch if not already fetched
        const postComments = await getCommentsByPostId(postId);
        setComments((prev) => ({ ...prev, [postId]: postComments }));
      }
    },
    [comments],
  );

  const toggleComments = (postId: string) => {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    memoizedFetchComments(postId);
  };

  const toggleAddComment = () => {
    setShowAddComment((prev) => !prev);
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]) return;

    const commentData: CommentPost = {
      comment_id: "", // Replace with actual comment ID
      post_id: postId,
      user_id: loggedIn?.user_id ?? "", // Replace with actual user ID
      comment: newComment[postId],
    };

    const createdComment = await createComment(commentData);
    if (createdComment) {
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), createdComment],
      }));
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  return (
    <div className="flex flex-col gap-4 text-black w-full">
      {loading ? (
        <div className="flex justify-center items-center h-40 ">
          <p>Loading posts...</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={<h4>Loading more posts...</h4>}
          endMessage={<p>No more posts available.</p>}
          className="flex flex-col gap-y-4"
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.post_id}
                className="border border-gray-300 rounded-md p-4 bg-white/10"
              >
                <div className="flex flex-col ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CircleUserRound size={40} />
                      <div className="flex flex-col space-y-1">
                        <p className="font-semibold">
                          {post.user
                            ? `${post.user.firstname || "Unknown"} ${post.user.lastname || ""}`
                            : "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-500 font-light">
                          {dayjs(post.created_at).fromNow()}
                        </p>
                      </div>
                    </div>
                    {loggedIn?.user_id === post.user_id && (
                      <HiOutlineDotsVertical
                        className="text-gray-500 cursor-pointer"
                        onClick={() => post.post_id && toggleOptions(post.post_id)}
                      />
                    )}
                  </div>
                  <div className="flex flex-col space-y-4">
                    <p>{post.content}</p>
                    <Image
                      src="/assets/post_image.png"
                      width={600}
                      height={100}
                      alt="Image of User"
                      className="h-78 object-cover rounded-md"
                    />
                  </div>

                  {showOptions === post.post_id &&
                    loggedIn?.user_id === post.user_id && (
                      <div className="flex space-x-2 mt-2">
                        <button
                          onClick={() => {
                            if (post.post_id) {
                              setEditingPostId(post.post_id);
                              setEditedContent(post.content || "");
                            }
                          }}
                          className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.post_id || "")}
                          className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                </div>

                {editingPostId === post.post_id && (
                  <div className="mt-2">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <div className="mt-2">
                      <button
                        onClick={() => handleUpdate(post.post_id || "")}
                        className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-4 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2 items-center">
                      <div className="bg-green-500 rounded-full p-1 text-white felx-items-center justify-center">
                        <ThumbsUp size={16} strokeWidth={1} />
                      </div>
                      <span className="font-normal">
                        {post.post_id ? likeStatus[post.post_id]?.likeCount || 0 : 0}
                      </span>
                    </div>
                    <button
                      onClick={() => post.post_id && toggleComments(post.post_id)}
                      className="text-blue-500"
                    >
                      {post.post_id && showComments[post.post_id]
                        ? "Hide Comments"
                        : "Show Comments"}{" "}
                      ({post.post_id ? comments[post.post_id]?.length || 0 : 0})
                    </button>
                  </div>
                  <div className="w-full bg-gray-300 h-0.5 rounded" />
                  <div className="flex space-x-8 items-center">
                    <div className="rounded-full bg-gray-300 text-white px-2 py-1 text-xl font-extrabold">
                      {loggedIn
                        ? loggedIn.firstname.charAt(0).toUpperCase()
                        : ""}
                    </div>
                    <button
                      onClick={() => post.post_id && handleLike(post.post_id)}
                      disabled={loading}
                      className={`flex flex-col space-y-1 items-center`}
                    >
                      <p>
                        {post.post_id && likeStatus[post.post_id]?.isLiked ? (
                          <ThumbsUp size={24} strokeWidth={2} />
                        ) : (
                          <ThumbsUp size={24} strokeWidth={2} />
                        )}
                      </p>
                      <span className="text-sm">
                        {loading ? "Processing..." : "Like"}
                      </span>
                    </button>
                    <button
                      onClick={toggleAddComment}
                      className="flex flex-col space-y-1 items-center"
                    >
                      <p>
                        <MessageCircleMore />
                      </p>
                      <span className="text-sm">
                        {loading ? "Processing..." : "Comment"}
                      </span>
                    </button>
                    <button
                      onClick={() => post.post_id && setRepostingPostId(post.post_id)}
                      className="flex flex-col space-y-1 items-center"
                    >
                      <p>
                        <BookCopy />
                      </p>
                      <span className="text-sm">
                        {loading ? "Processing..." : "Repost"}
                      </span>
                    </button>
                    <button className="flex flex-col space-y-1 items-center">
                      <p>
                        <Share />
                      </p>
                      <span className="text-sm">
                        {loading ? "Processing..." : "Share"}
                      </span>
                    </button>
                  </div>
                  {repostingPostId === post.post_id && (
                    <div className="mt-2">
                      <textarea
                        value={repostContent[post.post_id] || ""}
                        onChange={(e) =>
                          setRepostContent((prev) => ({
                            ...prev,
                            [post.post_id || ""]: e.target.value,
                          }))
                        }
                        placeholder="Add your comment to this repost..."
                        className="w-full border rounded-md p-2"
                      />
                      <div className="flex justify-end mt-2 space-x-2">
                        <button
                          onClick={() => setRepostingPostId(null)}
                          className="text-gray-500 underline"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleRepost(post)}
                          className="bg-blue-500 text-white rounded-md px-4 py-2"
                        >
                          Repost
                        </button>
                      </div>
                    </div>
                  )}
                  {post.post_id && showComments[post.post_id] && (
                    <div className="mt-4 flex flex-col space-y-4">
                      <div>
                        {comments[post.post_id]?.map((comment: CommentPost) => (
                          <div
                            key={comment.comment_id}
                            className="flex items-center gap-2 mb-2"
                          >
                            <Image
                              src="/assets/person_feedback.png"
                              alt="Comment User"
                              width={30}
                              height={30}
                              className="rounded-full"
                            />
                            <div>
                              <p className="text-sm font-semibold">
                                {comment.user?.firstname || "User"}
                              </p>
                              <p className="text-sm text-gray-700">
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {showAddComment ? (
                    <div className="flex items-center my-2 w-full">
                      <InputContact
                        type="text"
                        value={post.post_id ? newComment[post.post_id] || "" : ""}
                        onChange={(e) =>
                          setNewComment((prev) => ({
                            ...prev,
                            [post.post_id || ""]: e.target.value,
                          }))
                        }
                        label="Add a comment..."
                        className="border rounded-md p-2 w-full"
                      />
                      <button
                        onClick={() => handleAddComment(post.post_id || "")}
                        className="bg-blue-500 text-white px-4 py-2 ml-2 rounded-md"
                      >
                        Comment
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Posts;