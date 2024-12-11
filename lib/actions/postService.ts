import { client } from "@/models/client/config";
import { getPosts, getUserInfo } from "./user.actions";
import { db, postCollection } from "@/models/name";
import {  Post } from "@/types/schema";

interface SubscriptionEvent<Tpayload = string> {
  events: string[];
  payload: Tpayload;
};

export const fetchPosts = async () => {
  try {
    const response = await getPosts();
    console.log('Response from getPosts:', response); // Log full response

    if (!response || !Array.isArray(response)) {
      console.error("No posts found in response");
      console.log('Full Response:', response); // Log full response here for debugging
      return [];
    }

    const postsWithUserInfo = await Promise.all(
      response.map(async (post: { user_id: unknown }) => {
        const user = await getUserInfo({ userId: post.user_id as string });
        return {
          ...post,
          user,
        };
      })
    );

    console.log("Posts with user info:", postsWithUserInfo);
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