/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { PostWithUser } from "@/types/schema";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPosts, subscribeToPostChanges } from "../actions/postService";
import { getUserInfo } from "../actions/user.actions";

export const usePosts = () => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);
  const isFetching = useRef(false);
  const cache = useRef<Map<number, PostWithUser[]>>(new Map());
  const lastRequestTime = useRef<number>(0);

  // Set constant batch size to 4 posts per request
  const BATCH_SIZE = 4;

  // Fetch posts with retry mechanism
  const fetchWithRetry = useCallback(
    async (
      page: number,
      limit: number = BATCH_SIZE,
      signal?: AbortSignal,
      retries = 2,
    ): Promise<PostWithUser[]> => {
      try {
        // Add debounce for rapid consecutive calls
        const now = Date.now();
        if (now - lastRequestTime.current < 300) {
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
        lastRequestTime.current = Date.now();

        const result = await fetchPosts(page, limit, signal);
        return result;
      } catch (error) {
        if (retries > 0 && !signal?.aborted) {
          // Exponential backoff
          const delay = 1000 * Math.pow(2, 3 - retries);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return fetchWithRetry(page, limit, signal, retries - 1);
        }
        throw error;
      }
    },
    [],
  );

  // Advanced background fetching with smarter caching
  const fetchMoreInBackground = useCallback(
    (page: number, limit: number = BATCH_SIZE) => {
      if (cache.current.has(page)) return;

      const controller = new AbortController();
      const { signal } = controller;
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // Mark as being fetched to prevent duplicate requests
      cache.current.set(page, []);

      const fetchData = async () => {
        try {
          console.log(`Starting background fetch for page ${page}`);
          const result = await fetchWithRetry(page, limit, signal);

          clearTimeout(timeoutId);
          console.log(
            `Background fetch completed for page ${page}, got ${result.length} posts`,
          );

          if (result && result.length > 0) {
            // Update the cache with actual results
            cache.current.set(page, result);

            // If user is viewing this page, update the UI
            if (pageRef.current === page) {
              setPosts((prevPosts) => {
                const uniquePosts = [...prevPosts];
                result.forEach((newPost) => {
                  const existingIndex = uniquePosts.findIndex(
                    (p) => p.post_id === newPost.post_id,
                  );
                  if (existingIndex === -1) {
                    uniquePosts.push(newPost);
                  } else {
                    uniquePosts[existingIndex] = newPost; // Update with fresher data
                  }
                });

                return uniquePosts.sort(
                  (a, b) =>
                    new Date(b.$createdAt).getTime() -
                    new Date(a.$createdAt).getTime(),
                );
              });

              // Move to next page
              pageRef.current = page + 1;
            }

            // Continue prefetching if we got a full page
            if (result.length >= limit && !cache.current.has(page + 1)) {
              fetchMoreInBackground(page + 1, limit);
            }
          } else {
            // If we got an empty page, there's no more data
            cache.current.delete(page); // Remove empty placeholder
            setHasMore(false);
          }
        } catch (err) {
          clearTimeout(timeoutId);
          if (signal.aborted) {
            console.log(`Background fetch for page ${page} was aborted`);
          } else {
            console.error(`Background fetch error for page ${page}:`, err);
            // Remove failed page from cache to allow retry
            cache.current.delete(page);
          }
        }
      };

      fetchData();
    },
    [fetchWithRetry],
  );

  // Optimized initial post loading with progressive enhancement
  const fetchInitialPosts = useCallback(async () => {
    if (cache.current.has(1) && cache.current.get(1)?.length) {
      // Use cached first page if available
      const cachedPosts = cache.current.get(1) || [];
      setPosts(cachedPosts);
      pageRef.current = 2;

      // Still refresh in background to ensure data freshness
      setTimeout(() => fetchMoreInBackground(1, BATCH_SIZE), 100);
      return;
    }

    setLoadingPosts(true);
    setError(null);

    try {
      console.log("Fetching initial posts...");
      const initialPosts = await fetchWithRetry(1, BATCH_SIZE);

      if (initialPosts && initialPosts.length > 0) {
        console.log(`Fetched ${initialPosts.length} initial posts`);
        setPosts(initialPosts);
        cache.current.set(1, initialPosts);
        pageRef.current = 2;

        // Immediately start prefetching next page
        fetchMoreInBackground(2, BATCH_SIZE);
      } else {
        console.warn("No initial posts returned");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching initial posts:", error);
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoadingPosts(false);
    }
  }, [fetchWithRetry, fetchMoreInBackground]);

  // Enhanced infinite scroll with smoother loading
  const loadMorePosts = useCallback(async () => {
    if (isFetching.current || !hasMore) return;

    isFetching.current = true;
    setLoadingPosts(true);

    try {
      const currentPage = pageRef.current;

      // Check if we already have this page cached
      if (
        cache.current.has(currentPage) &&
        cache.current.get(currentPage)?.length
      ) {
        const cachedPosts = cache.current.get(currentPage) || [];

        setPosts((prevPosts) => {
          const uniquePosts = [...prevPosts];
          cachedPosts.forEach((newPost) => {
            const existingIndex = uniquePosts.findIndex(
              (p) => p.post_id === newPost.post_id,
            );
            if (existingIndex === -1) {
              uniquePosts.push(newPost);
            } else {
              uniquePosts[existingIndex] = newPost; // Update with fresher data
            }
          });

          return uniquePosts.sort(
            (a, b) =>
              new Date(b.$createdAt).getTime() -
              new Date(a.$createdAt).getTime(),
          );
        });

        pageRef.current += 1;

        // Start prefetching next page if needed
        if (cachedPosts.length > 0 && !cache.current.has(pageRef.current)) {
          fetchMoreInBackground(pageRef.current, BATCH_SIZE);
        } else if (cachedPosts.length === 0) {
          setHasMore(false);
        }
      } else {
        // If not in cache, fetch directly with visual feedback
        console.log(`Fetching more posts for page ${currentPage}`);
        const newPosts = await fetchWithRetry(currentPage, BATCH_SIZE);

        if (!newPosts || newPosts.length === 0) {
          setHasMore(false);
        } else {
          setPosts((prevPosts) => {
            const uniquePosts = [...prevPosts];
            newPosts.forEach((newPost) => {
              const existingIndex = uniquePosts.findIndex(
                (p) => p.post_id === newPost.post_id,
              );
              if (existingIndex === -1) {
                uniquePosts.push(newPost);
              } else {
                uniquePosts[existingIndex] = newPost;
              }
            });

            return uniquePosts.sort(
              (a, b) =>
                new Date(b.$createdAt).getTime() -
                new Date(a.$createdAt).getTime(),
            );
          });

          // Update cache and move to next page
          cache.current.set(currentPage, newPosts);
          pageRef.current += 1;

          // Prefetch next page immediately
          if (!cache.current.has(pageRef.current)) {
            fetchMoreInBackground(pageRef.current, BATCH_SIZE);
          }
        }
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
      setError("Failed to load more posts. Please try again.");

      // Allow retry if failed
      pageRef.current -= 1;
    } finally {
      setLoadingPosts(false);
      isFetching.current = false;
    }
  }, [hasMore, fetchMoreInBackground, fetchWithRetry]);

  // Initialize posts with smarter timing
  useEffect(() => {
    // Only start fetching after component is fully mounted
    const initTimeout = setTimeout(() => {
      fetchInitialPosts();
    }, 100);

    // Clean up function
    return () => {
      clearTimeout(initTimeout);

      // Don't clear cache on unmount to benefit from browser navigation
      // Only clear if cache gets too large
      const currentCache = cache.current;
      const cacheCopy = new Map(currentCache);
      if (cacheCopy.size > 20) {
        cacheCopy.clear();
      }
    };
  }, [fetchInitialPosts]);

  // Enhanced real-time updates with smarter batching
  useEffect(() => {
    let updateTimeoutId: NodeJS.Timeout | null = null;
    const pendingUpdates = new Map<string, PostWithUser>();
    let batchCount = 0;

    const processUpdates = async () => {
      if (pendingUpdates.size === 0) return;

      const updates = Array.from(pendingUpdates.values());
      pendingUpdates.clear();
      batchCount = 0;

      setPosts((prevPosts) => {
        let updatedPosts = [...prevPosts];
        let hasChanges = false;

        updates.forEach((update) => {
          const existingIndex = updatedPosts.findIndex(
            (post) => post.post_id === update.post_id,
          );

          if (existingIndex === -1) {
            // New post
            updatedPosts = [update, ...updatedPosts];
            hasChanges = true;
          } else if (
            // Only update if content changed or newer timestamp
            updatedPosts[existingIndex].$updatedAt !== update.$updatedAt ||
            JSON.stringify(updatedPosts[existingIndex]) !==
              JSON.stringify(update)
          ) {
            // Update existing post
            updatedPosts[existingIndex] = update;
            hasChanges = true;
          }
        });

        // Only sort if changes were made
        return hasChanges
          ? updatedPosts.sort(
              (a, b) =>
                new Date(b.$createdAt).getTime() -
                new Date(a.$createdAt).getTime(),
            )
          : prevPosts;
      });

      // Also update cache entries that contain these posts
      updates.forEach((update) => {
        cache.current.forEach((posts, page) => {
          const pageUpdated = posts.some(
            (post) => post.post_id === update.post_id,
          );
          if (pageUpdated) {
            cache.current.set(
              page,
              posts.map((post) =>
                post.post_id === update.post_id ? update : post,
              ),
            );
          }
        });
      });
    };

    const unsubscribe = subscribeToPostChanges(async (res) => {
      const { events, payload } = res;

      if (!payload.user_id) return;

      try {
        if (events.includes("delete")) {
          // Handle deletions immediately
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.post_id !== payload.post_id),
          );

          // Also update cache
          cache.current.forEach((posts, page) => {
            if (posts.some((post) => post.post_id === payload.post_id)) {
              cache.current.set(
                page,
                posts.filter((post) => post.post_id !== payload.post_id),
              );
            }
          });
          return;
        }

        // For creates and updates, batch process them
        const user = await getUserInfo({ userId: payload.user_id as string });
        const updatedPost = { ...payload, user };

        pendingUpdates.set(payload.post_id as string, updatedPost);
        batchCount++;

        // Clear any existing timeout
        if (updateTimeoutId) {
          clearTimeout(updateTimeoutId);
        }

        // Process updates in batches - use dynamic timing based on batch size
        const delay = batchCount > 5 ? 50 : 100;
        updateTimeoutId = setTimeout(processUpdates, delay);
      } catch (error) {
        console.error("Error handling subscription update:", error);
      }
    });

    return () => {
      if (updateTimeoutId) {
        clearTimeout(updateTimeoutId);
        // Process any remaining updates before unmounting
        processUpdates();
      }

      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // Add a reset function that can be used to refresh the feed
  const refreshPosts = useCallback(() => {
    // Clear the first page from cache to force a fresh fetch
    cache.current.delete(1);
    pageRef.current = 1;
    setHasMore(true);
    fetchInitialPosts();
  }, [fetchInitialPosts]);

  return {
    posts,
    loadingPosts,
    hasMore,
    loadMorePosts,
    refreshPosts,
    error,
  };
};
