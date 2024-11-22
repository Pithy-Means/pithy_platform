import { client } from "@/models/client/config";
import { getPosts, getUserInfo } from "./user.actions";
import { db, postCollection } from "@/models/name";
import { Post, PostWithUser } from "@/types/schema";

type PostEvent = {
  events: string[];
  payload: Post;
};

export const fetchPosts = async (): Promise<PostWithUser[]> => {
  try {
    const response = await getPosts();
    console.log("Posts:", response);
    const postsWithUserInfo: PostWithUser[] = await Promise.all(
      response.documents.map(async (post: Post) => {
        const user = await getUserInfo({ userId: post.user_id! });
        return {
          ...post,
          user,
        };
      }),
    );
    console.log("Posts with user info:", postsWithUserInfo);
    return postsWithUserInfo;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

// Adjusted subscription logic
export const subscribeToPostChanges = (
  callback: (posts: PostEvent) => void,
): (() => void) => {
  const unsubscription = client.subscribe(
    `databases.${db}.collections.${postCollection}.documents`,
    callback,
  );

  return () => {
    unsubscription();
  };
};
