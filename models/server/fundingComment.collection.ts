import { Permission, Role } from "node-appwrite";
import { db, commentFundingCollection } from "../name";
import { databases } from "./config";

export async function createFundingCommentCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    commentFundingCollection,
    commentFundingCollection,
    [
      Permission.create(Role.users()), // Users can create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.users()), // Regular users can update
      Permission.delete(Role.users()), // Regular users can delete
      Permission.read(Role.users()), // Regular users can read all user data
    ],
  );
  console.log("Funding comment collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      commentFundingCollection,
      "comment_funding_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentFundingCollection,
      "funding_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentFundingCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentFundingCollection,
      "comment",
      100000,
      false,
    ),
  ]);
};