'use client';
import { createPost } from '@/lib/actions/user.actions';
import { Post, PostWithUser } from '@/types/schema';
import React, { useState } from 'react'
import Image from 'next/image';
import { isImage, isVideo, compressImage, compressVideo, validateFile} from '../utils/videoImageFormats';

interface CreatePostProps {
  userId: string; // Pass the logged-in user ID as a prop 
  onPostCreated: (newPost: PostWithUser) => void; // Callback function to update the post list

}

const CreatePost: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  // Define initial state for the post
  const [post, setPost] = useState<Post>(() => ({ user_id: userId }));
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [uploading, setUploading] = useState<boolean>(false);

  // const storage = setupStorage();
  // const [storage, setStorage] = useState<Storage | null>(null);
  // const [isStorageReady, setIsStorageReady] = useState<boolean>(false);

  // useEffect(() => {
  //   const initializeStorage = async () => {
  //     try{
  //       const storageInstance = await setupStorage();
  //       console.log('Storage instance:', storageInstance);
  //       setStorage(storageInstance);
  //       setIsStorageReady(true);
  //     } catch (error) {
  //       console.error('Failed to initialize storage:', error);
  //       setError('Failed to initialize storage. Please try again later.');
  //     }
  //   };
  //   initializeStorage();
  // }, []);

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
    if (error) {
      setError(validationError);
      return;
    }
  
    try {
      // let processedFile = file;
      // if (isImage(file)) {
      //   processedFile = await compressImage(file);
      // } else if (isVideo(file)) {
      //   processedFile = await compressVideo(file);
      // }

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
  
  // reset 
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setError(null);
  };

  const uploadFileToAppwrite = async (file: File): Promise<string | null> => {
       try {
      setLoading(true); // Set the loading state
      const formData = new FormData();
      formData.append('file', file); // attach the file to the form data
      // formData.set('file', file); // set the file with the name

      // Send the file to the server
      const response = await fetch('/api/upload-files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json(); // Parse the response body as JSON
        // const errorData = await response.text(); // Parse the response body as JSON
        console.error('File upload failed:', result); // Log the error to the console
        setError(result.error || 'File upload failed. Please try again.'); // Set the error state
        return null;
        // handleRemoveFile();
      }

      const { fileId } = await response.json(); // Extract 'fileId' from the response
      return fileId; // Return the file 
    } catch (err) {
      console.error('File upload failed:', err); // Log the error to the console
      setError('An unexpected error occurred during file uplaod, please try again.'); // Set the error state
      return null;
    } finally { // Reset the loading state
      setLoading(false);
    };


  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   try {
  //     setLoading(true);
  //     // Call the createPost function from user.actions.ts
  //     const newPost = await createPost(post);
  //     onPostCreated(newPost);
  //     // Redirect to the dashboard after successful post creation
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please upload a vilde image or video.');
      return;
    }

    try {
      // setLoading(true); //Start loading state
      // Upload file to Appwrite
      const fileId = await uploadFileToAppwrite(selectedFile);
      if (!fileId) {
        setError('File upload failed. Please check and try again.');
        return; // If file upload failed, stop further execution
      }

      // Create the post with the file ID
      const newPost = await createPost({
        ...post, // Include the post content
        mediaUrl: fileId, // Update the post with the media URL
        mediaType: selectedFile.type, // Update the post with the media type
      });

      // If post creation failed, stop further execution
      if (!newPost) {
        setError('Failed to create post. Please try again.');
        return;
      }

      // Post creation successful, update UI
      onPostCreated(newPost); // Update the post list with new post

      // Reset form state
      setPost({ user_id: userId }); // Reset post
      // setSelectedFile(null); // Reset file
      // setFileType(null); // Reset file type
      handleRemoveFile(); // optionally handle file removal/reset
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
              id="content"
              name="content"
              value={post.content || ''}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor='media' className='font-medium'>
              Upload Media (JPG, PNG, GIF, MP4
            </label>
            <input
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

export default CreatePost;
