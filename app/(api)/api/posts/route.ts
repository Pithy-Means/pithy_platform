// pages/api/posts.js

import { NextApiRequest, NextApiResponse } from "next";
import { Client, Databases } from "appwrite";

// Initialize Appwrite client
const client = new Client();
const database = new Databases(client);

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "") // Your Appwrite endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID || ""); // Your Appwrite project ID

const databaseId = process.env.APPWRITE_DATABASE_ID || "";
const collectionId = process.env.APPWRITE_COLLECTION_ID || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "POST") {
      // Handle the creation of a new post
      const { userId, postId, fileId, content, mediaUrl, mediaType, } = req.body;

      if (!userId || !postId || !fileId || !content) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      // Create a new post document
      const document = await database.createDocument(databaseId, collectionId, "unique()", {
        userId,
        postId,
        fileId,
        content,
        mediaUrl,
        mediaType,
        createdAt: new Date().toISOString(),
      });

      // Return the created post
      return res.status(201).json({ message: "Post created successfully.", document });
    }

    if (req.method === "GET") {
      // Fetch posts for a specific user
      const { userId } = req.query;

      // Validate the user ID
      if (!userId) {
        return res.status(400).json({ error: "User ID is required." });
      }

      // Fetch all documents for the user
      const documents = await database.listDocuments(databaseId, collectionId, [
        `equal("userId", "${userId}")`
      ]);

      // // Fetch user details (for all posts)
      // const userDetails = await database.getDocument(databaseId, "usersCollectionId", userId); // Replace `usersCollectionId` with actual ID

      // // Attach user info to each post
      // const postsWithUser = documents.documents.map((doc) => ({
      //   ...doc,
      //   user: userDetails,
      // }));

      // Return the documents
      return res.status(200).json({ documents});
    }

    // Handle other HTTP methods
    return res.status(405).json({ error: "Method not allowed." });
  } catch (error) {
    console.error("Error handling user data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
