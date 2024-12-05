import { NextApiRequest, NextApiResponse } from "next";
import { Client, Databases } from "appwrite";
import env from "@/env";
import { db, postCollection } from "@/models/name";
import { Permission, Role } from "node-appwrite";
import authenticateSessionToken from "@/lib/hooks/getUserId";


const client = new Client();
const database = new Databases(client);

client
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId);

const databaseId = db;
const collectionId = postCollection;

// Wrapp the handler with the session authentication middleware
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await authenticateSessionToken(req, res, async () => {
    try {
      switch (req.method) {
        case "POST": {
          const { userId, content, mediaUrl, mediaType } = req.body;

          if (!userId || !content) {
            return res.status(400).json({ error: "Missing required fields." });
          }
          // Generate unique post ID if not provided
          const postId = `post_${new Date().getTime()}`;

          // Prepare the post data
          const postData = {
            post_id: postId,
            user_id: userId,
            content: content || null,
            media_url: mediaUrl || null,
            media_type: mediaType || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const permissions = [
            Permission.read(Role.user(userId)),
            Permission.write(Role.user(userId)),
            Permission.delete(Role.user(userId)),
          ];

          // save the post data to the database
          const document = await database.createDocument(
            databaseId,
            collectionId,
            postId,
            postData,
            permissions
          );

          if (!document) {
            return res.status(500).json({ error: "Failed to create document." });
          } else {
            // return res.status(201).json(document);
            return res.status(201).json({ success: true, post: document });
          }
        }

        case "GET": {
          const { userId, limit = 10, offset = 0 } = req.query;

          if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
          }

          const documents = await database.listDocuments(
            databaseId,
            collectionId,
            [
              `equal("userId", "${userId}")`,
              `limit(${limit})`,
              `offset(${offset})`,
            ]
          );

          return res.status(200).json(documents);
        }

        default:
          return res.status(405).json({ error: "Method not allowed." });
      }
    } catch (error) {
      console.error("Error handling user data:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  });
};
