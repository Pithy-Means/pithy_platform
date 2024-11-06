"use client";

import { PostWithUser } from "@/types/schema";
import { useState, useEffect } from "react";
import { fetchPosts, subscribeToPostChanges } from "../actions/postService";
import { getUserInfo } from "../actions/user.actions";

export const usePosts = () => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const initialPosts = await fetchPosts();
      setPosts(initialPosts);
    };
    loadPosts();
  }, []);

  useEffect(() => {
    const unsubscribe = subscribeToPostChanges(async (res) => {
      const { events, payload } = res;
  
      if (events.includes("create")) {
        const user = await getUserInfo({ userId: payload.user_id! });
        setPosts((prev) => [...prev, { ...payload, user }]);
      }
  
      if (events.includes("update")) {
        setPosts((prev) =>
          prev.map((post) =>
            post.post_id === payload.post_id ? { ...payload, user: post.user } : post
          )
        );
      }
  
      if (events.includes("delete")) {
        setPosts((prev) =>
          prev.filter((post) => post.post_id !== payload.post_id)
        );
      }
    });
  
    // Cleanup: Only call unsubscribe if it's a function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  
  
  return posts;
}