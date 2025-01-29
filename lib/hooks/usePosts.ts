"use client";

import { PostWithUser } from "@/types/schema";
import { useState, useEffect, useRef } from "react";
import { fetchPosts, subscribeToPostChanges } from "../actions/postService";
import { getUserInfo } from "../actions/user.actions";

export const usePosts = () => {

  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      const loadPosts = async () => {
        setLoadingPosts(true);
        try {
          const initialPosts = (await fetchPosts()).map((post) => ({
            ...post,
            user_id: post.user_id as string | undefined,
          }));
          const reserved = initialPosts.reverse();
          setPosts(reserved);
        } catch (error) {
          console.error("Error loadingPosts posts:", error);
        } finally {
          setLoadingPosts(false);
        }
      };
      loadPosts();
    }
  }, []);

  useEffect(() => {
    if (posts.length === 0) {
      // Only subscribe if posts are not yet loaded
      const unsubscribe = subscribeToPostChanges(async (res) => {
        const { events, payload } = res;
  
        if (payload.user_id) {
          if (events.includes("create")) {
            const user = await getUserInfo({ userId: payload.user_id });
            setPosts((prev) => [...prev, { ...payload, user }]);
          }
          if (events.includes("update")) {
            setPosts((prev) =>
              prev.map((post) =>
                post.post_id === payload.post_id
                  ? { ...payload, user: post.user }
                  : post
              )
            );
          }
        }
        if (events.includes("delete")) {
          setPosts((prev) =>
            prev.filter((post) => post.post_id !== payload.post_id)
          );
        }
      });
  
      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    }
  }, [posts]); // The effect will only run if posts are empty
  

  return { posts, loadingPosts };
};
