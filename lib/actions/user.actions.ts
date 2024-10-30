"use server";

import { CommentPost, GetUserInfo, LoginInfo, Post, UserInfo } from "@/types/schema";
import dayjs from 'dayjs';
import { createAdminClient, createSessionClient } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { generateValidPostId, parseStringify } from "../utils";
import { db, postCollection, postCommentCollection, userCollection } from "@/models/name";
// import { get } from "http";

export const getUserInfo = async ({ userId }: GetUserInfo) => {
  try {
    const { databases } = await createAdminClient();
    const user = await databases.listDocuments(db, userCollection, [
      Query.equal("user_id", [userId]),
    ]);
    return parseStringify(user.documents[0]);
  } catch (error) {
    console.error(error);
  }
};

export const login = async ({ email, password }: LoginInfo) => {
  try {
    const { account } = await createAdminClient() || {};

    if (!account) {
      throw new Error("Account creation failed.");
    }
    const session = await account.createEmailPasswordSession(email, password);
    console.log('Session', session);

    if (!session || !session.secret || !session.userId) {
      throw new Error("Session creation failed");
    }
    cookies().set("my-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });
    console.log('User', user);

    if (!user) {
      throw new Error("User information could not be retrieved");
    }

    return parseStringify(user); //proceed only if use is valid
  } catch (error) {
    // if (error.code === 401) {
    //   console.error('Invalid credentials');
    //   throw new Error('Invalid credentials');
    // } else {
    //   console.error('Error in login function:', error.message);
    //   throw error;

    // }

    if (error instanceof Error) {
      console.error('Error in login function:', error.message);
      throw new Error(`Login failed: ${error.message}`);
    } else {
      console.error('Error in login function: unknown error');
      throw new Error('An unexpected error occurred during login');
    }
  }
};
// 6710b73b001163300b05

export const getSession = async () => {
  try {
    const { account } = await createSessionClient();
    const session = await account.get();
    return parseStringify(session);
  } catch (error) {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const { account } = await createSessionClient();
    cookies().delete('my-session');
    await account.deleteSessions();
  } catch (error) {
    return null;
  }
};

export const register = async (userdata: UserInfo) => {
  const { email, password, firstname, lastname, categories } = userdata;
  let newUserAccount;
  try {
    const { account, databases } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstname} ${lastname}`
    );

    if (!newUserAccount) {
      throw new Error("Account not created");
    }

    const userinfo = await databases.createDocument(
      db,
      userCollection,
      ID.unique(),
      { ...userdata, user_id: newUserAccount.$id, categories: categories || [] }
    );

    const session = await account.createEmailPasswordSession(email, password);
    console.log(userinfo);
    cookies().set("my-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(userinfo);
  } catch (error) {
    console.error(error);
  }
};

export const updateUserSession = async () => {
  try {
    const { account } = await createSessionClient();
    const session = await account.updateSession('current');
    return parseStringify(session);
  } catch (error) {
    return null;
  }
};

export const remove = async () => {};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const response = await account.get();
    const user = await getUserInfo({ userId: response.$id });
    return parseStringify(user);
  } catch (error) {
    return null;
  }
};

export const createPost = async (data: Post) => {
  const { post_id } = data;
  const now = dayjs().toISOString(); // current timestamp
  const validPost = generateValidPostId(post_id);

  try {
    const { databases } = await createAdminClient();
    const post = await databases.createDocument(db, postCollection, validPost, {
      ...data,
      post_id: validPost,
      created_at: now,
      updated_at: now
    });
    console.log("Post", post)
    return parseStringify(post);
  } catch (error) {
    console.error(error);
  }
};

export const updatePost = async (postId: string, updatedData: Partial<Post>) => {
  const now = dayjs().toISOString(); // current timestamp
  try {
    const { databases } = await createAdminClient();
    const post = await databases.updateDocument(db, postCollection, postId, {
      ...updatedData,
      updated_at: now
    });
    return parseStringify(post);
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (postId: string) => {
  try {
    const { databases } = await createAdminClient();
    const post = await databases.deleteDocument(db, postCollection, postId);
    return parseStringify(post);
  } catch (error) {
    console.error(error);
  }
};

export const getPosts = async () => {
  try {
    const { databases } = await createAdminClient();
    const posts = await databases.listDocuments(db, postCollection);
    return parseStringify(posts);
  } catch (error) {
    console.error(error);
  }
};

export const getPost = async (postId: string) => {
  try {
    const { databases } = await createAdminClient();
    const post = await databases.getDocument(db, postCollection, postId);
    return parseStringify(post);
  } catch (error) {
    console.error(error);
  }
};

export const createComment = async (data: CommentPost) => {
  const { comment_id } = data;
  const now = dayjs().toISOString(); // current timestamp
  const validComment = generateValidPostId(comment_id);

  try {
    const { databases } = await createAdminClient();
    const postExists = await getPost(data.post_id);
    const comment = await databases.createDocument(db, postCommentCollection, validComment, {
      ...data,
      comment_id: validComment,
      created_at: now,
      updated_at: now
    });
    return parseStringify(comment);
  } catch (error) {
    console.error(error);
  }
}

export const getCommentsByPostId = async (postId: string) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(db, postCommentCollection, [
      Query.equal("post_id", postId)
    ]);
    return parseStringify(response.documents);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};