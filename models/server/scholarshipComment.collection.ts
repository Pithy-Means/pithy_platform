import { Permission, Role } from "node-appwrite";
import { db, commentScholarshipCollection } from "../name";
import { databases } from "./config";

export async function createScholarshipCommentCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    commentScholarshipCollection,
    commentScholarshipCollection,
    [
      Permission.create(Role.users()), // Users can create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.users()), // Regular users can update
      Permission.delete(Role.users()), // Regular users can delete
      Permission.read(Role.users()), // Regular users can read all user data
    ],
  );
  console.log("Scholarship comment collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      commentScholarshipCollection,
      "comment_scholarship_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentScholarshipCollection,
      "scholarship_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentScholarshipCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentScholarshipCollection,
      "comment",
      100000,
      false,
    ),
  ]);
};