"use client";

import { createPost } from "@/lib/actions/user.actions";
import { Post, PostWithUser } from "@/types/schema";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import toast, { Toaster } from "react-hot-toast";
import { Textarea } from "./ui/textarea";
import Image from "next/image";
// import { Video } from "./Video";

interface CreatePostProps {
  userId: string;
  onPostCreated: (newPost: PostWithUser) => void;
}

const CreatePosts: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  // Define initial state for the post
  const [post, setPost] = useState<Post>({
    user_id: userId,
    image: "",
    video: "",
    content: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fileSize, setFileSize] = useState<number>(0);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Improved file change handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error(
          `File too large (${(file.size / (1024 * 1024)).toFixed(2)}MB). Max size is 50MB.`,
        );
        return;
      }

      setFileSize(file.size);
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result as string;

        // Determine if it's an image or video based on file type
        if (file.type.startsWith("image/")) {
          setPost((prevPost) => ({
            ...prevPost,
            image: base64Data || "",
            video: "", // Clear video when image is set
          }));
        } else if (file.type.startsWith("video/")) {
          setPost((prevPost) => ({
            ...prevPost,
            video: base64Data || "",
            image: "", // Clear image when video is set
          }));
        } else {
          toast.error(
            "Unsupported file type. Please upload an image or video.",
          );
        }
      };

      reader.onerror = () => {
        console.error("Failed to read the file as Base64");
        toast.error("Failed to process the file. Please try again.");
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate content
    if (!post.content?.trim()) {
      toast.error("Please add some content to your post");
      return;
    }

    try {
      setLoading(true);
      const newPost = await createPost(post);

      // Reset form after successful submission
      setPost({
        user_id: userId,
        image: "",
        video: "",
        content: "",
      });

      // Update UI
      onPostCreated(newPost);
      toast.success("Post created successfully");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create post",
      );
    } finally {
      setLoading(false);
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
              name="content"
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
              accept="image/jpeg,image/png,video/mp4"
              className="block w-full text-gray-600 text-sm border border-gray-300 rounded-lg shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500/10 file:text-green-600 hover:file:bg-green-100 focus:ring-4 focus:ring-green-400 focus:outline-none"
            />
            <p className="mt-2 text-sm text-gray-400">
              Supported formats: JPG, PNG, MP4. Max size: 50MB.
              {fileSize > 0 &&
                ` Selected file size: ${(fileSize / 1024).toFixed(2)}KB`}
            </p>

            {/* Preview section */}
            {post.image && (
              <div className="mt-4">
                <p className="text-sm font-medium">Image Preview:</p>
                <Image
                  src={post.image}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded-lg border border-gray-200"
                />
              </div>
            )}

            {post.video && (
              <div className="mt-4">
                <p className="text-sm font-medium">Video Preview:</p>
                <video
                  src={post.video}
                  controls
                  className="mt-2 max-h-40 rounded-lg border border-gray-200"
                />
              </div>
            )}
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
