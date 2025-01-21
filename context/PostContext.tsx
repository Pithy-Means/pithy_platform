import React, { createContext, useState, useEffect, useContext } from "react";
import { getPosts } from "@/lib/actions/user.actions"; // Replace with your Appwrite fetch logic
import { PostWithUser } from "@/types/schema";

interface PostsContextType {
  posts: PostWithUser[];
  // setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
  loading: boolean;
  fetchMorePosts: () => void;
  searchPosts: (query: string) => void;
  hasMore: boolean;
  page: number;
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  filteredPosts: PostWithUser[];
  setFilteredPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
}

export const PostsContext = createContext<PostsContextType>({
  posts: [],
  loading: true,
  fetchMorePosts: () => {},
  searchPosts: () => {},
  hasMore: true,
  page: 1,
  setPosts: () => {},
  setLoading: () => {},
  setPage: () => {},
  setHasMore: () => {},
  filteredPosts: [],
  setFilteredPosts: () => {},
});

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  // const [posts, setPosts] = useState<PostWithUser[]>(() => {
  //   // Load cached posts from localstorage
  //   const cachedPosts = localStorage.getItem("posts");
  //   return cachedPosts ? JSON.parse(cachedPosts) : [];
  // });

  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [filteredPosts, setFilteredPosts] = useState<PostWithUser[]>([]);  // Add a new state to store filtered posts

  //Load cached posts from localstorage on mount
  useEffect(() => {
    const cachedPosts = localStorage.getItem("posts");
    if (cachedPosts) {
      try{
        setPosts(JSON.parse(cachedPosts));
      } catch (error) {
        console.error("Error parsing posts from localStorage:", error);
    }
  }
  }, []);
   // Save posts to localstorage whenever it changes
   useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

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

  // search function
  const searchPosts = async (query: string) => {
    setLoading(true);
    const allPosts = posts.length > 0 ? posts : await getPosts();
    const results = allPosts.filter((post: PostWithUser) =>
      post.user?.toString().includes(query) || post.content?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(results);
  };

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
        searchPosts,
        filteredPosts,
        setFilteredPosts,
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