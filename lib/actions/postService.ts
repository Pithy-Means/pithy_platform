import { create } from 'zustand';
import { Post } from "@/types/schema";
import { db, postCollection } from '@/models/name';
import { client } from '@/models/client/config';
import { getPosts, getUserInfo } from './user.actions';

interface SubscriptionEvent<Tpayload = string> {
  events: string[];
  payload: Tpayload;
}

// Create a store to manage posts
interface PostStore {
  posts: Post[];
  addPost: (post: Post) => void;
  setPosts: (posts: Post[]) => void;
  subscribeToPostChanges: (callback: (event: SubscriptionEvent<Post>) => void) => void;
}

const usePostStore = create<PostStore>((set) => ({
  posts: [],
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts] 
  })),
  setPosts: (posts) => set({ posts }),
  subscribeToPostChanges: (callback) => {
    const unsubscribe = client.subscribe(
      `databases.${db}.documents.${postCollection}.documents`,
      callback
    );
    return unsubscribe;
  }
}));

export const fetchPosts = async (page: number = 1, limit: number = 3) => {
  try {
    const response = await getPosts(page, limit);
    
    if (!response || !Array.isArray(response)) {
      console.error("No posts found in response");
      return [];
    }

    const postsWithUserInfo = await Promise.all(
      response.map(async (post) => {
        const user = await getUserInfo({ userId: post.user_id as string });
        return { ...post, user };
      })
    );

    // Update store with fetched posts
    usePostStore.getState().setPosts(postsWithUserInfo);
    return postsWithUserInfo;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

export const subscribeToPostChanges = (
  callback: (event: SubscriptionEvent<Post>) => void
): (() => void) => {
  const unsubscription = client.subscribe(
    `databases.${db}.documents.${postCollection}.documents`,
    callback
  );

  return () => {
    unsubscription();
  };
};