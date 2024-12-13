"use server";

import {
  CommentPost,
  GetUserInfo,
  LikePost,
  LoginInfo,
  Post,
  PostWithUser,
  // ResetPass,
  UpdateUser,
  UserInfo,
} from "@/types/schema";
// import crypto from "crypto";
import dayjs from "dayjs";
import { createAdminClient, createSessionClient } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import { generateValidPostId, parseStringify, generateValidId } from "../utils";
import {
  db,
  likePostCollection,
  postCollection,
  postCommentCollection,
  userCollection,
} from "@/models/name";
import { Permission, Role } from "appwrite";
// import paraValidation from "@/types/paramValidation";

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

// Login function with email and password
export const login = async ({ email, password }: LoginInfo) => {
  try {
    const { account } = (await createAdminClient()) || {};

    if (!account) {
      throw new Error("Account creation failed.");
    }

    // create a new session with the email and password
    const session = await account.createEmailPasswordSession(email, password);
    console.log("Session", session.$id);


    if (!session || !session.secret || !session.userId) {
      throw new Error("Session creation failed");
    }

    // const expirationTime = dayjs().add(1, "day").toDate(); // Set the expiration time for the cookie

    const sessionId = session.$id;
    if (!sessionId) {
      throw new Error("Session ID not found");
    }

    // const validateSessionPattern = /^[a-zA-Z0-9_]{1,36}$/;
    // if (!validateSessionPattern.test(sessionId)) {
    //   throw new Error(
    //     "Invalid session ID format. It must be alphanumeric and at most 36 characters, without leading underscores.",
    //   );
    // }

    // Validate the session token format using a regular expression
    // const validSessionPattern = /^[a-zA-Z0-9_]{1,36}$/;
    // if (!validSessionPattern.test(session.secret)) {
    //   throw new Error("Invalid session token format.");
    // }

    // // store the session token as a cookie for server-side use
    // cookies().set("my-session", session.secret, {
    //   path: "/",
    //   httpOnly: true,
    //   sameSite: "strict",
    //   secure: true,
    // });

    // Store the session token in a secure cookie
    cookies().set("authToken", session.secret, {
      path: "/", // Accessible across the site
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS
      sameSite: "strict", // prevent CSRF attacks (protection)
      maxAge: 60 * 60, // 1 hour in seconds
    });

    // store the session token in localStorage for client-side use (browser-only)
    // if (typeof localStorage !== "undefined"){
    //   localStorage.setItem("authToken", session.secret);
    // }

    // fetch the user information using the session token
    const user = await getUserInfo({ userId: session.userId });
    console.log("User", user);

    if (!user) {
      throw new Error("User information could not be retrieved");
    }
    return {
      success: true,
      data: { user: parseStringify(user), token: session.secret },
    }; // Success response
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("Invalid `password` param")) {
        console.error("Invalid credentials provided");
        return { success: false, message: "Invalid email or password" };
      } else {
        console.error("Error in login function:", error.message);
        return { success: false, message: error.message };
      }
    } else {
      console.error("Unknown error in login function");
      return {
        success: false,
        message: "An unexpected error occurred during login",
      };
    }
  }
};

// Gets the current session details
export const getSession = async () => {
  try {
    // Get the session token from the cookie
    const sessionId = cookies().get("authToken")?.value; // Get the session token from the cookie
    // console.log('Retrieved session ID from cookie:', sessionId);
    if (!sessionId) {
      throw new Error("Session token not found");
    }

    // // Validate the session token format using a regular expression
    // const validSessionIdPattern = /^[a-zA-Z0-9_]{1,36}$/;
    // if (!validSessionIdPattern.test(sessionId)) {
    //   throw new Error("Invalid session ID format. It must be alphanumeric and at most 36 characters, without leading underscores.");
    // }

    // // Ensure session ID does not start with an underscore
    if (sessionId[0] === "_") {
      throw new Error("Session ID cannot start with an underscore.");
    }

    // Create a new Appwrite client
    // if (typeof localStorage === "undefined") {
    //   throw new Error("localStorage is not available in this environment");
    // }

    // // Get the session token from localStorage
    // const token = localStorage.getItem("authToken");
    // if (!token) {
    //   throw new Error("Session token not found");
    // }
    // Create a new Appwrite client
    const { account } = await createSessionClient();

    // Attach the session token to the client
    // account.client.setSession(sessionId); // Set the session token

    // Get the session details using the token
    const session = await account.get();
    console.log("Session details:", session);
    // return parseStringify(session);  // Return the session details
    return session; // Return the session details
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const { account } = await createSessionClient();

    // Delete all Appwrite sessions
    await account.deleteSessions();
    cookies().set("authToken", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "strict",
      maxAge: 0,
    }); // Clear the session token cookie
    // cookies().delete("authToken");
    // await account.deleteSessions();

    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out user:", error);
    return null;
  }
};

export const recovery = async (data: UserInfo) => {
  try {
    const { account, users } = await createAdminClient();
    const userList = await users.list([Query.equal("email", data.email)]);

    if (!userList || userList.total === 0) {
      throw new Error("User not found");
    }

    const userId = userList.users[0].$id; // User ID extraction
    console.log("User ID:", userId);

    const resetToken = ID.unique(); // Unique token for reset
    const resetLink = `http://localhost:3000/reset-password?userId=${userId}&secret=${resetToken}`;
    console.log("Generated reset link:", resetLink);

    const recoveryPass = await account.createRecovery(data.email, resetLink);
    console.log("Recovery email sent:", recoveryPass);

    return parseStringify(recoveryPass);
  } catch (error) {
    console.error("Error on recovery:", error);
  }
};

export const reset = async (data: UpdateUser) => {
  try {
    console.log("Reset data received:", data); // Log data

    const { account } = await createAdminClient();

    if (!data.user_id || !data.secret) {
      throw new Error("User ID and secret must be provided");
    }

    const response = await account.updateRecovery(
      data.user_id,
      data.secret,
      data.password,
    );
    console.log("Password reset response", response);

    return parseStringify(response);
  } catch (error) {
    console.error("Password reset failed:", error);
  }
};

export const register = async (userdata: UserInfo) => {
  const { email, password, firstname, lastname, categories, role } = userdata;
  let newUserAccount;
  try {
    const { account, databases } = await createAdminClient();

    newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstname} ${lastname}`,
    );

    if (!newUserAccount) {
      throw new Error("Account not created");
    }

    const permissions = [
      Permission.read(Role.user(userCollection)),
      Permission.write(Role.user(userCollection)),
      Permission.update(Role.user(userCollection)),
      Permission.delete(Role.team('admin')),

    ];

    // Validate permissions before using
    // paraValidation(permissions);

    const userinfo = await databases.createDocument(
      db,
      userCollection,
      newUserAccount.$id,
      {
        ...userdata,
        user_id: newUserAccount.$id,
        categories: categories || [],
      },
      permissions,
    );

    const session = await account.createEmailPasswordSession(email, password);
    console.log(userinfo);
    cookies().set("authToken", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour in
    });

    // if (role === "admin") {
    //   // await account.updateUserRoles(newUserAccount.$id, ["admin"]);
    //   await databases.updateDocument(
    //     db,
    //     userCollection,
    //     newUserAccount.$id,
    //     { role: "admin" },
    //     [
    //       Permission.read(Role.team('admin')),
    //       Permission.write(Role.team('admin')),
    //       Permission.update(Role.team('admin')),
    //       Permission.delete(Role.team('admin')),
    //     ],
    //   );
    // } else {
    //   await databases.updateDocument(
    //   db,
    //   userCollection,
    //   newUserAccount.$id,
    //   {role: "user"},
    //     [
    //       Permission.read(Role.users()),
    //       Permission.write(Role.users('userCollection.$id')),
    //       Permission.update(Role.users('userCollection.$id')),
    //       Permission.delete(Role.team('admin')),
    //     ],
    //   );
    // }


    // Set role-specific permissions
  
    const rolePermissions = role === "admin"
      ? [
        Permission.read(Role.team("admin")),
        Permission.create(Role.team("admin")),
        Permission.update(Role.team("admin")),
        Permission.delete(Role.team("admin")),
      ]
      : [
        Permission.read(Role.user(newUserAccount.$id)),
        Permission.create(Role.user(newUserAccount.$id)),
        Permission.update(Role.user(newUserAccount.$id)),
        Permission.delete(Role.team("admin")),
      ];

    // Validate permissions before using
    // paraValidation(rolePermissions);

    // Update the user document with the role
    await databases.updateDocument(
      db,
      userCollection,
      newUserAccount.$id,
      { role},
      rolePermissions,
    );

    return parseStringify(userinfo);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user account");
  }
};

export const updateUserSession = async () => {
  try {
    const { account } = await createSessionClient();
    const session = await account.updateSession("current");
    return parseStringify(session);
  } catch (error) {
    return null;
  }
};

export const remove = async () => { };

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

// createPost function with API route
export const createPost = async (data: Post): Promise<PostWithUser | null> => {
  try {
    //send a POST request to the server (/api/posts route)
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        // "Content-Type": "application/json", //set the content type to JSON
        // "Content-Type": "multipart/form-data", //set the content type to multipart/form-data
        // Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data), //serialize the post data
    });

    //if the response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`);
    }

    const post: PostWithUser = await response.json(); //parse the JSON response body, which should contain the created post with user details

    if (!post) {
      throw new Error("Invalid response format. Post creation failed");
    }
    console.log("Post created successfully:", post);
    return post; //return the post object
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error('Failed to create the post via the API'); //re-throw the error for better debugging
  }
};

export const updatePost = async (
  postId: string,
  updatedData: Partial<Post>,
) => {
  const now = dayjs().toISOString(); // current timestamp
  try {
    const { databases } = await createAdminClient();
    const post = await databases.updateDocument(db, postCollection, postId, {
      ...updatedData,
      updated_at: now,
    });
    return parseStringify(post);
  } catch (error) {
    console.error(error);
  }
};

export const deletePost = async (postId: string) => {
  try {
    const { databases } = await createAdminClient();

    // Step 1: Delete related comments
    const comments = await databases.listDocuments(db, postCommentCollection, [
      Query.equal("post_id", postId),
    ]);
    for (const comment of comments.documents) {
      await databases.deleteDocument(db, postCommentCollection, comment.$id);
    }

    // Step 2: Delete related likes
    const likes = await databases.listDocuments(db, likePostCollection, [
      Query.equal("post_id", postId),
    ]);
    for (const like of likes.documents) {
      await databases.deleteDocument(db, likePostCollection, like.$id);
    }

    // Step 3: Delete the post
    const post = await databases.deleteDocument(db, postCollection, postId);

    return parseStringify(post);
  } catch (error) {
    console.error("Error deleting post with comments and likes:", error);
    throw error; // Re-throw the error for better debugging
  }
};

export const repost = async (data: Post) => {
  const { post_id, content, user_comment, user_id } = data; // Removed `repost_of` from input as it's derived
  const now = dayjs().toISOString(); // Current timestamp

  try {
    const { databases } = await createAdminClient();

    // Validate `post_id`
    if (!post_id) {
      throw new Error("post_id is required");
    }

    // Fetch the original post
    const originalPost = await getPost(post_id);
    if (!originalPost) {
      throw new Error("Original post not found");
    }

    // Generate a new unique post ID
    const newPostId = generateValidId();

    // Create a new document for the repost
    const repost = await databases.createDocument(
      db,
      postCollection,
      newPostId, // New unique ID
      {
        content: content || "", // Content for the repost
        user_id, // ID of the user creating the repost
        post_id: newPostId, // New unique ID for the repost
        repost_of: originalPost.post_id, // Link to the original post
        user_comment: user_comment || "", // Optional user comment
        created_at: now,
        updated_at: now,
      },
    );

    console.log("Repost created successfully:", repost);
    return parseStringify(repost); // Return the repost object
  } catch (error) {
    console.error("Failed to repost:", error);
    throw error; // Propagate the error for handling
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
    const comment = await databases.createDocument(
      db,
      postCommentCollection,
      validComment,
      {
        ...data,
        post_id: postExists.post_id,
        comment_id: validComment,
        created_at: now,
        updated_at: now,
      },
    );
    return parseStringify(comment);
  } catch (error) {
    console.error(error);
  }
};

export const getCommentsByPostId = async (postId: string) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(db, postCommentCollection, [
      Query.equal("post_id", postId),
    ]);
    return parseStringify(response.documents);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};

export const likePost = async (data: LikePost) => {
  const { like_post_id } = data;
  const now = dayjs().toISOString(); // current timestamp
  const validLike = generateValidPostId(like_post_id);

  try {
    const { databases } = await createAdminClient();
    const postExists = await getPost(data.post_id);
    console.log("Post exists", postExists);
    const like = await databases.createDocument(
      db,
      likePostCollection,
      validLike,
      {
        ...data,
        post_id: postExists.post_id,
        like_post_id: validLike,
        created_at: now,
        updated_at: now,
      },
    );
    console.log("Like created", like);
    return parseStringify(like);
  } catch (error) {
    console.error(error);
  }
};

export const unlike = async (likeId: string) => {
  let like;
  if (!likeId) {
    console.error("Error: Missing likeId for unlike operation");
    throw new Error("Missing likeId for unlike operation");
  }

  try {
    const { databases } = await createAdminClient();
    // Check if the document exists
    const likeDocument = await databases.getDocument(
      db,
      likePostCollection,
      likeId,
    );

    if (likeDocument) {
      console.log("Deleting like:", likeId);
      like = await databases.deleteDocument(db, likePostCollection, likeId);
      console.log("Like deleted successfully");
    } else {
      console.warn("Like document does not exist.");
    }
    return parseStringify(like);
  } catch (error) {
    console.error("Error deleting like:", error);
  }
};

export const getLikesByPostId = async (postId: string) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.listDocuments(db, likePostCollection, [
      Query.equal("post_id", postId),
    ]);
    return parseStringify(response.documents);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return [];
  }
};

export const toggleLike = async (data: LikePost) => {
  const { like_post_id } = data;
  const now = dayjs().toISOString(); // Current timestamp
  const validLike = generateValidPostId(like_post_id);

  try {
    const { databases } = await createAdminClient();
    const postExists = await getPost(data.post_id);
    console.log("Post exists:", postExists);

    // Check if the like already exists
    const existingLike = await databases.getDocument(
      db,
      likePostCollection,
      validLike,
    );

    if (existingLike) {
      // If like exists, remove it
      console.log("Like exists. Removing...");
      const removedLike = await databases.deleteDocument(
        db,
        likePostCollection,
        validLike,
      );
      return parseStringify(removedLike);
    } else {
      // If like does not exist, add it
      console.log("Like does not exist. Adding...");
      const newLike = await databases.createDocument(
        db,
        likePostCollection,
        validLike,
        {
          ...data,
          post_id: postExists.post_id,
          like_post_id: validLike,
          created_at: now,
          updated_at: now,
        },
      );
      return parseStringify(newLike);
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to toggle like.");
  }
};
