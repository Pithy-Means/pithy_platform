"use server";

import { GetUserInfo, LoginInfo, Post, UserInfo } from "@/types/schema";
import dayjs from 'dayjs';
import { createAdminClient, createSessionClient } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { generateValidPostId, parseStringify } from "../utils";
import { db, postCollection, userCollection } from "@/models/name";

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
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);
    console.log('Session', session);
    cookies().set("my-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId });
    console.log('User', user);
    return parseStringify(user);
  } catch (error) {
    console.error(error);
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
  const { post_id, created_at, updated_at } = data;
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