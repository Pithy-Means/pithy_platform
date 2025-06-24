// postService.ts - Optimized for speed
import { create } from "zustand";
import { Post } from "@/types/schema";
import { db, postCollection } from "@/models/name";
import { client } from "@/models/client/config";
import { getPosts, getUserInfo } from "./user.actions";

interface SubscriptionEvent<Tpayload = string> {
  events: string[];
  payload: Tpayload;
}

// Create a store to manage posts with aggressive caching
interface PostStore {
  posts: Post[];
  postsById: Map<string, Post>;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  removePost: (postId: string) => void;
  setPosts: (posts: Post[]) => void;
  getPostById: (id: string) => Post | undefined;
  subscribeToPostChanges: (
    callback: (event: SubscriptionEvent<Post>) => void,
  ) => () => void;
}

const usePostStore = create<PostStore>((set, get) => ({
  posts: [],
  postsById: new Map(), // For O(1) lookups
  addPost: (post) =>
    set((state) => {
      const postsById = new Map(state.postsById);
      postsById.set(post.post_id as string, post);
      return {
        posts: [post, ...state.posts.filter((p) => p.post_id !== post.post_id)],
        postsById,
      };
    }),
  updatePost: (post) =>
    set((state) => {
      const postsById = new Map(state.postsById);
      postsById.set(post.post_id as string, post);
      return {
        posts: state.posts.map((p) => (p.post_id === post.post_id ? post : p)),
        postsById,
      };
    }),
  removePost: (postId) =>
    set((state) => {
      const postsById = new Map(state.postsById);
      postsById.delete(postId);
      return {
        posts: state.posts.filter((p) => p.post_id !== postId),
        postsById,
      };
    }),
  setPosts: (posts) =>
    set(() => {
      const postsById = new Map();
      posts.forEach((post) => {
        postsById.set(post.post_id as string, post);
      });
      return { posts, postsById };
    }),
  getPostById: (id) => get().postsById.get(id),
  subscribeToPostChanges: (callback) => {
    const unsubscribe = client.subscribe(
      `databases.${db}.documents.${postCollection}.documents`,
      callback,
    );
    return unsubscribe;
  },
}));

// Optimized fetch with AbortController support
export const fetchPosts = async (
  page: number = 1,
  limit: number = 6,
  signal?: AbortSignal,
) => {
  // First check the store
  const currentPosts = usePostStore.getState().posts;
  if (currentPosts.length > (page - 1) * limit) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = currentPosts.slice(startIndex, endIndex);

    // If we have enough cached posts, return them immediately
    if (paginatedPosts.length === limit) {
      return paginatedPosts;
    }
  }

  try {
    // Use Promise.race to enforce a timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Fetch timeout")), 5000);
    });

    const fetchPromise = await getPosts(page, limit);
    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (signal?.aborted) {
      throw new Error("Fetch aborted");
    }

    if (!response || !Array.isArray(response)) {
      console.error("No posts found in response");
      return [];
    }

    // Fetch user info in parallel for all posts
    const postsWithUserInfo = await Promise.all(
      response.map(async (post) => {
        if (signal?.aborted) {
          throw new Error("Fetch aborted during user info loading");
        }

        // Check if we already have user info in another post
        const existingPostWithSameUser = currentPosts.find(
          (p) => p.user_id === post.user_id,
        );
        if (existingPostWithSameUser && existingPostWithSameUser.user) {
          return { ...post, user: existingPostWithSameUser.user };
        }

        const user = await getUserInfo({ userId: post.user_id as string });
        return { ...post, user };
      }),
    );

    // Update store to include these posts
    if (postsWithUserInfo.length > 0) {
      // Merge with existing posts, avoiding duplicates
      const mergedPosts = [...currentPosts];

      postsWithUserInfo.forEach((newPost) => {
        const existingIndex = mergedPosts.findIndex(
          (p) => p.post_id === newPost.post_id,
        );
        if (existingIndex >= 0) {
          mergedPosts[existingIndex] = newPost;
        } else {
          mergedPosts.push(newPost);
        }
      });

      // Sort by creation date
      const sortedPosts = mergedPosts.sort(
        (a, b) =>
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime(),
      );

      usePostStore.getState().setPosts(sortedPosts);
    }

    return postsWithUserInfo;
  } catch (error) {
    if (signal?.aborted) {
      console.log("Fetch aborted");
    } else {
      console.error("Error fetching posts:", error);
    }
    return [];
  }
};

// Optimized subscription with batch processing
export const subscribeToPostChanges = (
  callback: (event: SubscriptionEvent<Post>) => void,
): (() => void) => {
  let pendingEvents: SubscriptionEvent<Post>[] = [];
  let processingTimeout: NodeJS.Timeout | null = null;

  // Process events in batches
  const processEvents = () => {
    if (pendingEvents.length === 0) return;

    const events = [...pendingEvents];
    pendingEvents = [];

    events.forEach((event) => {
      callback(event);
    });

    processingTimeout = null;
  };

  // Subscribe with batching
  const unsubscription = client.subscribe(
    `databases.${db}.documents.${postCollection}.documents`,
    (event) => {
      pendingEvents.push(event as SubscriptionEvent<Post>);

      if (!processingTimeout) {
        processingTimeout = setTimeout(processEvents, 100); // Process every 100ms
      }
    },
  );

  return () => {
    if (processingTimeout) {
      clearTimeout(processingTimeout);
    }
    unsubscription();
  };
};

// Optimized prefetching function
export const prefetchPosts = async (
  startPage: number,
  numPages: number = 2,
) => {
  const promises = [];
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort if taking too long
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    for (let i = 0; i < numPages; i++) {
      const pageToFetch = startPage + i;
      promises.push(fetchPosts(pageToFetch, 6, signal));
    }

    await Promise.all(promises);
  } catch (error) {
    console.error("Error during prefetch:", error);
  } finally {
    clearTimeout(timeoutId);
  }
};

// Export store for direct access
export { usePostStore };
