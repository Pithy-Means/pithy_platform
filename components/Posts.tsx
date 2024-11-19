import React, { useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { usePosts } from "@/lib/hooks/usePosts";
import {
  deletePost,
  getLoggedInUser,
  updatePost,
  createComment,
  getCommentsByPostId,
} from "@/lib/actions/user.actions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { CommentPost, PostWithUser } from "@/types/schema";
import Image from "next/image";
import InfiniteScroll from "react-infinite-scroll-component";


dayjs.extend(relativeTime);
// type PostProps = {
//   posts: PostWithUser[];
// };

const Posts= () => {
  const [loading, setLoading] = useState(true);
  const fetchedPosts = usePosts();
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loggedIn, setLoggedIn] = useState<{ user_id: string } | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showOptions, setShowOptions] = useState<string | null>(null);
  // const [comments, setComments] = useState<{ [key: string]: any[] }>({});
  const [comments, setComments] = useState<Record<string, CommentPost[]>>({});
// const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [hasMore, setHasMore] = useState(true);

 
  const fetchMorePosts = async () => {
    if (fetchedPosts.length === 0) {
      setHasMore(false);
      return;
    }
    setPosts((prevPosts) => [...prevPosts, ...fetchedPosts.reverse()]);
  };

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await getLoggedInUser();
        setLoggedIn(user);
      } catch (error) {
        console.error('Failed to fetch looged-in user:', error)
      }
    };
    fetchLoggedInUser();
  }, []);

  // useEffect(() => {
  //   if (fetchedPosts.length > 0) {
  //     setPosts(fetchedPosts.reverse());
  //     setLoading(false);
  //   }
  // }, [fetchedPosts]);

  useEffect(() => {
    if (fetchedPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts.reverse()]);
      setHasMore(fetchedPosts.length > 0);
      setLoading(false);
    }
  }, [fetchedPosts]);


  // useEffect(() => {
  //   fetchMorePosts();
  //   setLoading(false);
  // }, [fetchedPosts, fetchMorePosts]);

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
        // prevPosts.map((post) => (post.post_id === postId ? updatedPost : post))
      prevPosts.map((post) => (post.post_id === postId? {...post, ...updatedPost} : post

      ))
      );
      setEditingPostId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleOptions = (postId: string) => {
    setShowOptions(showOptions === postId ? null : postId);
  };

  const handleFetchComments = async (postId: string) => {
    try {
      const postComments = await getCommentsByPostId(postId);
      setComments((prev) => ({ ...prev, [postId]: postComments }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment[postId]) return;

    const commentData: CommentPost = {
      comment_id: '', // Replace with actual comment ID
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
    <div className="flex flex-col gap-4 text-black ">
      {loading ? (
        <div className="flex justify-center items-center h-40 ">
          <p>Loading posts...</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMorePosts}
          hasMore={hasMore}
          loader={<div className='text-center, py-4'>Loading more posts...</div>}
          endMessage={<div className='text-center py-4 text-gray-500'>No more posts to show. Be the first to post!</div>}
          className="flex flex-col gap-y-4  "
        >
          {posts.length > 0 ? (
            posts.map((post) => (
              // const postId = post.post_id || '';
              <div key={post.post_id} className="border border-gray-300  rounded-md p-4 bg-white/10">
                <div className="flex flex-col ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={post.user.avatar || "/assets/person_feedback.png"}
                        alt="person"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col space-y-2">
                        <p className="font-semibold">
                          {post.user ? `${post.user.firstname || ''} ${post.user.lastname || ''}`.trim() || post.user?.name : 'Anonymous'}
                        </p>
                        <p className="text-sm text-gray-500 font-light">
                          {dayjs(post.created_at ).fromNow()}
                        </p>
                      </div>
                    </div>
                    {loggedIn?.user_id === post.user_id && (
                      <HiOutlineDotsVertical
                        className="text-gray-500 cursor-pointer"
                        onClick={() => toggleOptions(post.post_id || '')}
                      />
                    )}
                  </div>
                  <div className="flex flex-col space-y-4">
                    <p>{post.content}</p>
                    <Image
                      src="/assets/post_image.png"
                      width={800}
                      height={500}
                      alt=""
                    />
                  </div>

                  {showOptions === post.post_id && loggedIn?.user_id === post.user_id && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => {
                          setEditingPostId(post.post_id || '');
                          setEditedContent(post.content || '');
                        }}
                        className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.post_id || '')}
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
                        onClick={() => handleUpdate(post.post_id || '')}
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

                {/* Comment Section */}
                <div className="mt-4">
                  <button onClick={() => handleFetchComments(post.post_id || '')} className="text-blue-500 text-sm">
                    View Comments
                  </button>
                  {comments[post.post_id || ''] && (
                    <div className="mt-2 space-y-2">
                      {comments[post.post_id || ''].map((comment) => (
                        <div key={comment.post_id || ''} className="border-t border-gray-200 pt-2">
                          <p>{comment.comment}</p>
                          <small className="text-gray-500">{dayjs(comment.created_at).fromNow()}</small>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex items-center mt-2">
                    <textarea
                      value={newComment[post.post_id || ''] || ""}
                      onChange={(e) =>
                        setNewComment((prev) => ({ ...prev, [post.post_id || '']: e.target.value }))
                      }
                      placeholder="Add a comment"
                      className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <button
                      onClick={() => handleAddComment(post.post_id || '')}
                      className="bg-blue-500 text-white rounded-md px-4 py-2 ml-2 hover:bg-blue-600"
                    >
                      Post
                    </button>
                  </div>
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
