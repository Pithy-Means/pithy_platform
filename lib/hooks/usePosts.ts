"use client";

import { PostWithUser } from "@/types/schema";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPosts, subscribeToPostChanges } from "../actions/postService";
import { getUserInfo } from "../actions/user.actions";

export const usePosts = () => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const hasRun = useRef(false);
  const cache = useRef<Map<number, PostWithUser[]>>(new Map());
  const prefetchQueue = useRef<Promise<PostWithUser[]>[]>([]);

  // Prefetch multiple pages ahead
  const prefetchPages = useCallback(async (startPage: number, numPages: number = 2) => {
    const promises = [];
    for (let i = 0; i < numPages; i++) {
      const pageToFetch = startPage + i;
      if (!cache.current.has(pageToFetch)) {
        const promise = fetchPosts(pageToFetch, 6).then(posts => {
          cache.current.set(pageToFetch, posts);
          return posts;
        });
        promises.push(promise);
      }
    }
    prefetchQueue.current = promises;
    return Promise.all(promises);
  }, []);

  // Get posts from cache or fetch if not available
  const getPostsForPage = useCallback(async (page: number, pageSize: number = 6) => {
    if (cache.current.has(page)) {
      return cache.current.get(page) || [];
    }
    const posts = await fetchPosts(page, pageSize);
    cache.current.set(page, posts);
    return posts;
  }, []);

  const loadMorePosts = useCallback(async () => {
    if (loadingPosts || !hasMore) return;

    setLoadingPosts(true);
    try {
      // Try to get posts from cache first
      const currentPosts = await getPostsForPage(pageRef.current);
      
      if (currentPosts.length === 0) {
        setHasMore(false);
      } else {
        // Update posts state immediately with cached data
        setPosts(prevPosts => {
          const uniquePosts = [...prevPosts];
          currentPosts.forEach(newPost => {
            if (!uniquePosts.some(post => post.post_id === newPost.post_id)) {
              uniquePosts.push(newPost);
            }
          });
          
          return uniquePosts.sort((a, b) => 
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
          );
        });

        pageRef.current += 1;

        // Prefetch next two pages
        prefetchPages(pageRef.current);

        // Check if we've reached the end
        const nextPagePosts = await getPostsForPage(pageRef.current);
        if (nextPagePosts.length === 0) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, [loadingPosts, hasMore, getPostsForPage, prefetchPages]);

  // Initial load with aggressive prefetching
  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      
      const initialLoad = async () => {
        setLoadingPosts(true);
        try {
          // Load first page and immediately start prefetching next pages
          const [initialPosts] = await Promise.all([
            getPostsForPage(1, 9), // Load more posts initially
            prefetchPages(2, 3)    // Prefetch pages 2, 3, and 4
          ]);

          setPosts(initialPosts);
          pageRef.current = 2;
          
          if (initialPosts.length < 9) {
            setHasMore(false);
          }
        } catch (error) {
          console.error("Error in initial load:", error);
        } finally {
          setLoadingPosts(false);
        }
      };

      initialLoad();
    }
  }, [getPostsForPage, prefetchPages]);

  // Clear cache when component unmounts
  useEffect(() => {
    const currentCache = cache.current;
    return () => {
      currentCache.clear();
      prefetchQueue.current = [];
    };
  }, []);

  // Handle real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToPostChanges(async (res) => {
      const { events, payload } = res;

      if (payload.user_id) {
        const user = await getUserInfo({ userId: payload.user_id });

        setPosts((prevPosts) => {
          let updatedPosts = [...prevPosts];

          if (events.includes("create")) {
            updatedPosts = [{ ...payload, user }, ...updatedPosts];
            // Clear cache when new post is created
            cache.current.clear();
          } else if (events.includes("update")) {
            updatedPosts = updatedPosts.map((post) =>
              post.post_id === payload.post_id ? { ...payload, user } : post
            );
            // Update post in cache
            cache.current.forEach((posts, page) => {
              const updatedCachePosts = posts.map((post) =>
                post.post_id === payload.post_id ? { ...payload, user } : post
              );
              cache.current.set(page, updatedCachePosts);
            });
          } else if (events.includes("delete")) {
            updatedPosts = updatedPosts.filter((post) => 
              post.post_id !== payload.post_id
            );
            // Remove deleted post from cache
            cache.current.forEach((posts, page) => {
              const updatedCachePosts = posts.filter((post) =>
                post.post_id !== payload.post_id
              );
              cache.current.set(page, updatedCachePosts);
            });
          }

          return updatedPosts.sort((a, b) => 
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
          );
        });
      }
    });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return { posts, loadingPosts, hasMore, loadMorePosts };
};