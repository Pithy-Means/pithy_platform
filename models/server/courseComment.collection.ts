import { Permission, Role } from "node-appwrite";
import { db, courseCommentCollection } from "../name";
import { databases } from "./config";

export default async function createCourseCommentCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    courseCommentCollection,
    courseCommentCollection,
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
  console.log("Course comment collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      courseCommentCollection,
      "comment_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      courseCommentCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      courseCommentCollection,
      "course_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      courseCommentCollection,
      "comment",
      100,
      false,
    ),
  ]);
}
