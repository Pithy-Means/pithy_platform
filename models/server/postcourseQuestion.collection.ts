import { Permission, Role } from "node-appwrite";
import { db, postCourseQuestionCollection } from "../name";
import { databases } from "./config";

export default async function createPostCourseQuestionCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    postCourseQuestionCollection,
    postCourseQuestionCollection,
    [
      Permission.create(Role.team("admin")), // Admins create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.team("admin")), // Admins can update their own data
      Permission.delete(Role.team("admin")), // Admins can delete their own data
      Permission.read(Role.team("admin")), // Admins can read all user data
    ],
  );
  console.log("Post course question collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      postCourseQuestionCollection,
      "post_course_question_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCourseQuestionCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCourseQuestionCollection,
      "course_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCourseQuestionCollection,
      "question",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      postCourseQuestionCollection,
      "categories",
      100,
      false,
    ),
  ]);
}
