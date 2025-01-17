import React, { createContext, useState, useEffect, useContext } from "react";
import { getPosts } from "@/lib/actions/user.actions"; // Replace with your Appwrite fetch logic
import { PostWithUser } from "@/types/schema";

interface PostsContextType {
  posts: PostWithUser[];
  // setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
  loading: boolean;
  fetchMorePosts: () => void;
  hasMore: boolean;
  page: number;
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // function to fetch posts from Appwrite server
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await getPosts(); // Fetch posts from Appwrite with pagination
      setPosts((prev) => [...prev, ...fetchedPosts]);
      setHasMore(fetchedPosts.length > 0);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch more posts (trigger pagination)
  const fetchMorePosts = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  // Fetch posts whenever the page changes
  useEffect(() => {
    fetchPosts();
  }, [page]);

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        fetchMorePosts,
        hasMore,
        page,
        setPosts,
        setLoading,
        setPage,
        setHasMore,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};


// Custom hook to use the PostsContext
export const usePost = (): PostsContextType => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
};