import { client } from "@/models/client/config";
import { getPosts, getUserInfo } from "./user.actions";
import { db, postCollection } from "@/models/name";

export const fetchPosts = async () => {
  try {
    const response  = await getPosts();
    console.log('Posts:', response);
    const postsWithUserInfo = await Promise.all(response.documents.map(
      async (post: { user_id: any; }) => {
        const user = await getUserInfo({ userId: post.user_id });
        return {
          ...post,
          user
        };
      }
    ))
    console.log('Posts with user info:', postsWithUserInfo);
    return postsWithUserInfo;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
};

// Adjusted subscription logic
export const subscribeToPostChanges = (callback: (posts: any) => void): (() => void) => {
  const unsubscription = client.subscribe(
    `databases.${db}.collections.${postCollection}.documents`,
    callback
  );

  return () => {
    unsubscription();
  }
};
