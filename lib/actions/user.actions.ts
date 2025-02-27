"use server";

import {
  CommentPost,
  Funding,
  GetUserInfo,
  Job,
  LikePost,
  LoginInfo,
  Post,
  PostCourseQuestion,
  PostCourseQuestionAnswer,
  Scholarship,
  UpdateUser,
  UserInfo,
  VerifyUser,
  // VerifyUser,
} from "@/types/schema";
// import crypto from "crypto";
import dayjs from "dayjs";
import { createAdminClient, createSessionClient } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, OAuthProvider, Query } from "node-appwrite";
import {
  generateValidPostId,
  parseStringify,
  generateValidId,
  generateReferralCode,
} from "../utils";
import {
  courseCollection,
  db,
  fundingCollection,
  jobCollection,
  likePostCollection,
  postAttachementBucket,
  postCollection,
  postCommentCollection,
  postCourseAnswerCollection,
  postCourseQuestionCollection,
  scholarshipCollection,
  userCollection,
} from "@/models/name";
import env from "@/env";

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

    // Set a cookie valid for one month (30 days in seconds)
    const oneMonthInSeconds = 30 * 24 * 60 * 60;

    (await cookies()).set("my-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: oneMonthInSeconds,
    });

    // fetch the user information using the session token
    const user = await getUserInfo({ userId: session.userId });
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

    // Delete all Appwrite sessions
    (
      await // Delete all Appwrite sessions
      cookies()
    ).delete("my-session"); // Clear the session token cookie
    await account.deleteSessions();
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out user:", error);
    return null;
  }
};

export const recovery = async (data: UserInfo) => {
  try {
    const { account, databases } = await createAdminClient();
    const userList = await databases.listDocuments(db, userCollection, [
      Query.equal("email", data.email),
    ]);
    console.log("User list:", userList);

    if (!userList || userList.total === 0) {
      throw new Error("User not found");
    }

    const userId = userList.documents[0].$id; // User ID extraction
    console.log("User ID:", userId);

    const resetToken = ID.unique(); // Unique token for reset
    const resetLink = `https://hilarious-tarsier-58aa63.netlify.app/reset-password?userId=${userId}&secret=${resetToken}`;
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
      data.password
    );
    console.log("Password reset response", response);

    return parseStringify(response);
  } catch (error) {
    console.error("Password reset failed:", error);
  }
};

export const registerWithGoogle = async (data: UserInfo) => {
  try {
    const { account, databases } = await createAdminClient();
    const info = await account.createOAuth2Token(
      OAuthProvider.Google,
      "http://localhost:3000/dashboard",
      "http://localhost:3000"
    );
    console.log("Google info", info);
    if (!info) {
      throw new Error("Access token not provided");
    }
    const newUser = await databases.createDocument(
      db,
      userCollection,
      ID.unique(),
      {
        ...data,
        user_id: ID.unique(),
      }
    );
    console.log("New user created", newUser);
    if (!data.user_id || !data.secret) {
      throw new Error("User ID and secret must be provided");
    }
    const session = await account.createSession(data.user_id, data.secret);
    console.log("Session created", session);
  } catch (error) {
    console.error("Error registering with Google:", error);
  }
};

// Function to get referral details for a user
export const getReferralDetails = async (userId: string) => {
  try {
    const { databases } = await createAdminClient();
    const user = await databases.getDocument(db, userCollection, userId);

    if (!user?.referred_users?.length) {
      return {
        referrals: [],
        totalPoints: 0,
        totalEarnings: 0,
      };
    }

    // Fetch full details of all referred users
    const referralPromises = user.referred_users.map(
      async (referredId: string) => {
        try {
          const referredUser = await databases.getDocument(
            db,
            userCollection,
            referredId
          );
          return {
            id: referredId,
            firstname: referredUser.firstname,
            lastname: referredUser.lastname,
            date: referredUser.$createdAt,
            // You can add more fields as needed
          };
        } catch (error) {
          console.error(`Error fetching referred user ${referredId}:`, error);
          return null;
        }
      }
    );

    const referrals = (await Promise.all(referralPromises)).filter(Boolean);

    return {
      referrals,
      totalPoints: user.referral_points || 0,
      totalEarnings: user.earned_referral_fees || 0,
    };
  } catch (error) {
    console.error("Error getting referral details:", error);
    throw error;
  }
};

export const updateReferralPoints = async (
  referrerId: string,
  amount: number,
  newReferredUserId: string
) => {
  try {
    const { databases } = await createAdminClient();
    const user = await databases.getDocument(db, userCollection, referrerId);

    if (!user) {
      throw new Error("Referrer not found");
    }

    // Calculate new points and amount
    const currentPoints = user.referral_points || 0;
    const currentAmount = user.earned_referral_fees || 0;
    const referral_fee = amount * 0.1; // 10% of the payment amount

    // Update referrer with new points and amount
    // Now using newReferredUserId instead of referrerId in the array
    const referrerUpdated = await databases.updateDocument(
      db,
      userCollection,
      referrerId,
      {
        referral_points: currentPoints + 1,
        earned_referral_fees: currentAmount + referral_fee,
        referred_users: user.referred_users
          ? [...user.referred_users, newReferredUserId]
          : [newReferredUserId],
      }
    );

    return parseStringify(referrerUpdated);
  } catch (error) {
    console.error("Error updating referrer points:", error);
    throw error;
  }
};

export const register = async (userdata: Partial<UserInfo>) => {
  const {
    user_id,
    email,
    password,
    firstname,
    lastname,
    categories,
    referral_code,
  } = userdata;
  const userId = generateValidPostId(user_id);
  let createdAccount = null;
  let createdUserInfo = null;

  const { account, databases } = await createAdminClient();
  try {
    // Validate required fields
    if (!email || !password) {
      throw new Error("Email and password must be provided");
    }

    // Step 1: Create the account
    createdAccount = await account.create(
      userId,
      email,
      password,
      `${firstname} ${lastname}`
    );

    if (!createdAccount) {
      throw new Error("Account not created");
    }

    // Generate new referral code for this user
    const newUserReferralCode = generateReferralCode();

    // Step 2: Process referral if code provided
    let referrerInfo = null;
    // Fixed the referral code check
    if (`http:localhost:3000/signUp?referral=${referral_code}`) {
      try {
        // Find referrer by their referral code
        const referrerQuery = await databases.listDocuments(
          db,
          userCollection,
          referral_code ? [Query.equal("referral_code", referral_code)] : []
        );

        if (referrerQuery.documents.length > 0) {
          referrerInfo = referrerQuery.documents[0];
          // Update referrer's points with the new user's ID
          const amount = referrerInfo.earned_referral_fees || 0;
          await updateReferralPoints(referrerInfo.$id, amount, userId);
        }
      } catch (referralError) {
        console.error("Error processing referral:", referralError);
        // Continue registration even if referral processing fails
      }
    }

    // Step 3: Create user document
    createdUserInfo = await databases.createDocument(
      db,
      userCollection,
      userId,
      {
        ...userdata,
        user_id: userId,
        categories: categories || [],
        referral_code: newUserReferralCode,
        referral_points: 0,
        referral_by: referrerInfo ? referral_code : "",
        earned_referral_fees: 0,
        referred_users: [], // New user starts with empty referred_users array
      }
    );

    // Step 4: Create session
    let session;
    try {
      session = await account.createEmailPasswordSession(email, password);
      if (session) {
        (await cookies()).set("my-session", session.secret, {
          path: "/",
          httpOnly: true,
          sameSite: "strict",
          secure: true,
        });
      }
    } catch (sessionError) {
      console.error("Error creating session:", sessionError);
      // Continue as session can be created on login
    }

    return {
      newUserAccount: parseStringify(createdAccount),
      userinfo: parseStringify(createdUserInfo),
    };
  } catch (error) {
    console.error("Error in register function:", error);

    // Cleanup if needed
    if (createdAccount && !createdUserInfo) {
      try {
        await account.deleteSession(userId);
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
    }

    throw new Error(
      error instanceof Error ? error.message : "Failed to register user"
    );
  }
};

export const createVerify = async () => {
  try {
    const { account } = await createSessionClient();
    const response = await account.createVerification(
      "https://hilarious-tarsier-58aa63.netlify.app/verify"
    );
    console.log("Verification created:", response);
    // Check if the response includes the necessary fields
    if (response && response.userId && response.secret) {
      // If the secret is present, create the verification URL
      const verificationURL = `https://hilarious-tarsier-58aa63.netlify.app/verify?userId=${response.userId}&secret=${response.secret}`;

      console.log("Generated verification URL:", verificationURL);
      return verificationURL;
    }
  } catch (error) {
    console.error("Error creating verification:", error);
  }
};

export const updateVerify = async (data: VerifyUser) => {
  const { user_id, secret } = data;
  try {
    const { account } = await createSessionClient();

    if (!user_id || !secret) {
      throw new Error("User ID and secret must be provided");
    }

    const response = await account.updateVerification(user_id, secret);
    return parseStringify(response);
  } catch (error) {
    return;
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

export const getLoggedInUser = async () => {
  try {
    const response = await getSession();
    const user = await getUserInfo({ userId: response.$id });
    return parseStringify(user);
  } catch (error) {
    return null;
  }
};

export const createPost = async (data: Post) => {
  try {
    console.log("Starting post creation with data:", {
      content: data.content?.substring(0, 20),
      hasImage: !!data.image,
      hasVideo: !!data.video,
      user_id: data.user_id
    });
    
    const { post_id, image, video, user_id, content } = data;
    const validPost = generateValidPostId(post_id);
    const allowedExtensions = ["jpg", "jpeg", "png", "mp4"];
    let file: File | null = null;
    let fileType = "";
    let imageId = "";
    let videoId = "";

    // Ensure content exists
    if (!content) {
      throw new Error("Post content is required");
    }

    // Ensure user_id exists
    if (!user_id) {
      throw new Error("User ID is required");
    }

    // Check if we have an image or video
    const hasImage = image && image.startsWith("data:image");
    const hasVideo = video && video.startsWith("data:video");

    // Process media if present
    if (hasImage || hasVideo) {
      const mediaData = hasImage ? image : video;
      const mediaType = hasImage ? "image" : "video";
      
      // Process Base64 validation with improved error handling
      if (!mediaData) {
        throw new Error("Media data is undefined");
      }
      const base64Match = mediaData.match(/^data:(image|video)\/(\w+);base64,/);
      
      if (!base64Match) {
        throw new Error(`Invalid ${mediaType} format`);
      }
      
      try {
        fileType = base64Match[2].toLowerCase();
        
        if (!allowedExtensions.includes(fileType)) {
          throw new Error(`Unsupported file type: ${fileType}`);
        }
        
        const base64Data = mediaData.replace(base64Match[0], "");
        
        if (!base64Data || base64Data.trim() === "") {
          throw new Error(`Empty ${mediaType} data`);
        }
        
        // Convert to binary with error checking
        let binaryData: Buffer;
        try {
          binaryData = Buffer.from(base64Data, "base64");
        } catch (err) {
          throw new Error(`Failed to decode ${mediaType} data: ${err instanceof Error ? err.message : String(err)}`);
        }
        
        if (binaryData.length === 0) {
          throw new Error(`Failed to convert ${mediaType} data`);
        }
        
        // Check file size (max 5MB)
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (binaryData.length > MAX_SIZE) {
          throw new Error(`${mediaType} file too large (${(binaryData.length / (1024 * 1024)).toFixed(2)}MB). Max size is 5MB`);
        }
        
        const fileName = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileType}`;
        const mimeType = `${base64Match[1]}/${fileType}`;
        
        file = new File([binaryData], fileName, { type: mimeType });
        console.log(`Created ${mediaType} file: ${fileName}, size: ${(file.size / 1024).toFixed(2)}KB`);
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`${mediaType} processing error:`, err);
        throw new Error(`Failed to process ${mediaType}: ${errorMessage}`);
      }
    }

    // Initialize Appwrite client
    const { databases, storage } = await createAdminClient();
    console.log("Appwrite client created successfully");

    // Upload file if it exists
    if (file) {
      try {
        console.log(`Uploading ${hasImage ? 'image' : 'video'} to Appwrite...`);
        const fileUpload = await storage.createFile(
          postAttachementBucket,
          ID.unique(),
          file
        );
        console.log("File uploaded successfully:", fileUpload.$id);

        // Set the appropriate ID based on file type
        if (hasImage) {
          imageId = fileUpload.$id;
        } else if (hasVideo) {
          videoId = fileUpload.$id;
        }
      } catch (uploadErr) {
        console.error("File upload error:", uploadErr);
        throw new Error(`Failed to upload file: ${uploadErr instanceof Error ? uploadErr.message : String(uploadErr)}`);
      }
    }

    // Create post document
    try {
      console.log("Creating post document with image/video IDs:", { imageId, videoId });
      const post = await databases.createDocument(db, postCollection, validPost, {
        user_id: data.user_id,
        content: data.content,
        post_id: validPost,
        image: imageId, // Will be empty string if no image
        video: videoId, // Will be empty string if no video
      });

      console.log("Post created successfully:", post.$id);
      return parseStringify(post);
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      throw new Error(`Failed to create post in database: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`);
    }
  } catch (error: unknown) {
    // Main error handler
    console.error("Post creation failed:", error);
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Unknown error during post creation: ${String(error)}`);
    }
  }
};

export const updatePost = async (
  postId: string,
  updatedData: Partial<Post>
) => {
  try {
    const { databases } = await createAdminClient();

    const post = await databases.updateDocument(db, postCollection, postId, {
      ...updatedData,
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
      }
    );

    console.log("Repost created successfully:", repost);
    return parseStringify(repost); // Return the repost object
  } catch (error) {
    console.error("Failed to repost:", error);
    throw error; // Propagate the error for handling
  }
};

export const getPosts = async (page: number = 1, limit: number = 3) => {
  try {
    const { databases } = await createAdminClient();
    const offset = (page - 1) * limit;

    const posts = await databases.listDocuments(db, postCollection, [
      Query.orderDesc("$createdAt"), // Sort by creation date, newest first
      Query.limit(limit),
      Query.offset(offset),
    ]);

    if (!posts?.documents || !Array.isArray(posts.documents)) {
      console.error("Invalid posts response");
      return [];
    }

    const postWithFiles = await Promise.all(
      posts.documents.map(async (post) => {
        const imageUrl = post.image
          ? `${env.appwrite.endpoint}/storage/buckets/${postAttachementBucket}/files/${post.image}/view?project=${env.appwrite.projectId}`
          : null;

        const videoUrl = post.video
          ? `${env.appwrite.endpoint}/storage/buckets/${postAttachementBucket}/files/${post.video}/view?project=${env.appwrite.projectId}`
          : null;

        return {
          ...post,
          image: imageUrl,
          video: videoUrl,
        };
      })
    );
    return parseStringify(postWithFiles);
  } catch (error) {
    console.error("Error in getPosts:", error);
    return [];
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
      }
    );
    console.log("Comment created", comment);
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
      }
    );
    console.log("Like created", like);
    return parseStringify(like);
  } catch (error) {
    console.error(error);
  }
};

export const toggleLike = async (data: LikePost) => {
  const { post_id, user_id } = data;
  const validLike = ID.unique();

  try {
    const { databases } = await createAdminClient();

    // Check if the like already exists
    const existingLike = await databases.listDocuments(db, likePostCollection, [
      Query.equal("post_id", post_id),
      Query.equal("user_id", user_id),
    ]);

    if (existingLike.total > 0) {
      // If like exists, delete it (unlike)
      const likeId = existingLike.documents[0].$id;
      console.log("Deleting like:", likeId);
      await databases.deleteDocument(db, likePostCollection, likeId);
      console.log("Like deleted successfully");
      return { success: true, message: "Like removed" };
    } else {
      // If like does not exist, create it (like)
      const postExists = await getPost(post_id);
      console.log("Post exists", postExists);
      const like = await databases.createDocument(
        db,
        likePostCollection,
        validLike,
        {
          ...data,
          post_id: postExists.post_id,
          like_post_id: validLike,
        }
      );
      console.log("Like created", like);
      return parseStringify(like);
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, message: "Error toggling like" };
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

export const getCourses = async () => {
  try {
    const { databases } = await createAdminClient();
    const courses = await databases.listDocuments(db, courseCollection);
    console.log("Courses", courses);
    return parseStringify(courses);
  } catch (error) {
    console.log("Error fetching courses:", error);
  }
};

export const getCourse = async (courseId: string) => {
  try {
    const { databases } = await createAdminClient();
    const course = await databases.getDocument(db, courseCollection, courseId);
    return parseStringify(course);
  } catch (error) {
    console.error("Error fetching course:", error);
  }
};

export const createJob = async (job: Job) => {
  const { job_id } = job;
  const validJobId = generateValidPostId(job_id);

  console.log("Creating job", job);

  try {
    // Initialize Appwrite clients
    const { databases } = await createAdminClient();
    console.log("Database client initialized");

    // Create a new job document
    const response = await databases.createDocument(
      db, // Database ID
      jobCollection, // Collection ID
      validJobId, // Document ID
      {
        ...job,
        user_id: job.user_id,
        job_id: validJobId,
      }
    );

    console.log("Job created", response);
    return JSON.parse(JSON.stringify(response)); // Ensure no circular references
  } catch (error) {
    console.error("Error creating job", error);
    throw new Error((error as Error).message || "Failed to create job");
  }
};

export const getJobs = async () => {
  try {
    const { databases } = await createAdminClient();
    const jobs = await databases.listDocuments(db, jobCollection);
    return parseStringify(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

export const getJob = async (jobId: string) => {
  try {
    const { databases } = await createAdminClient();
    const job = await databases.getDocument(db, jobCollection, jobId);
    return parseStringify(job);
  } catch (error) {
    console.error("Error fetching job:", error);
  }
};

export const getModules = async () => {
  try {
    const response = await fetch("/api/get-modules");

    if (!response.ok) {
      throw new Error("Failed to fetch modules");
    }

    const result = await response.json();
    console.log("Modules fetched successfully:", result);
    return result;
  } catch (error) {
    console.log("Error fetching modules:", error);
  }
};

export const createPostCourseQuestions = async (
  data: PostCourseQuestion,
  questions: Array<{ text: string; choices: string[] }>
) => {
  try {
    const { databases } = await createAdminClient();

    let questionDocument;

    for (const [index, question] of questions.entries()) {
      const validQuestionId = generateValidPostId(
        `${data.post_course_question_id}-${index}`
      );

      questionDocument = await databases.createDocument(
        db,
        postCourseQuestionCollection,
        validQuestionId,
        {
          ...data,
          question: question.text,
          choices: question.choices,
          user_id: data.user_id,
          post_course_question_id: validQuestionId,
        }
      );
      console.log("Question created", questionDocument);
    }

    return parseStringify(questionDocument);
  } catch (error) {
    console.error("Error creating questions:", error);
  }
};

export const fetchAllPostCourseQuestions = async () => {
  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      db,
      postCourseQuestionCollection
    );

    console.log("Fetched questions:", response.documents);

    // Optionally, parse or format the response if needed
    const data = response.documents.map((doc) => ({
      id: doc.$id,
      question: doc.question,
      choices: doc.choices,
      user_id: doc.user_id,
      post_course_question_id: doc.post_course_question_id,
      createdAt: doc.$createdAt,
    }));

    return parseStringify(data);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

export const fetchPostCourseQuestion = async (questionId: string) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.getDocument(
      db,
      postCourseQuestionCollection,
      questionId
    );
    return parseStringify(response);
  } catch (error) {
    console.error("Error fetching question:", error);
  }
};

export const updatePostCourseQuestion = async (
  questionId: string,
  data: Partial<PostCourseQuestion>
) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.updateDocument(
      db,
      postCourseQuestionCollection,
      questionId,
      data
    );
    return parseStringify(response);
  } catch (error) {
    console.error("Error updating question:", error);
  }
};

export const deletePostCourseQuestion = async (questionId: string) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.deleteDocument(
      db,
      postCourseQuestionCollection,
      questionId
    );
    return parseStringify(response);
  } catch (error) {
    console.error("Error deleting question:", error);
  }
};

export const createPostCourseAnswer = async (
  data: PostCourseQuestionAnswer
) => {
  const { answer_id } = data;
  const validAnswerId = generateValidPostId(answer_id);
  try {
    const { databases } = await createAdminClient();
    const getQuestionId = await databases.listDocuments(
      db,
      postCourseQuestionCollection,
      [Query.equal("post_course_question_id", data.post_course_question_id)]
    );

    console.log("Question ID", getQuestionId.documents[0].$id);

    const questionId = getQuestionId.documents[0].$id;

    const answer = await databases.createDocument(
      db,
      postCourseAnswerCollection,
      validAnswerId,
      {
        ...data,
        answer: data.answer,
        post_course_question_id: questionId,
        answer_id: validAnswerId,
      }
    );

    console.log("Answer created", answer);
    return parseStringify(answer);
  } catch (error) {
    console.error("Error creating answer:", error);
  }
};

export const createFunding = async (data: Funding) => {
  const { funding_id } = data;
  const validFundingId = generateValidPostId(funding_id);

  try {
    const { databases } = await createAdminClient();
    const funding = await databases.createDocument(
      db,
      fundingCollection,
      validFundingId,
      {
        ...data,
        funding_id: validFundingId,
      }
    );
    console.log("Funding created", funding);
    return parseStringify(funding);
  } catch (error) {
    console.error(error);
  }
};

export const getFundings = async () => {
  try {
    const { databases } = await createAdminClient();
    const fundings = await databases.listDocuments(db, fundingCollection);
    return parseStringify(fundings);
  } catch (error) {
    console.error("Error fetching fundings:", error);
  }
};

export const getFunding = async (fundingId: string) => {
  try {
    const { databases } = await createAdminClient();
    const funding = await databases.getDocument(
      db,
      fundingCollection,
      fundingId
    );
    return parseStringify(funding);
  } catch (error) {
    console.error("Error fetching funding:", error);
  }
};

export const updateFunding = async (
  fundingId: string,
  data: Partial<Funding>
) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.updateDocument(
      db,
      fundingCollection,
      fundingId,
      data
    );
    return parseStringify(response);
  } catch (error) {
    console.error("Error updating funding:", error);
  }
};

export const deleteFunding = async (fundingId: string) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.deleteDocument(
      db,
      fundingCollection,
      fundingId
    );
    return parseStringify(response);
  } catch (error) {
    console.error("Error deleting funding:", error);
  }
};

export const createScholarship = async (data: Scholarship) => {
  const { scholarship_id } = data;
  const validScholarshipId = generateValidPostId(scholarship_id);

  try {
    const { databases } = await createAdminClient();
    const scholarship = await databases.createDocument(
      db,
      scholarshipCollection,
      validScholarshipId,
      {
        ...data,
        scholarship_id: validScholarshipId,
      }
    );
    console.log("Scholarship created", scholarship);
    return parseStringify(scholarship);
  } catch (error) {
    console.error(error);
  }
};

export const getScholarships = async () => {
  try {
    const { databases } = await createAdminClient();
    const scholarships = await databases.listDocuments(
      db,
      scholarshipCollection
    );
    return parseStringify(scholarships);
  } catch (error) {
    console.error("Error fetching scholarships:", error);
  }
};

export const getScholarship = async (scholarshipId: string) => {
  try {
    const { databases } = await createAdminClient();
    const scholarship = await databases.getDocument(
      db,
      scholarshipCollection,
      scholarshipId
    );
    return parseStringify(scholarship);
  } catch (error) {
    console.error("Error fetching scholarship:", error);
  }
};

export const updateScholarship = async (
  scholarshipId: string,
  data: Partial<Scholarship>
) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.updateDocument(
      db,
      scholarshipCollection,
      scholarshipId,
      data
    );
    return parseStringify(response);
  } catch (error) {
    console.error("Error updating scholarship:", error);
  }
};

export const deleteScholarship = async (scholarshipId: string) => {
  try {
    const { databases } = await createAdminClient();
    const response = await databases.deleteDocument(
      db,
      scholarshipCollection,
      scholarshipId
    );
    return parseStringify(response);
  } catch (error) {
    console.error("Error deleting scholarship:", error);
  }
};
