import { Permission, Role } from "node-appwrite";
import { db, postCollection } from "../name";
import { databases } from "./config";

export default async function createPostCollection() {
  // Create a new collection
  await databases.createCollection(db, postCollection, postCollection, [
    Permission.create(Role.team("admin")), // Admins create
    Permission.read(Role.users()), // All users can read
    Permission.create(Role.user("user")), // Users can create their own posts
    Permission.update(Role.user("user")), // Users can update their own posts
    Permission.delete(Role.user("user")), // Users can delete their own posts
    Permission.update(Role.team("admin")), // Admins can update any posts
    Permission.delete(Role.team("admin")), // Admins can delete any posts
    Permission.read(Role.team("admin")), // Admins can read all posts
  ]);
  console.log("Post collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, postCollection, "post_id", 100, true), // Post ID
    databases.createStringAttribute(db, postCollection, "user_id", 100, true), // User ID of the post creator
    databases.createStringAttribute(
      db,
      postCollection,
      "content",
      100000,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCollection,
      "repost_of",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      postCollection,
      "mediaurl",
      10000,
      false,
    ),
    databases.createStringAttribute(
      db,
      postCollection,
      "mediatype",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      postCollection,
      "user_comment",
      10000,
      false,
    ),
    databases.createStringAttribute(db, postCollection, "image", 100, false),
    databases.createStringAttribute(db, postCollection, "video", 100, false),
  ]);
}
