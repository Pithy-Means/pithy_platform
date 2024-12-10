import { createPost } from "@/lib/actions/user.actions";
import { Post, PostWithUser } from "@/types/schema";
import React, { useState } from "react";

interface CreatePostProps {
  userId: string; // Pass the logged-in user ID as a prop
  // onPostCreated: (post: Post) => void;
  onPostCreated: (newPost: PostWithUser) => void; // Callback function to update the post list
}

const CreatePost: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  // Define initial state for the post
  const [post, setPost] = useState<Post>({
    user_id: userId,
    image: "", // Add the Image property
    video: "", // Add the Video property

  });
  const [loading, setLoading] = useState<boolean>(false);

  // Handle file change (image file)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFile = e.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64image = reader.result as string; // Base64 string
        setPost((prevCourse) => ({
          ...prevCourse,
          image: base64image || "",
          video: base64image || "",
        }));
      };

      reader.onerror = () => {
        console.error("Failed to read the file as Base64");
      };

      reader.readAsDataURL(imageFile); // Convert the file to Base64
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    <>
      {loading ? (
        <p>Creating post...</p>
      ) : (
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

          {/* Course image */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Post Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600"
          >
            Create Post
          </button>
        </form>
      )}
    </>
  );
};

export default CreatePost;
