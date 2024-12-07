import { NextRequest, NextResponse } from "next/server";
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
export default async function handler(req: NextRequest ) {
  // Call the authenticateSessionToken function to verify the session token
  const authResult = await authenticateSessionToken();
  if (!authResult || authResult.status !== 200) {
    return NextResponse.json({ error: authResult.message }, { status: authResult.status });
  }

  // Extract the userId from the validated session
  const { userId } = authResult; 
  // await authenticateSessionToken().then(async () => {
    try {
      const body = await req.json();
      switch (req.method) {
        case "POST": {
          const { content, mediaUrl, mediaType } = body;

          if (!userId || !content) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
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
            // updated_at?: new Date().toISOString(),
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
            return NextResponse.json({ error: "Failed to create document." }, { status: 500 });
          } else {
            // return res.status(201).json(document);
            return NextResponse.json({ success: true, post: document }, { status: 201 });
          }
        }

        case "GET": {
          const { searchParams } = new URL(req.url);
          const userId = searchParams.get("userId");
          const limit = parseInt(searchParams.get("limit") || "10");
          const offset = parseInt(searchParams.get("offset") || "0");

          if (!userId) {
            return NextResponse.json({ error: "User ID is required." }, { status: 400 });
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

          return NextResponse.json(documents, { status: 200 });
        }

        default:
          return NextResponse.json({ error: "Method not allowed." }, { status: 405 });
      }
    } catch (error) {
      console.error("Error handling user data:", error);
      return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
  
};
