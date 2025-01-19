import { Permission, Role } from "node-appwrite";
import { db, commentJobsCollection } from "../name";
import { databases } from "./config";

export async function createJobCommentCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    commentJobsCollection,
    commentJobsCollection,
    [
      Permission.create(Role.users()), // Users can create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.users()), // Regular users can update
      Permission.delete(Role.users()), // Regular users can delete
      Permission.read(Role.users()), // Regular users can read all user data
    ],
  );
  console.log("Job comment collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      commentJobsCollection,
      "comment_job_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentJobsCollection,
      "job_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentJobsCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      commentJobsCollection,
      "comment",
      100000,
      false,
    ),
  ]);
};