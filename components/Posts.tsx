import React, { useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { usePosts } from "@/lib/hooks/usePosts";
import {
  deletePost,
  getLoggedInUser,
  updatePost,
} from "@/lib/actions/user.actions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Posts = () => {
  const [loading, setLoading] = useState(true);
  const fetchedPosts = usePosts();
  const [posts, setPosts] = useState<any[]>([]);
  const [loggedIn, setLoggedIn] = useState<{ user_id: string } | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [showOptions, setShowOptions] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
      const user = await getLoggedInUser();
      setLoggedIn(user);
    };
    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    if (fetchedPosts.length > 0) {
      setPosts(fetchedPosts.reverse());
      setLoading(false);
    }
  }, [fetchedPosts]);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts((prevPosts) => prevPosts.filter((post) => post.$id !== postId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (postId: string) => {
    try {
      const updatedPost = await updatePost(postId, { content: editedContent });
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.$id === postId ? updatedPost : post))
      );
      setEditingPostId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleOptions = (postId: string) => {
    setShowOptions(showOptions === postId ? null : postId);
  };

  return (
    <div className="flex flex-col gap-4 text-black">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <p>Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        posts.map((post: any) => (
          <div key={post.$id} className="border border-gray-300 rounded-md p-4 bg-white/10">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src="/assets/person_feedback.png"
                    alt="person"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex flex-col space-y-2">
                    <p className="font-semibold">
                      {post.user ? `${post.user.firstname || 'Unknown'} ${post.user.lastname || ''}` : 'Anonymous'}
                    </p>
                    <p className="text-sm text-gray-500 font-light">
                      {dayjs(post.created_at).fromNow()}
                    </p>
                  </div>
                </div>
                {loggedIn?.user_id === post.user_id && (
                  <HiOutlineDotsVertical
                    className="text-gray-500 cursor-pointer"
                    onClick={() => toggleOptions(post.$id)}
                  />
                )}
              </div>
              <div className="flex flex-col space-y-4">
                <p>{post.content}</p>
                <img src="/assets/post_image.png" alt="" />
              </div>

              {showOptions === post.$id && loggedIn?.user_id === post.user_id && (
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingPostId(post.$id);
                      setEditedContent(post.content);
                    }}
                    className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.$id)}
                    className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {editingPostId === post.$id && (
              <div className="mt-2">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 w-full"
                />
                <div className="mt-2">
                  <button
                    onClick={() => handleUpdate(post.$id)}
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
          </div>
        ))
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default Posts;
