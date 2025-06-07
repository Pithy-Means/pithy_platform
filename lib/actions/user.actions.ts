/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Question,
  Scholarship,
  UpdateUser,
  UserInfo,
  UserResponse,
  VerifyUser,
  // VerifyUser,
} from "@/types/schema";
// import crypto from "crypto";
import { createAdminClient, createSessionClient } from "@/utils/appwrite";
import { cookies } from "next/headers";
import { ID, Query } from "node-appwrite";
import {
  generateValidPostId,
  parseStringify,
  generateValidId,
  generateReferralCode,
  generateAlternativeSpellings,
} from "../utils";
import {
  courseCollection,
  db,
  fundingCollection,
  jobCollection,
  likePostCollection,
  paymentCollection,
  postAttachementBucket,
  postCollection,
  postCommentCollection,
  postCourseAnswerCollection,
  postCourseQuestionCollection,
  preCourseAnswerCollection,
  preCourseQuestionCollection,
  scholarshipCollection,
  userCollection,
} from "@/models/name";
import env from "@/env";
import dayjs from "dayjs";

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
      expires: oneMonthInSeconds,
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

    const resetToken = ID.unique(); // Unique token for reset
    const resetLink = `https://www.pithymeansplus.com/reset-password?userId=${userId}&secret=${resetToken}`;
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

// Function to get referral details for a user
export const getReferralDetails = async (userId: string) => {
  try {
    const { databases } = await createAdminClient();

    // Get the referring user
    const userQuery = await databases.listDocuments(db, userCollection, [
      Query.equal("user_id", userId),
    ]);

    // Check if user exists and has documents
    if (!userQuery?.documents || userQuery.documents.length === 0) {
      console.log("No user found with ID:", userId);
      return {
        referrals: [],
        totalPoints: 0,
        totalEarnings: 0,
      };
    }

    const user = userQuery.documents[0];

    // Check if referred_users exists and has elements
    if (!user.referred_users?.length) {
      console.log("User has no referred users");
      return {
        referrals: [],
        totalPoints: 0,
        totalEarnings: 0,
      };
    };

    // Fetch full details of all referred users
    const referralPromises = user.referred_users.map(
      async (referredId: string) => {
        try {
          const referredUser = await databases.getDocument(
            db,
            userCollection,
            referredId
          );


          // Check if the user has paid - use loose comparison to handle different data types
          // This handles cases where paid might be a string "true" instead of boolean true
          const hasPaid = referredUser.paid == true;

          let individualEarning = 0;

          // First try to use the existing earned_referral_fees from the referring user
          if (hasPaid && user.earned_referral_fees) {
            // If we have multiple paid referrals, divide the earnings
            const paidReferrals = user.referred_users.filter((id: string) => {
              // We don't have the paid status for other users yet, so we'll use the current user's earned_referral_fees
              return id === referredId && hasPaid;
            });

            // If this is the only paid referral, assign all the earnings to this user
            if (paidReferrals.length === 1) {
              individualEarning = user.earned_referral_fees || 0;
            }
          }

          // If we couldn't determine earnings from existing data, try to calculate from payment records
          if (hasPaid && individualEarning === 0) {
            // Get this user's payment record to calculate the 10%
            const paymentRecords = await databases.listDocuments(
              db,
              paymentCollection,
              [
                Query.equal("user_id", referredUser.user_id),
                Query.equal("status", "successful"),
                Query.limit(10000)
              ]
            );

            if (paymentRecords.documents.length > 0) {
              // Get the most recent successful payment
              const payment = paymentRecords.documents[0];

              // Calculate 10% of the payment amount if amount exists
              if (payment.amount) {
                individualEarning = Math.round(payment.amount * 0.1);
              } else {
                // If we can't find the amount in the payment record, use a fallback approach
                // Try to get transaction data if it exists
                if (payment.tx_ref) {
                  try {
                    const response = await fetch(
                      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${payment.tx_ref}`,
                      {
                        headers: {
                          Authorization: `Bearer ${env.payment.secret}`,
                        },
                      }
                    );

                    if (response.ok) {
                      const flutterwaveData = await response.json();
                      if (
                        flutterwaveData.status === "success" &&
                        flutterwaveData.data
                      ) {
                        individualEarning = Math.round(
                          flutterwaveData.data.amount * 0.1
                        );
                      }
                    }
                  } catch (error) {
                    console.error("Error verifying transaction:", error);
                  }
                }

                // If we still don't have an amount, use a default based on the course price
                // This is a fallback solution - ideally, you'd have the actual payment amount
                if (individualEarning === 0 && payment.course_choice) {
                  try {
                    const course = await databases.getDocument(
                      db,
                      courseCollection,
                      payment.course_choice
                    );
                    if (course && course.price) {
                      individualEarning = Math.round(course.price * 0.1);
                    }
                  } catch (error) {
                    console.error("Error getting course:", error);
                  }
                }
              }
            } else {
              // As a last resort, check if there's a course_choice directly on the user
              if (referredUser.course_choice) {
                try {
                  const course = await databases.getDocument(
                    db,
                    courseCollection,
                    referredUser.course_choice
                  );
                  if (course && course.price) {
                    individualEarning = Math.round(course.price * 0.1);
                  }
                } catch (error) {
                  console.error("Error getting course:", error);
                }
              }
            }
          }

          // If all else fails but the user is marked as paid, use the referring user's total earnings
          if (hasPaid && individualEarning === 0 && user.earned_referral_fees) {
            individualEarning = user.earned_referral_fees;
          }

          return {
            id: referredId,
            firstname: referredUser.firstname || "",
            lastname: referredUser.lastname || "",
            date: referredUser.$createdAt,
            isPaid: hasPaid,
            earnings: individualEarning,
          };
        } catch (error) {
          console.error(`Error fetching referred user ${referredId}:`, error);
          return null;
        }
      }
    );

    const referrals = (await Promise.all(referralPromises)).filter(Boolean);

    // // For debugging - log all referrals and their earnings
    // referrals.forEach((ref) => {
    //   console.log(
    //     `Referral: ${ref.firstname} ${ref.lastname}, Paid: ${ref.isPaid}, Earnings: ${ref.earnings}`
    //   );
    // });

    // If we have no individual earnings but the user has a total, distribute it evenly among paid referrals
    const paidReferrals = referrals.filter((ref) => ref.isPaid);
    const hasIndividualEarnings = referrals.some((ref) => ref.earnings > 0);

    if (
      !hasIndividualEarnings &&
      user.earned_referral_fees > 0 &&
      paidReferrals.length > 0
    ) {
      const earningsPerReferral =
        user.earned_referral_fees / paidReferrals.length;
      referrals.forEach((ref) => {
        if (ref.isPaid) {
          ref.earnings = earningsPerReferral;
        }
      });
      console.log(
        `Distributed ${user.earned_referral_fees} evenly among ${paidReferrals.length} paid referrals, each getting ${earningsPerReferral}`
      );
    }

    // Calculate total earnings by summing up individual earnings
    const totalEarnings = referrals.reduce(
      (total, referral) => total + (referral.earnings || 0),
      0
    );

    // If we still have no earnings but the user has earned_referral_fees, use that as the total
    const finalTotalEarnings =
      totalEarnings > 0 ? totalEarnings : user.earned_referral_fees || 0;

    return {
      referrals,
      totalPoints: user.referral_points || 0,
      totalEarnings: finalTotalEarnings,
    };
  } catch (error) {
    console.error("Error getting referral details:", error);
    throw error;
  }
};

export const getWHoUserPaid = async () => {
  const { databases } = await createAdminClient();
  try {
    const fetchedUsers = await databases.listDocuments(db, paymentCollection, [
      Query.orderDesc("$createdAt"),
      Query.limit(1000)
    ]);

    const initiatePayment = fetchedUsers.documents.filter(
      (user) => user.checked === false && user.status !== "successful"
    );
    const successfulPayment = fetchedUsers.documents.filter(
      (user) => user.checked === true && user.status === "successful"
    );

    return {
      initiatePayment: parseStringify(initiatePayment),
      successfulPayment: parseStringify(successfulPayment),
    };
  } catch (error) {
    console.log(
      "Error Occurred During The Fetching Of The User Who Paid:",
      error
    );
    throw new Error("Failed To Fetch The User Who Paid");
  }
};

export const updateReferralPoints = async (
  referrerId: string,
  amount: number,
  newReferredUserId: string
) => {
  try {
    const { databases } = await createAdminClient();

    // Important: Check if we're using user_id or document $id
    // First, try to find the user document by user_id field
    const userQuery = await databases.listDocuments(db, userCollection, [
      Query.equal("user_id", referrerId),
    ]);

    // If not found, try directly with document ID
    let userDoc;
    let userDocId;

    if (userQuery?.documents?.length > 0) {
      userDoc = userQuery.documents[0];
      userDocId = userDoc.$id;
      console.log(
        `Found user by user_id: ${referrerId}, document ID: ${userDocId}`
      );
    } else {
      // Try as document ID directly
      try {
        userDoc = await databases.getDocument(db, userCollection, referrerId);
        userDocId = referrerId; // In this case, referrerId is already the document ID
        console.log(`Found user directly by document ID: ${userDocId}`);
      } catch (docError) {
        console.error("Could not find user by document ID either:", docError);
        throw new Error("Referrer not found by user_id or document ID");
      }
    }

    if (!userDoc) {
      throw new Error("Referrer document not found");
    }

    // Log the current state before update
    console.log(
      "Current referrer state:",
      JSON.stringify({
        referral_points: userDoc.referral_points || 0,
        earned_referral_fees: userDoc.earned_referral_fees || 0,
        referred_users: userDoc.referred_users || [],
      })
    );

    // Calculate new points and amount
    const currentPoints = userDoc.referral_points || 0;
    const currentAmount = userDoc.earned_referral_fees || 0;
    const referral_fee = amount * 0.1; // 10% of the payment amount

    // Ensure referred_users is an array and prevent duplicates
    const currentReferredUsers = Array.isArray(userDoc.referred_users)
      ? userDoc.referred_users
      : [];
    if (!currentReferredUsers.includes(newReferredUserId)) {
      currentReferredUsers.push(newReferredUserId);
    }

    console.log(
      `Updating referrer ${userDocId} with new referred user ${newReferredUserId}`
    );
    console.log(
      `New state will be: points=${currentPoints + 1}, fees=${currentAmount + referral_fee}, users=${currentReferredUsers.length}`
    );

    // Update referrer with new points and amount
    const referrerUpdated = await databases.updateDocument(
      db,
      userCollection,
      userDocId,
      {
        referral_points: currentPoints + 1,
        earned_referral_fees: currentAmount + referral_fee,
        referred_users: currentReferredUsers,
      }
    );

    console.log(
      "Update successful, new state:",
      JSON.stringify({
        referral_points: referrerUpdated.referral_points,
        earned_referral_fees: referrerUpdated.earned_referral_fees,
        referred_users: referrerUpdated.referred_users,
      })
    );

    return parseStringify(referrerUpdated);
  } catch (error) {
    console.error("Error updating referrer points:", error);
    throw new Error("Failed to update referral points");
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

    // Check if email already exists
    try {
      // Try to get a user with the same email
      const existingUsers = await databases.listDocuments(
        db,
        userCollection,
        [Query.equal("email", email)]
      );
      
      if (existingUsers.total > 0) {
        throw new Error("Email already in use");
      }
    } catch (emailCheckError: any) {
      // If this is our custom error, rethrow it
      if (emailCheckError instanceof Error && emailCheckError.message === "Email already in use") {
        throw emailCheckError;
      }
      // Otherwise, this was a database error, log and continue
      console.warn("Error checking for existing email:", emailCheckError);
    }

    // Log the incoming referral code for debugging
    console.log("Original referral code received:", referral_code);

    // Step 1: Create the account
    try {
      createdAccount = await account.create(
        userId,
        email,
        password,
        `${firstname} ${lastname}`
      );
    } catch (accountError: any) {
      // Check for specific Appwrite error indicating duplicate email
      if (accountError instanceof Error && 
         (accountError.message.includes("already exists") || 
          accountError.message.includes("already registered"))) {
        throw new Error("This email is already registered. Please log in instead.");
      }
      // Check for conflict status code (409)
      if (accountError.code === 409) {
        throw new Error("This email is already registered. Please log in instead.");
      }
      // For other errors, rethrow
      throw accountError;
    }

    if (!createdAccount) {
      throw new Error("Account not created");
    }

    // Generate new referral code for this user
    const newUserReferralCode = generateReferralCode();

    // Step 2: Process referral if code provided
    let referrerInfo = null;
    let actualReferralCode = null;

    // IMPROVED: More robust referral code handling
    if (referral_code) {
      console.log("Raw referral code/URL:", referral_code);
      let codeToUse = referral_code;

      // Convert to string if not already
      if (typeof codeToUse !== "string") {
        codeToUse = String(codeToUse);
        console.log("Converted non-string code to string:", codeToUse);
      }

      // Check if it's potentially a URL with referral parameter
      if (
        codeToUse.includes("?") ||
        codeToUse.includes("=") ||
        codeToUse.startsWith("http")
      ) {
        try {
          // First try standard URL parsing
          let urlObj;
          try {
            urlObj = new URL(codeToUse);
            const urlParams = new URLSearchParams(urlObj.search);
            const extracted = urlParams.get("referral");
            if (extracted) {
              actualReferralCode = extracted;
              console.log(
                "Successfully extracted from URL object:",
                actualReferralCode
              );
            }
          } catch (urlError) {
            console.log("Not a valid URL, trying regex extraction");
            throw new Error("Not a valid URL");
          }

          // If URL parsing failed or didn't get a code, try regex
          if (!actualReferralCode) {
            const match = codeToUse.match(/[?&]referral=([^&]+)/);
            if (match && match[1]) {
              actualReferralCode = match[1];
              console.log("Extracted from regex pattern:", actualReferralCode);
            }
          }
        } catch (e) {
          console.error("Error extracting referral code:", e);
          throw new Error("Invalid referral code format");
        }
      }

      // If we couldn't extract from URL/pattern or it wasn't a URL, use as-is
      if (!actualReferralCode) {
        actualReferralCode = codeToUse.trim();
        console.log("Using direct referral code:", actualReferralCode);
      }
    }

    // DEBUGGING: Log the final referral code
    console.log("Final referral code to use:", actualReferralCode);

    // Process referral if we have what looks like a valid code
    if (actualReferralCode && actualReferralCode.trim() !== "") {
      try {
        // Normalize the code - trim and ensure it's a clean string
        const normalizedCode = actualReferralCode.trim();
        console.log(
          "Looking up referrer with normalized code:",
          normalizedCode
        );

        // Find referrer by their referral code - EXACT match
        const referrerQuery = await databases.listDocuments(
          db,
          userCollection,
          [Query.equal("referral_code", normalizedCode)]
        );

        console.log(`Referrer query results: ${referrerQuery.total} documents`);

        if (
          referrerQuery.total > 0 &&
          referrerQuery.documents &&
          referrerQuery.documents.length > 0
        ) {
          referrerInfo = referrerQuery.documents[0];
          console.log(
            `Found referrer: ${referrerInfo.$id} (${referrerInfo.firstname || "Unknown"} ${referrerInfo.lastname || "User"})`
          );

          // Get the document ID for updating
          const referrerDocId = referrerInfo.$id;

          // Manual referral update without calling updateReferralPoints function
          try {
            console.log("Updated referral points for referrer:", referrerDocId);

            // Safely handle referred_users array
            let currentReferredUsers: string[] = [];
            if (Array.isArray(referrerInfo.referred_users)) {
              currentReferredUsers = [...referrerInfo.referred_users];
            } else {
              console.warn(
                "referred_users is not an array, initializing as empty array"
              );
            }

            // Add the new user if not already included
            if (!currentReferredUsers.includes(userId)) {
              currentReferredUsers.push(userId);
            } else {
              console.log(`User ${userId} is already in referred_users`);
            }

            // Safely update the referrer document with new points and referred users
            try {
              await databases.updateDocument(
                db,
                userCollection,
                referrerDocId,
                {
                  referral_points: (referrerInfo.referral_points || 0) + 1,
                  referred_users: currentReferredUsers,
                }
              );
              console.log(
                `Referrer document updated successfully for ${referrerDocId}`
              );
            } catch (updateError) {
              console.error("Error updating referrer document:", updateError);
              throw new Error("Failed to update referrer document");
            }
            console.log("Updated referred users array:", currentReferredUsers);
            console.log("Updated referral points for referrer:", referrerDocId);
          } catch (directUpdateError) {
            console.error("Failed direct referral update:", directUpdateError);
            throw new Error("Direct referral update failed");
          }
        } else {
          console.log(`No referrer found for code: "${normalizedCode}"`);
        }
      } catch (referralError) {
        console.error("Error processing referral:", referralError);
        throw new Error("Referral processing failed");
      }
    } else {
      console.log("No valid referral code provided after processing");
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
        referral_by: actualReferralCode || "",
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
      throw new Error("Session creation failed");
    }

    return {
      success: true,
      newUserAccount: parseStringify(createdAccount),
      userinfo: parseStringify(createdUserInfo),
      referralProcessed: !!referrerInfo,
    };
  } catch (error: any) {
    console.error("Error in register function:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Account not created"
    };
  }
};

export const updateUserProfile = async (
  userId: string,
  updatedData: Partial<UserInfo>
) => {
  const { databases } = await createAdminClient();

  try {
    //  Check if the user exists
    const user = await databases.listDocuments(db, userCollection, [
      Query.equal("user_id", userId),
    ]);
    console.log("User found:", user);
    if (!user || user.documents.length === 0) {
      throw new Error("User not found");
    }

    // Create a clean copy without $databaseId
    const cleanData = { ...updatedData };
    if ("$databaseId" in cleanData) {
      delete cleanData.$databaseId;
    }
    if ("$collectionId" in cleanData) {
      delete cleanData.$collectionId;
    }
    if ("$id" in cleanData) {
      delete cleanData.$id;
    }

    // Update the document with the new data
    const updatedProfile = await databases.updateDocument(
      db,
      userCollection,
      user.documents[0].$id,
      cleanData
    );

    console.log(`User profile updated for userId: ${updatedProfile.$id}`);
    return parseStringify(updatedProfile);
  } catch (error) {
    console.log("Error updating user profile:", error);

    throw new Error(
      error instanceof Error ? error.message : "Failed to update user profile"
    );
  }
};

export const getAllUsers = async (
  limit = 25,
  offset = 0,
  filters: any[] = []
) => {
  try {
    const { databases } = await createAdminClient();

    // Query documents with pagination and optional filters
    const response = await databases.listDocuments(db, userCollection, [
      ...filters,
      Query.limit(limit),
      Query.offset(offset),
      Query.orderDesc("$createdAt")
    ]);

    return {
      users: parseStringify(response.documents),
      total: response.total,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch users"
    );
  }
};

export const searchUsers = async ({
  searchTerm,
  filters = {},
  limit = 25,
  offset = 0,
  sortField = "firstname",
  // sortOrder = "asc"
}: {
  searchTerm?: string;
  filters?: {
    categories?: string[];
    referral_by?: string;
    user_id?: string;
    email?: string;
  };
  limit?: number;
  offset?: number;
  sortField?: keyof UserInfo;
  sortOrder?: "asc" | "desc";
}) => {
  const { databases } = await createAdminClient();

  try {
    // Build query conditions
    const queryConditions = [];

    // Search term can match against firstname, lastname, email, or user_id
    if (searchTerm) {
      queryConditions.push(
        Query.or([
          Query.search("firstname", searchTerm),
          Query.search("lastname", searchTerm),
          Query.search("email", searchTerm),
          Query.search("user_id", searchTerm),
        ])
      );
    }

    // Add filters
    if (filters.categories && filters.categories.length > 0) {
      // Search for users with any of the specified categories
      queryConditions.push(Query.contains("categories", filters.categories));
    }

    if (filters.referral_by) {
      queryConditions.push(Query.equal("referral_by", filters.referral_by));
    }

    if (filters.user_id) {
      queryConditions.push(Query.equal("user_id", filters.user_id));
    }

    if (filters.email) {
      queryConditions.push(Query.equal("email", filters.email));
    }

    // Execute the search query
    const result = await databases.listDocuments(db, userCollection, [
      Query.limit(limit),
      Query.offset(offset),
      Query.orderAsc(sortField as string),
    ]);

    return {
      users: parseStringify(result.documents),
      total: result.total,
    };
  } catch (error) {
    console.error("Error searching users:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to search users"
    );
  }
};

// Add this function to your API file or import it if already exists
export const deleteUser = async (userId: string) => {
  try {
    const { databases } = await createAdminClient();
    await databases.deleteDocument(db, userCollection, userId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete user"
    );
  }
};

export const createVerify = async () => {
  try {
    const { account } = await createSessionClient();
    const response = await account.createVerification(
      "https://www.pithymeansplus.com/verify"
    );
    console.log("Verification created:", response);
    // Check if the response includes the necessary fields
    if (response && response.userId && response.secret) {
      // If the secret is present, create the verification URL
      const verificationURL = `https://www.pithymeansplus.com/verify?userId=${response.userId}&secret=${response.secret}`;

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
      user_id: data.user_id,
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
          throw new Error(
            `Failed to decode ${mediaType} data: ${err instanceof Error ? err.message : String(err)}`
          );
        }

        if (binaryData.length === 0) {
          throw new Error(`Failed to convert ${mediaType} data`);
        }

        // Check file size (max 50MB)
        const MAX_SIZE = 50 * 1024 * 1024; // 50MB
        if (binaryData.length > MAX_SIZE) {
          throw new Error(
            `${mediaType} file too large (${(binaryData.length / (1024 * 1024)).toFixed(2)}MB). Max size is 50MB`
          );
        }

        const fileName = `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileType}`;
        const mimeType = `${base64Match[1]}/${fileType}`;

        file = new File([binaryData], fileName, { type: mimeType });
        console.log(
          `Created ${mediaType} file: ${fileName}, size: ${(file.size / 1024).toFixed(2)}KB`
        );
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
        console.log(`Uploading ${hasImage ? "image" : "video"} to Appwrite...`);
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
        throw new Error(
          `Failed to upload file: ${uploadErr instanceof Error ? uploadErr.message : String(uploadErr)}`
        );
      }
    }

    // Create post document
    try {
      console.log("Creating post document with image/video IDs:", {
        imageId,
        videoId,
      });
      const post = await databases.createDocument(
        db,
        postCollection,
        validPost,
        {
          user_id: data.user_id,
          content: data.content,
          post_id: validPost,
          image: imageId, // Will be empty string if no image
          video: videoId, // Will be empty string if no video
        }
      );

      console.log("Post created successfully:", post.$id);
      return parseStringify(post);
    } catch (dbErr) {
      console.error("Database error:", dbErr);
      throw new Error(
        `Failed to create post in database: ${dbErr instanceof Error ? dbErr.message : String(dbErr)}`
      );
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

    const post = await databases.updateDocument(
      db,
      postCollection,
      postId,
      updatedData
    );
    return parseStringify(post);
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
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

export const searchPostsByContent = async (
  searchTerm: string,
  page: number = 1,
  limit: number = 3
) => {
  try {
    const { databases } = await createAdminClient();
    const offset = (page - 1) * limit;

    const posts = await databases.listDocuments(db, postCollection, [
      Query.search("content", searchTerm),
      Query.orderDesc("$createdAt"),
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
    console.error("Error in searchPostsByContent:", error);
    return [];
  }
};

export const searchPosts = async (
  options: {
    searchTerm?: string;
    author?: string;
    dateRange?: { start?: Date; end?: Date };
    page?: number;
    limit?: number;
    sortBy?: "recent" | "popular" | "relevant";
  } = {}
) => {
  try {
    const { databases } = await createAdminClient();
    const {
      searchTerm = "",
      author = "",
      dateRange = {},
      page = 1,
      limit = 10,
      sortBy = "recent",
    } = options;
    const offset = (page - 1) * limit;
    
    // Generate all possible search query combinations
    const allSearchQueries = [];
    let hasSearchTerm = false;
    
    // First, if we have an author search term, search for matching users
    let userIds: string[] = [];
    if (author) {
      userIds = await findUsersByName(author);
      
      // If no matching users and there's an author filter, return empty results early
      if (userIds.length === 0) {
        return {
          posts: [],
          totalPosts: 0,
          currentPage: page,
          totalPages: 0,
        };
      }
    }
    
    // Content search with fuzzy matching
    if (searchTerm) {
      hasSearchTerm = true;
      const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);
      
      // For single word searches, apply fuzzy matching
      if (searchTerms.length === 1 && searchTerms[0].length >= 3) {
        const alternatives = generateAlternativeSpellings(searchTerms[0]);
        
        // Create a query for each alternative spelling
        for (const alt of alternatives) {
          const queries = [];
          queries.push(Query.search("content", alt));
          
          // Add author filter if provided
          if (author && userIds.length > 0) {
            queries.push(Query.equal("user_id", userIds));
          }
          
          // Date range filtering
          if (dateRange.start) {
            queries.push(Query.greaterThanEqual("$createdAt", dateRange.start.toISOString()));
          }
          if (dateRange.end) {
            queries.push(Query.lessThanEqual("$createdAt", dateRange.end.toISOString()));
          }
          
          allSearchQueries.push(queries);
        }
      } else {
        // For multi-word searches, use the original search term
        const queries = [];
        queries.push(Query.search("content", searchTerm));
        
        // Add author filter if provided
        if (author && userIds.length > 0) {
          queries.push(Query.equal("user_id", userIds));
        }
        
        // Date range filtering
        if (dateRange.start) {
          queries.push(Query.greaterThanEqual("$createdAt", dateRange.start.toISOString()));
        }
        if (dateRange.end) {
          queries.push(Query.lessThanEqual("$createdAt", dateRange.end.toISOString()));
        }
        
        allSearchQueries.push(queries);
      }
    } else {
      // No search term provided, just use regular filters
      const queries = [];
      
      // Filter by author if provided
      if (author && userIds.length > 0) {
        queries.push(Query.equal("user_id", userIds));
      }
      
      // Date range filtering
      if (dateRange.start) {
        queries.push(Query.greaterThanEqual("$createdAt", dateRange.start.toISOString()));
      }
      if (dateRange.end) {
        queries.push(Query.lessThanEqual("$createdAt", dateRange.end.toISOString()));
      }
      
      allSearchQueries.push(queries);
    }
    
    // Execute all search queries and merge results
    let allResults = [];
    const seenDocumentIds = new Set();
    
    for (const queries of allSearchQueries) {
      // Add sorting
      const sortQueries = [...queries];
      
      switch (sortBy) {
        case "recent":
          sortQueries.push(Query.orderDesc("$createdAt"));
          break;
        case "popular":
          sortQueries.push(Query.orderDesc("likesCount"));
          break;
        case "relevant":
          // If searching by term, relevance is applied by default
          if (!hasSearchTerm) {
            sortQueries.push(Query.orderDesc("$createdAt"));
          }
          break;
      }
      
      // Add pagination
      sortQueries.push(Query.limit(limit));
      sortQueries.push(Query.offset(offset));
      
      const result = await databases.listDocuments(db, postCollection, sortQueries);
      
      if (result?.documents && Array.isArray(result.documents)) {
        // Add unique documents to our results
        for (const doc of result.documents) {
          if (!seenDocumentIds.has(doc.$id)) {
            seenDocumentIds.add(doc.$id);
            allResults.push(doc);
          }
        }
      }
    }
    
    // Sort merged results according to sortBy parameter
    // This is necessary because we've potentially merged results from multiple queries
    if (allResults.length > 0) {
      switch (sortBy) {
        case "recent":
          allResults.sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime());
          break;
        case "popular":
          allResults.sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));
          break;
        // For "relevant", we keep the order provided by the search engine
      }
    }
    
    // Limit to the requested number of results
    allResults = allResults.slice(0, limit);
    
    // Get total posts count for pagination
    // We'll need to count unique results from all queries
    let totalPosts = 0;
    
    // If there's a search term, we need to calculate the total differently
    if (hasSearchTerm) {
      // Get a count of all documents matching our search term variations
      const seenIds = new Set();
      
      for (const queries of allSearchQueries) {
        const countQueries = queries.filter(
          (q) => !q.toString().includes("limit") && 
                !q.toString().includes("offset") && 
                !q.toString().includes("orderBy")
        );
        
        const result = await databases.listDocuments(db, postCollection, countQueries);
        
        if (result?.documents) {
          for (const doc of result.documents) {
            seenIds.add(doc.$id);
          }
        }
      }
      
      totalPosts = seenIds.size;
    } else {
      // No search term, just use the standard count
      const countQueries = allSearchQueries[0].filter(
        (q) => !q.toString().includes("limit") && 
              !q.toString().includes("offset") && 
              !q.toString().includes("orderBy")
      );
      
      const result = await databases.listDocuments(db, postCollection, countQueries);
      totalPosts = result?.total || 0;
    }
    
    const totalPages = Math.ceil(totalPosts / limit);
    
    // Process posts to include file URLs
    const postsWithFiles = await Promise.all(
      allResults.map(async (post) => {
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
    
    return {
      posts: parseStringify(postsWithFiles),
      totalPosts: totalPosts,
      currentPage: page,
      totalPages,
    };
  } catch (error) {
    console.error("Error in searchPosts:", error);
    return {
      posts: [],
      totalPosts: 0,
      currentPage: 1,
      totalPages: 0,
    };
  }
};

/**
 * Searches for users by their first name or last name
 * Also applies fuzzy search to handle typos in name searches
 * 
 * @param nameQuery The name to search for (first or last)
 * @returns Array of matching user IDs
 */
async function findUsersByName(nameQuery: string): Promise<string[]> {
  try {
    const { databases } = await createAdminClient();
    
    // Skip empty queries
    if (!nameQuery || nameQuery.trim() === "") {
      return [];
    }
    
    // Generate name variations for fuzzy matching if name is long enough
    const nameVariations = nameQuery.length >= 3 
      ? generateAlternativeSpellings(nameQuery)
      : [nameQuery];
    
    const userIds = new Set<string>();
    
    // For each name variation, search in both firstName and lastName fields
    for (const nameVariant of nameVariations) {
      // Search by firstName
      const firstNameResults = await databases.listDocuments(
        db,
        userCollection,
        [Query.search("firstname", nameVariant)]
      );
      
      if (firstNameResults?.documents) {
        firstNameResults.documents.forEach(user => userIds.add(user.$id));
      }
      
      // Search by lastName
      const lastNameResults = await databases.listDocuments(
        db,
        userCollection,
        [Query.search("lastname", nameVariant)]
      );
      
      if (lastNameResults?.documents) {
        lastNameResults.documents.forEach(user => userIds.add(user.$id));
      }
    }
    
    return Array.from(userIds);
  } catch (error) {
    console.error("Error finding users by name:", error);
    return [];
  }
}

export const searchPostsByUser = async (
  firstname?: string,
  lastname?: string,
  page: number = 1,
  limit: number = 3
) => {
  try {
    const { databases } = await createAdminClient();
    const offset = (page - 1) * limit;

    // Create an array of queries based on provided search parameters
    const searchQueries = [
      ...(firstname ? [Query.search("firstname", firstname)] : []),
      ...(lastname ? [Query.search("lastname", lastname)] : []),
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
      Query.offset(offset),
    ];

    // Only perform the search if at least one search parameter is provided
    if (searchQueries.length <= 3) {
      console.error("No search parameters provided");
      return [];
    }

    const posts = await databases.listDocuments(
      db,
      postCollection,
      searchQueries
    );

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
    console.error("Error in searchPostsByUser:", error);
    return [];
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

const deleteJobAfterDeadlineOfApplication = async () => {
  try {
    const now = new Date();
    const { databases } = await createAdminClient();
    const jobs = await databases.listDocuments(db, jobCollection, [Query.limit(1000)]);

    // Filter jobs that have passed their deadline
    const expiredJobs = jobs.documents.filter((job) => {
      const deadlineDate = new Date(job.closing_date);
      return deadlineDate <= now;
    });

    // Delete all expired jobs
    for (const job of expiredJobs) {
      await databases.deleteDocument(db, jobCollection, job.$id);
    }
  } catch (error) {
    console.error("Error deleting expired jobs:", error);
    throw new Error(
      (error as Error).message || "Failed to delete expired jobs"
    );
  }
};

export const getJobs = async () => {
  try {
    const { databases } = await createAdminClient();
    const jobs = await databases.listDocuments(db, jobCollection, [
      Query.limit(1000),
      Query.orderDesc("$createdAt"),
    ]);
    await deleteJobAfterDeadlineOfApplication();
    return parseStringify(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

export const searchJobs = async (
  country?: string,
  location?: string,
  title?: string
): Promise<Job[]> => {
  try {
    const { databases } = await createAdminClient();
    const queries: string[] = [];

    if (country) {
      queries.push(Query.search("country_of_work", country));
    }
    if (location) {
      queries.push(Query.search("location_of_work", location));
    }
    if (title) {
      queries.push(Query.search("job_title", title));
    }

    console.log("Searching jobs with queries:", queries);
    // If no search criteria, apply a default limit
    const results = await databases.listDocuments(
      db,
      jobCollection,
      queries.length > 0 ? queries : [Query.limit(1000)] // Apply limit if no search criteria
    );

    return parseStringify(results.documents);
  } catch (error) {
    console.error("Error searching jobs:", error);
    return []; // Return an empty array in case of an error
  }
};

export const updateJob = async (jobId: string, data: Partial<Job>) => {
  try {
    const { databases } = await createAdminClient();
    const job = await databases.updateDocument(db, jobCollection, jobId, data);
    return parseStringify(job);
  } catch (error) {
    console.error("Error updating job:", error);
    return { success: false, message: "Error updating job" };
  }
};

export const deleteJob = async (jobId: string) => {
  try {
    const { databases } = await createAdminClient();
    const job = await databases.deleteDocument(db, jobCollection, jobId);
    return parseStringify(job);
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false, message: "Error deleting job" };
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

export const fetchAllPostCourseQuestions = async () => {
  try {
    const { databases } = await createAdminClient();

    const response = await databases.listDocuments(
      db,
      postCourseQuestionCollection
    );
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

const deleteFundingAfterDeadlineOfApplication = async () => {
  try {
    const now = new Date();
    const { databases } = await createAdminClient();
    const fundings = await databases.listDocuments(db, fundingCollection, [Query.limit(1000)]);

    // Filter fundings that have passed their deadline
    const expiredFundings = fundings.documents.filter((funding) => {
      const deadlineDate = new Date(funding.closing_date);
      return deadlineDate <= now;
    });

    // Delete all expired fundings
    for (const funding of expiredFundings) {
      await databases.deleteDocument(db, fundingCollection, funding.$id);
    }
  } catch (error) {
    console.error("Error deleting expired fundings:", error);
    throw new Error(
      (error as Error).message || "Failed to delete expired fundings"
    );
  }
};

export const getFundings = async () => {
  try {
    const { databases } = await createAdminClient();
    const fundings = await databases.listDocuments(db, fundingCollection, [
      Query.limit(1000),
      Query.orderDesc("$createdAt"),
    ]);
    await deleteFundingAfterDeadlineOfApplication();
    return parseStringify(fundings);
  } catch (error) {
    console.error("Error fetching fundings:", error);
  }
};

/**
 * Searches for fundings by title.
 * Requires the 'title' attribute to be indexed in the Appwrite collection for efficient searching.
 * @param searchTitle The title (or part of it) to search for.
 * @param limit Max number of results to return. Defaults to 25.
 * @returns A promise that resolves to the Appwrite document list structure containing matching fundings, or undefined if an error occurs.
 */
export const searchFundingByTitle = async (
  searchTitle: string,
  searchArea: string,
  limit: number = 100
): Promise<{ total: number; documents: Funding[] } | undefined> => {
  // Basic validation
  if (!searchTitle || typeof searchTitle !== 'string' || searchTitle.trim() === '') {
    console.log("Search title is empty or invalid.");
    return { total: 0, documents: [] }; // Return empty result for empty search
  }

  if (!searchArea || typeof searchArea !== 'string' || searchArea.trim() === '') {
    console.log("Search title is empty or invalid.");
    return { total: 0, documents: [] }; // Return empty result for empty search
  }

  try {
    const { databases } = await createAdminClient();
    console.log(`Searching for fundings with title containing: "${searchTitle}"`);

    // Use Query.search() for partial/full-text search (requires index)
    // Alternatively, use Query.equal('title', searchTitle) for exact matches
    const searchResults = await databases.listDocuments(
      db,
      fundingCollection,
      [
        Query.search('title', searchTitle.trim()), // Use search for flexibility
        Query.search('focus_earlier', searchArea.trim()),
        Query.limit(limit), // Apply limit to search results
        Query.orderDesc("$createdAt") // Optional: Order search results
      ]
    );

    console.log(`Found ${searchResults.total} fundings matching the title.`);
    // Assuming parseStringify is meant to deep clone or handle specific Appwrite object structures
    return parseStringify(searchResults);

  } catch (error) {
    // Return undefined or throw error based on desired error handling strategy
    return undefined;
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

const deleteScholarshipAfterDeadlineOfApplication = async () => {
  try {
    const now = new Date();
    const { databases } = await createAdminClient();
    const scholarships = await databases.listDocuments(
      db,
      scholarshipCollection,
      [Query.limit(1000)]
    );

    // Filter scholarships that have passed their deadline
    const expiredScholarships = scholarships.documents.filter((scholarship) => {
      const deadlineDate = new Date(scholarship.deadline);
      return deadlineDate <= now;
    });

    // Delete all expired scholarships
    for (const scholarship of expiredScholarships) {
      await databases.deleteDocument(
        db,
        scholarshipCollection,
        scholarship.$id
      );
    }
    console.log("Expired scholarships deleted successfully.");
  } catch (error) {
    console.error("Error deleting expired scholarships:", error);
  }
};

/**
 * Searches scholarships based on specified criteria
 * 
 * @param params - Search parameters
 * @param params.title - Optional title to search for
 * @param params.provider - Optional provider to search for
 * @param params.study_level - Optional study level to filter by
 * @param params.discipline - Optional discipline/field to filter by
 * @param params.country_of_study - Optional country to filter by
 * @returns Promise containing filtered scholarships
 */
export const searchScholarships = async ({
  title,
  provider,
  study_level,
  discipline,
  country_of_study
}: {
  title?: string;
  provider?: string;
  study_level?: string;
  discipline?: string;
  country_of_study?: string;
}) => {
  try {
    // Get all scholarships
    const result = await getScholarships();
    
    if (!result || !result.documents) {
      console.error("No scholarships found or invalid response format");
      return { documents: [] };
    }
    
    // Filter scholarships based on provided criteria
    const filteredScholarships = result.documents.filter((scholarship: Scholarship) => {
      // Check if scholarship matches all non-empty criteria
      // Using case-insensitive matching for text fields
      
      // Title filter
      if (title && scholarship.title && 
          !scholarship.title.toLowerCase().includes(title.toLowerCase())) {
        return false;
      }
      
      // Provider filter
      if (provider && scholarship.provider &&
          !scholarship.provider.toLowerCase().includes(provider.toLowerCase())) {
        return false;
      }
      
      // Study level filter - exact match
      if (study_level && scholarship.study_level !== study_level) {
        return false;
      }
      
      // Discipline filter
      if (discipline && scholarship.discipline &&
          !scholarship.discipline.toLowerCase().includes(discipline.toLowerCase())) {
        return false;
      }
      
      // Country of study filter - exact match
      if (country_of_study && scholarship.country_of_study !== country_of_study) {
        return false;
      }
      
      // All provided criteria matched or were not specified
      return true;
    });
    
    console.log(`Found ${filteredScholarships.length} matching scholarships`);
    
    return {
      ...result,
      documents: filteredScholarships
    };
  } catch (error) {
    console.error("Error searching scholarships:", error);
    throw error;
  }
};


export const getScholarships = async () => {
  try {
    const { databases } = await createAdminClient();
    const scholarships = await databases.listDocuments(
      db,
      scholarshipCollection,
      [Query.limit(1000), Query.orderDesc("$createdAt")]
    );
    await deleteScholarshipAfterDeadlineOfApplication();
    console.log("Scholarships fetched successfully");
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
    throw new Error("Failed to Delete The Scholarship");
  }
};

export const createQuestion = async (
  question: Question
): Promise<Question> => {
  const { databases } = await createAdminClient();
  const questionId = ID.unique();
  console.log('Creating question ...');
  try {

    const questionToStore = {
      ...question,
      pre_course_question_id: questionId,
      options: question.options.map((option) => {
        option.answer_id = generateValidPostId(option.answer_id);
        return JSON.stringify(option);
            }),
    }
    const response = await databases.createDocument(
      db,
      preCourseQuestionCollection,
      questionId,
      questionToStore
    );

    const parsedResponse = {
      ...response,
      options: response.options.map((option: string) => JSON.parse(option)),
    };

    console.log("Question created", parsedResponse);

    return parseStringify(parsedResponse);
  } catch (error) {
    console.error("Error creating question:", error);
    throw new Error("Failed to create the question");
  }
};

export const fetchQuestions = async (): Promise<Question[]> => {
  const { databases } = await createAdminClient();
  try {
    const questions = await databases.listDocuments(
      db,
      preCourseQuestionCollection,
      [Query.limit(1000), Query.orderDesc("$createdAt")]
    );
    return parseStringify(questions.documents);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }
};

export const updateQuestion = async (
  questionId: string,
  data: Partial<Question>
): Promise<Question> => {
  const { databases } = await createAdminClient();
  try {
    // Only include fields that are allowed to be updated
    // and stringify the options properly
    const dataToStore: any = {};
    
    if (data.text !== undefined) dataToStore.text = data.text;
    if (data.category !== undefined) dataToStore.category = data.category;
    
    if (data.options) {
      dataToStore.options = data.options.map(option => 
        typeof option === 'string' ? option : JSON.stringify(option)
      );
    }
    
    const response = await databases.updateDocument(
      db,
      preCourseQuestionCollection,
      questionId,
      dataToStore
    );
    
    return parseStringify(response);
  } catch (error) {
    console.error("Error updating question:", error);
    throw new Error("Failed to update the question");
  }
}

export const deleteQuestion = async (questionId: string): Promise<void> => {
  const { databases } = await createAdminClient();
  try {
    await databases.deleteDocument(
      db,
      preCourseQuestionCollection,
      questionId
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    throw new Error("Failed to delete the question");
  }
};

export const saveResult = async (
  userId: string,
  temperamentType: string,
  responses: UserResponse[]
): Promise<void> => {
  const { databases } = await createAdminClient();
  const responseToStore = responses.map((response) => (JSON.stringify(response)));
  console.log("Saving result ...");
  const preCourseAnswerId = ID.unique();

  try {
    const result = await databases.createDocument(
      db,
      preCourseAnswerCollection,
      preCourseAnswerId,
      {
        pre_course_answer_id: preCourseAnswerId,
        user_id: userId,
        temperamentType,
        responses: responseToStore
      }
    );
    console.log("Result saved successfully:", result);
    return parseStringify(result);
  } catch (error) {
    console.error("Error saving result:", error);
    throw new Error("Failed to save the result");
  }
};

export const fetchUserResult = async (
  userId: string
): Promise<UserResponse[]> => {
  const { databases } = await createAdminClient();
  try {
    const result = await databases.listDocuments(
      db,
      preCourseAnswerCollection,
      [Query.equal("user_id", userId)]
    );
    return parseStringify(result.documents);
  } catch (error) {
    console.error("Error fetching user result:", error);
    throw new Error("Failed to fetch the user result");
  }
};
