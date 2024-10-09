import { Permission, Role } from "node-appwrite";
import { db, preCourseQuestionCollection } from "../name";
import { databases } from "./config";

export default async function createPreCourseQuestionCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    preCourseQuestionCollection,
    preCourseQuestionCollection,
    [
      Permission.create(Role.team("admin")), // Admins create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.team("admin")), // Admins can update their own data
      Permission.delete(Role.team("admin")), // Admins can delete their own data
      Permission.read(Role.team("admin")), // Admins can read all user data
    ],
  );
  console.log("Pre course question collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      preCourseQuestionCollection,
      "pre_course_question_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      preCourseQuestionCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      preCourseQuestionCollection,
      "question",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      preCourseQuestionCollection,
      "answer",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      preCourseQuestionCollection,
      "created_at",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      preCourseQuestionCollection,
      "updated_at",
      100,
      false,
    ),
  ]);
}
