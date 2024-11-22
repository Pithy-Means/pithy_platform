import { createPost } from '@/lib/actions/user.actions';
import { Post, PostWithUser } from '@/types/schema';
import React, { useState } from 'react'

interface CreatePostProps {
  userId: string; // Pass the logged-in user ID as a prop
  // onPostCreated: (post: Post) => void; 
  onPostCreated: (newPost: PostWithUser) => void; // Callback function to update the post list

}

const CreatePost: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  // Define initial state for the post
  const [post, setPost] = useState<Post>({
    user_id: userId,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Call the createPost function from user.actions.ts
      const newPost = await createPost(post);
      onPostCreated(newPost);
      // Redirect to the dashboard after successful post creation
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>

      <div className="flex flex-col">
        <label htmlFor="content" className="font-medium">
          Content
        </label>
        <textarea
          id="content"
          name="content"
          value={post.content}
          onChange={handleChange}
          required
          className="border border-gray-300 rounded-md p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
      >
        Create Post
      </button>
    </form>
  );
};

export default CreatePost;
