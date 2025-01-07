import { Permission, Role } from "node-appwrite";
import { db, postCommentCollection } from "../name";
import { databases } from "./config";

export default async function createCommentCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    postCommentCollection,
    postCommentCollection,
    [
      Permission.create(Role.team("admin")), // Admins create
      Permission.create(Role.users()), // Regular users can create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.user("user")), // Regular users can update their own data
      Permission.delete(Role.user("user")), // Regular users can delete their own data
      Permission.update(Role.team("admin")), // Admins can update
      Permission.delete(Role.team("admin")), // Admins can delete
      Permission.read(Role.team("admin")), // Admins can read all user data
    ],
  );
  console.log("Comment post collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      postCommentCollection,
      "userid",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCommentCollection,
      "post_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCommentCollection,
      "comment_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCommentCollection,
      "comment",
      1000,
      true,
    ),
  ]);
}
