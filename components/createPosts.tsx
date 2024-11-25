import { createPost } from '@/lib/actions/user.actions';
import { Post, PostWithUser } from '@/types/schema';
import React, { useState } from 'react'
import  setupStorage from '@/models/server/storageSetup';
import { postAttachementBucket}  from '@/models/server/storageSetup';
import { Storage} from 'node-appwrite';

interface CreatePostProps {
  userId: string; // Pass the logged-in user ID as a prop 
  onPostCreated: (newPost: PostWithUser) => void; // Callback function to update the post list

}

const CreatePost: React.FC<CreatePostProps> = ({ userId, onPostCreated }) => {
  // Define initial state for the post
  const [post, setPost] = useState<Post>({ user_id: userId });
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [error, setError] = useState<string | null>(null);
  // const [uploading, setUploading] = useState<boolean>(false);


  // const storage = setupStorage();
  const [storage, setStorage] = useState<Storage | null>(null);
  const [isStorageReady, setIsStorageReady] = useState<boolean>(false);
  
  React.useEffect(() => {
    const initializeStorage = async () => {
      try{
        const storageInstance = await setupStorage();
        setStorage(storageInstance);
        setIsStorageReady(true);
      } catch (error) {
        console.error('Failed to initialize storage:', error);
      }
    };
    initializeStorage();
  }, []);

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file format is valid
    const validImageFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    const validVideoFormats = ['video/mp4', 'video/webm', 'video/ogg'];

    // Check if the file format is valid
    if (![...validImageFormats, ...validVideoFormats].includes(file.type)) {

      setError('Invalid file format. please upload JPG, PNG, GIF or MP4 files');
      setSelectedFile(null);
      setFileType(null);
      return;
    }

    // Check if the file is an image or video
    const isImage = validImageFormats.includes(file.type);
    const isVideo = validVideoFormats.includes(file.type);

    // if (isImage && fileType === 'video') {
    //   setError('You have already selected a video. please remove it before selecting an image.');
    //   return;
    // }

    // if (isVideo && fileType === 'image') {
    //   setError('You have already selected an image. please remove it before selecting a video.');
    //   return;
    // }
    // Ensure the user is not trying to select both an image and a video at the same time
    if ((isImage && fileType === 'video') || (isVideo && fileType === 'image')) {
      setError(`You cannot mix media types. Please remove the current ${fileType} before selecting another.`);
      return;
    }

    const url = URL.createObjectURL(file);

    if (isImage) {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        const { width, height } = image;
        if (
          (width === 1080 && height === 1920) || //potrait
          (width === 1920 && height === 1080) ||//landscape
          (width === 1080 && height === 1080) //square
        ) {
          setSelectedFile(file);
          setFileType('image');
          setError(null);
        } else {
          setError('Invalid image dimensions.');
        }
        URL.revokeObjectURL(url);
      };
    } else if (isVideo) {
      const video = document.createElement('video');
      video.src = url;
      video.onloadedmetadata = () => {
        const { videoWidth, videoHeight } = video;
        if (
          (videoWidth === 1080 && videoHeight === 1920) || //potrait
          (videoWidth === 1920 && videoHeight === 1080) ||//landscape
          (videoWidth === 1080 && videoHeight === 1080) //square
        ) {
          setSelectedFile(file);
          setFileType('video');
          setError(null);
        } else {
          setError('Invalid video dimensions.');
        }
        URL.revokeObjectURL(url);
      };
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileType(null);
    setError(null);
  };

  const uploadFileToAppwrite = async (file: File) => {
    if (!isStorageReady) {
      setError('Storage is not ready. Please try again later.');
      return null;
    };
    if (!storage) {
      setError('Failed to upload file. Please try again.');
      return null;
    }
    try {
      const uploadFile = await storage.createFile(postAttachementBucket, 'unique', file);
      return uploadFile.$id;
    } catch (err) {
      setError('File to upload failed. Please try again.');
      return null;
    }
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
      setLoading(true);
      const filed = await uploadFileToAppwrite(selectedFile);
      if (!filed) return;

      const newPost = await createPost({
        ...post, // Include the post content
        mediaUrl: filed, // Update the post with the media URL
        mediaType: selectedFile.type, // Update the post with the media type
      });

      onPostCreated(newPost); // Update the post list
      setPost({ user_id: userId }); // Reset post
      setSelectedFile(null); // Reset file
      setFileType(null); // Reset file type
    } catch (err) {
      console.error(err);
      setError('Failed to create post. Please try again.');
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
              accept='image/jpeg, image/png, image/gif, image/jpg, video/mp4, video/ogg, video/webm'
              onChange={handleFileChange}
              className='border border-gray-300 rounded-md p-2'
            />
            {selectedFile && (
              <div className='mt-2'>
                <p className='text-sm'>
                  {fileType === 'image' ? 'Image selected.' : 'Video selected.'}
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
              ${!isStorageReady ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={!isStorageReady || loading}
          >
            {loading ? 'Uploading...' : 'Create Post'}
          </button>
        </form>
      )}
    </>
  );
};

export default CreatePost;
