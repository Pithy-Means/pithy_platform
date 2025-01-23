import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
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
  postsPerPage: number;
  setPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  filteredPosts: PostWithUser[];
  setFilteredPosts: React.Dispatch<React.SetStateAction<PostWithUser[]>>;
  fetchedPages: Set<number>;
  setFetchedPages: React.Dispatch<React.SetStateAction<Set<number>>>;
}

export const PostsContext = createContext<PostsContextType>({
  posts: [],
  loading: true,
  fetchMorePosts: () => { },
  searchPosts: () => { },
  hasMore: true,
  page: 0,
  postsPerPage: 10,
  setPosts: () => { },
  setLoading: () => { },
  setPage: () => { },
  setHasMore: () => { },
  filteredPosts: [],
  setFilteredPosts: () => { },
  fetchedPages: new Set(),
  setFetchedPages: () => { },
});

export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const postsPerPage = 10; // Number of posts per page
  const [hasMore, setHasMore] = useState(true);
  const [fetchedPages, setFetchedPages] = useState<Set<number>>(new Set());

  const [filteredPosts, setFilteredPosts] = useState<PostWithUser[]>([]);  // Add a new state to store filtered posts

  //Load cached posts from localstorage on mount
  // useEffect(() => {
  //   const cachedPosts = localStorage.getItem("posts");
  //   if (cachedPosts) {
  //     try {
  //       setPosts(JSON.parse(cachedPosts));
  //     } catch (error) {
  //       console.error("Error parsing posts from localStorage:", error);
  //     }
  //   }
  // }, []);
  useEffect(() => {
    const cachedPosts = localStorage.getItem("posts");  // Load cached posts from localstorage
    if (cachedPosts) {
      // Parse the cached posts
      try {
        const parsedPosts = JSON.parse(cachedPosts);
        // console.log("Parsed posts:", parsedPosts);
        if (Array.isArray(parsedPosts)) {  // Check if the parsed posts is an array
          setPosts(parsedPosts);
          setFilteredPosts(parsedPosts);  // Set the filteredPosts state with the parsed posts
          setLoading(false);
        } else {  // Log an error if the parsed posts is not an array
          console.error("Invalid posts data");
          setPosts([]);
        }
      } catch (error) {  // Log an error if the posts cannot be parsed
        console.error("Error parsing posts from localStorage:", error);
        setPosts([]);
      }
    }

  }, []);  // Run this effect only once on mount
  console.log("Load cahed posts on mount:", posts);

  // Save posts to localstorage whenever it changes
  // useEffect(() => {
  //   localStorage.setItem("posts", JSON.stringify(posts));
  // }, [posts]);

  // Fetch posts whenever the page changes
  // useEffect(() => {
  //   // function to fetch posts from Appwrite server
  //   const fetchPosts = async () => {
  //     if (fetchedPages.has(page)) return;  // Check if the page has already been fetched
  //     // setLoading(true);
  //     try {
  //       const fetchedPosts = await getPosts(); // Fetch posts from Appwrite with pagination
  //      setPosts((prev) => {
  //       const newPosts = fetchedPosts.filter(
  //         (newPost: PostWithUser) => !prev.some((oldPost: PostWithUser) => oldPost.post_id === newPost.post_id)
  //       );
  //       return [...prev, ...newPosts];
  //      })

  //       // setFilteredPosts((prev) => [...prev, ...fetchedPosts]);  // Add the fetched posts to the filteredPosts state
  //       setHasMore(fetchedPosts.length > 0);
  //       setFetchedPages((prev) => new Set(prev).add(page));  // Add the fetched page to the fetchedPages state
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //       setPosts([]);
  //       setFilteredPosts([]);  // Reset the filteredPosts state
  //       setHasMore(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   if (hasMore) fetchPosts();
  // }, [page, fetchedPages, hasMore]);  // Run this effect whenever the page changes

  // Fetch posts from the server only if no cached posts exist
  useEffect(() => {
    if (posts.length === 0) {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          const fetchedPosts = await getPosts();
          setPosts(fetchedPosts);
          setFilteredPosts(fetchedPosts);
          localStorage.setItem("posts", JSON.stringify(fetchedPosts)); // Cache posts in localStorage
          setHasMore(fetchedPosts.length > 0);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
    }
  }, [posts]);

  // Function to fetch more posts (trigger pagination)
  // const fetchMorePosts = () => {
  //   if (hasMore) setPage((prev) => prev + 1);
  // };

  // search function
  // const searchPosts = useCallback(async (query: string) => {
  //   console.log("Searching posts for:");
  //   // setLoading(true);
  //   // const allPosts = Array.isArray(posts) && posts.length > 0 ? posts : await getPosts();
  //   console.log("All posts:", posts);
  //   if (!Array.isArray(posts)) {
  //     console.error("No posts data available.");
  //     setFilteredPosts([]);
  //     return;
  //   }
  //   // filter posts based on the query
  //   const results = posts.filter((post: PostWithUser) => {
  //     if (!post.user) return false; // Skip posts without user data
  //     const isMatch =
  //       post.user.firstname?.toLowerCase().includes(query.toLowerCase()) ||
  //       post.user.lastname?.toLowerCase().includes(query.toLowerCase()) ||
  //       post.user.name?.toLowerCase().includes(query.toLowerCase()) ||
  //       post.user?.toString().includes(query) ||
  //       post.content?.toLowerCase().includes(query.toLowerCase());
  //     return isMatch;
  //   });
  //   console.log("Search results:", results);
  //   setFilteredPosts(results || []);

  // }, [posts]);

  // Search function to filter cached posts
  const searchPosts = useCallback(
    (query: string) => {
      const results = posts.filter((post) => {
        console.log("Searching posts for:", query);
        const isMatch =
          post.content?.toLowerCase().includes(query.toLowerCase()) ||
          post.user?.firstname?.toLowerCase().includes(query.toLowerCase()) ||
          post.user?.lastname?.toLowerCase().includes(query.toLowerCase());
        return isMatch;
      });
      setFilteredPosts(results);

      console.log("Search results:", results);
    },
    [posts]
  );

  // Function to fetch more posts (pagination)
  const fetchMorePosts = async () => {
    if (!hasMore || loading) return; // Return if there are no more posts or if the app is loading

    setLoading(true); // Set loading state to true to prevent multiple simultaneous fetches

    try {
      const offset = page * postsPerPage; // Calculate the offset based on the current page and posts per page
      const newPosts = await getPosts(postsPerPage, offset); // Fetch the next batch of posts

      if (newPosts.length === 0) { // If no new posts are fetched, set hasMore to false
        setHasMore(false);
      } else {
        // setPosts((prev) => [...prev, ...newPosts]); // Add the new posts to the existing posts
        // setFilteredPosts((prev) => [...prev, ...newPosts]); // Add the new posts to the filtered posts
        // setPage((prev) => prev + 1); // Increment the page number
        setPosts((prev) => {
          const updatedPosts = [...prev]; // Combine the existing posts with the new posts
          newPosts.forEach((newPost: PostWithUser) => {
            if (!updatedPosts.find((post) => post.post_id === newPost.post_id)) {
              updatedPosts.push(newPost); // Add the new post if it doesn't already exist
            }
          });
          localStorage.setItem("posts", JSON.stringify(updatedPosts)); // Cache the updated posts in localStorage
          return updatedPosts; // Update the posts state
        });
        setPage((prev) => prev + 1); // Increment the page number
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false); // Reset the loading state
    }
  };
  console.log("More Posts:", posts);

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
        fetchedPages,
        setFetchedPages,
        postsPerPage,
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