import { createPost } from "@/lib/actions/user.actions";
import { Post, PostWithUser } from "@/types/schema";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import toast, { Toaster } from "react-hot-toast";
import { Textarea } from "./ui/textarea";

interface CreatePostProps {
  userId: string; // Pass the logged-in user ID as a prop
  // onPostCreated: (post: Post) => void;
  onPostCreated: (newPost: PostWithUser) => void; // Callback function to update the post list
}

const CreatePosts: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  // Define initial state for the post
  const [post, setPost] = useState<Post>({
    user_id: userId,
    image: "", // Add the Image property
    video: "", // Add the Video property
    content: "", // Add the Content property with a default value
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      toast.success("Post created successfully");
      // Redirect to the dashboard after successful post creation
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); //Reset loading state
    }
  };

  return (
    <div className="relative">
      <Toaster />
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-75 z-50">
          <p className="text-green-500 text-xl font-medium animate-pulse">
            Posting ...
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 rounded-3xl shadow-xl p-10 space-y-8 border border-gray-200"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-extrabold text-gray-800">
              Create a New Post
            </h2>
            <p className="text-gray-500 text-lg">
              Share your ideas with the world by creating a compelling post. Add
              content, upload images or videos, and publish effortlessly.
            </p>
          </div>

          {/* Post Content */}
          <div>
            <Textarea
              value={post.content || ""}
              onChange={handleChange}
              placeholder="Write your thoughts here..."
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:ring-4 focus:ring-green-400 focus:border-green-500 p-4 text-gray-800 text-base transition duration-300 ease-in-out"
              rows={6}
            />
            <p className="text-sm text-gray-400 mt-2">
              Use clear and concise language to express your ideas.
            </p>
          </div>

          {/* Upload Section */}
          <div>
            <Label
              htmlFor="image"
              className="block text-lg font-medium text-gray-700 mb-3"
            >
              Upload Image or Video
            </Label>
            <Input
              type="file"
              name="image"
              onChange={handleFileChange}
              accept="image/*, video/*"
              className="block w-full text-gray-600 text-sm border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500/10 file:text-green-600 hover:file:bg-green-100 focus:ring-4 focus:ring-green-400 focus:outline-none"
            />
            <p className="mt-2 text-sm text-gray-400">
              Supported formats: JPG, PNG, MP4. Max size: 1MB.
            </p>
          </div>

          {/* Action Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-indigo-600 text-white font-semibold py-4 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:ring-4 focus:ring-green-400"
          >
            Publish Post
          </Button>
        </form>
      )}
    </div>
  );
};

export default CreatePosts;
