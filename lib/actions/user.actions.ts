"use server";

import { GetUserInfo, LoginInfo, UserInfo } from "@/types/schema";
import { createAdminClient, createSessionClient } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { parseStringify } from "../utils";
import { db, userCollection } from "@/models/name";

export const getUserInfo = async ({ user_id }: GetUserInfo) => {
  try {
    const { databases } = await createAdminClient();
    const user = await databases.listDocuments(db, userCollection, [
      Query.equal("user_id", [user_id]),
    ]);
    parseStringify(user.documents[0]);
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

    const user = await getUserInfo({ user_id: session.userId });
    console.log('User', user);
    return parseStringify(session);
  } catch (error) {
    console.error(error);
  }
};
// 6710b73b001163300b05

export const logout = async () => {};

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

export const update = async () => {};

export const remove = async () => {};

export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const user = await account.get();
    return parseStringify(user);
  } catch (error) {
    return null;
  }
};
