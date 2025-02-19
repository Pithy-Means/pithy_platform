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

  const loadMorePosts = useCallback(async () => {
    if (loadingPosts || !hasMore) return;

    setLoadingPosts(true);
    try {
      const newPosts = await fetchPosts(pageRef.current, 3);
      
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prevPosts) => {
          const uniquePosts = [...prevPosts];
          newPosts.forEach(newPost => {
            if (!uniquePosts.some(post => post.post_id === newPost.post_id)) {
              uniquePosts.push(newPost);
            }
          });
          
          // Sort by creation date, newest first
          return uniquePosts.sort((a, b) => 
            new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
          );
        });
        pageRef.current += 1;
      }
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoadingPosts(false);
    }
  }, [loadingPosts, hasMore]);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      loadMorePosts();
    }
  }, [loadMorePosts]);

  useEffect(() => {
    const unsubscribe = subscribeToPostChanges(async (res) => {
      const { events, payload } = res;

      if (payload.user_id) {
        const user = await getUserInfo({ userId: payload.user_id });

        setPosts((prevPosts) => {
          let updatedPosts = [...prevPosts];

          if (events.includes("create")) {
            updatedPosts = [{ ...payload, user }, ...updatedPosts];
          } else if (events.includes("update")) {
            updatedPosts = updatedPosts.map((post) =>
              post.post_id === payload.post_id ? { ...payload, user } : post
            );
          } else if (events.includes("delete")) {
            updatedPosts = updatedPosts.filter((post) => 
              post.post_id !== payload.post_id
            );
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