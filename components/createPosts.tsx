'use client';
import { createPost } from '@/lib/actions/user.actions';
import { Post, PostWithUser } from '@/types/schema';
import React, { useState } from 'react'
import Image from 'next/image';
// import { createAdminClient } from '@/utils/appwrite';
import { isImage, isVideo, compressImage, compressVideo, validateFile } from '../utils/videoImageFormats';
// import { parseStringify } from '@/lib/utils';
import { getSession } from '@/lib/actions/user.actions';
import { parseCookies } from 'nookies';

interface CreatePostProps {
  userId: string; // Pass the logged-in user ID as a prop 
  onPostCreated: (newPost: PostWithUser) => void; // Callback function to update the post list
}

const CreatePosts: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  // Define initial state for the post
  const [post, setPost] = useState<Post>(() => ({ user_id: userId }));
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [uploading, setUploading] = useState<boolean>(false);

  // const useAuth = async () => {
  // const { client } = await createAdminClient();
  // return new Account(client);
  // };

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const processedFile = isImage(file)
        ? await compressImage(file)
        : isVideo(file)
          ? await compressVideo(file)
          : file;

      setSelectedFile(processedFile);
      // setFileType(file.type.includes('image') ? 'image' : 'video');
      setFileType(isImage(processedFile) ? 'image' : 'video');
      setError(null);
    } catch (err) {
      setError('Error processing file.');
      throw new Error(`Compression failed: ${err}`);
    }
  };

  // Reset file selection 
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setError(null);
  };

  // Upload file to Appwrite
  const uploadFileToAppwrite = async (selectedFile: File): Promise<string | null> => {
    try {
      setLoading(true); // Set the loading state

      // Check if a session token is available
      const cookies = parseCookies();
      const token = cookies.authToken;
      if (!token) {
        // If no session token is available, get a new one
        const sessionToken = await getSession();
        if (!sessionToken) return null;
      }

      // Create a new form data for the file upload
      const formData = new FormData();
      formData.append('file', selectedFile); // attach the file to the form data
      // formData.set('file', file); // set the file with the name

      // Send the file to the server
      const response = await fetch('/api/upload-files', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // body: JSON.stringify({ media_url: selectedFile }),
        body: formData,
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error || 'Failed to upload file.');
        return null;
      } else {
        return data.fileId;
      }
    } catch (err) {
      console.error('File upload failed:', err);
      setError('An unexpected error occurred during file upload, please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload a valid image or video.');
      return;
    }

    try {
      // setLoading(true); //Start loading state
      // Upload file to Appwrite
      const fileId = await uploadFileToAppwrite(selectedFile);
      // const { fileId} = await uploadFileToAppwrite.json();

      if (!fileId) {
        setError('File upload failed. Please check and try again.');
        return; // If file upload failed, stop further execution
      }

      const postData = {
        ...post, // Include the post content
        // mediaUrl: fileId, // Update the post with the media URL
        mediaUrl: `storage/files/${fileId}/view`, // Construct the media url for viewing
        mediaType: selectedFile.type, // Update the post with the media type
      }
      // Create the post with the file ID
      const newPost = await createPost({ ...postData });

      // If post creation failed, stop further execution
      // if (!newPost) {
      //   setError('Failed to create post. Please try again.');
      //   return;
      // }

      if (newPost) {
        // Post creation successful, update UI
        onPostCreated(newPost); // Update the post list with new post | notify parent component
        // Reset form state
        setPost({ user_id: userId }); // Reset post
        handleRemoveFile(); // clear file input

      }
    } catch (err) {
      console.error('Post creation failed:', err);
      setError('An unexpected error occure while creating the post.');
    } finally {
      setLoading(false); //Reset loading state
    }
  };

  return (
    <>
      {loading ? (
        <p>Creating post, please wait...</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 text-black">
          <h2 className="text-xl font-semibold mb-4">Create a New Post</h2>

          <div className="flex flex-col">
            <label htmlFor="content" className="font-medium">
              Content
            </label>
            <textarea
              disabled={loading}
              id="content"
              name="content"
              value={post.content || ''}
              onChange={handleInputChange}
              placeholder='What do you want to share?'
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='media' className='font-medium'>
              Upload Media (JPG, PNG, GIF, MP4
            </label>
            <input
              disabled={loading}
              type='file'
              id='media'
              accept='image/*, video/*'
              onChange={handleFileChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {selectedFile && (
              <div className='mt-2'>
                <p className='text-sm border dotted rounded-md'>
                  {fileType === 'image' ? (
                    <Image src={URL.createObjectURL(selectedFile)}
                      alt='Selected Image'
                      width={200}
                      height={200}
                      className='max-w-full max-h-64 rounded-md'
                    />
                  ) : (
                    <video
                      controls
                      src={URL.createObjectURL(selectedFile)}
                      // alt='Selected Video'
                      width={200}
                      height={200}
                      className='max-w-full max-h-64 rounded-md'
                    // controls
                    />
                  )}
                </p>
                <button
                  type='button'
                  onClick={handleRemoveFile}
                  className='text-red-500 hover:text-red-700 text-sm hover: underline'
                >
                  Remove file
                </button>
              </div>
            )}

          </div>
          {error && <p className='text-red-500'>{error}</p>}

          <button
            type="submit"
            className={`bg-blue-500 text-white rounded-md py-2 hover:bg-blue-600
              ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Create Post'}
          </button>
        </form>
      )}
    </>
  );
};

export default CreatePosts;
