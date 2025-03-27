import { Permission, Role } from "node-appwrite";
import { db, questionCollection } from "../name";
import { databases } from "./config";

export default async function createQuestionCollection () {
  await databases.createCollection(
    db,
    questionCollection,
    questionCollection,
    [
      Permission.create(Role.users()),
      Permission.create(Role.team("admin")), // Admins create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.team("admin")), // Admins can update
      Permission.delete(Role.team("admin")), // Admins can delete
      Permission.read(Role.team("admin")), // Admins can read all user data
    ],
    true,
    true
  );

  console.log("Question Collection created!");

  await Promise.all([
    databases.createStringAttribute(
      db, questionCollection, "user_id", 100, true
    ),
    databases.createStringAttribute(
      db, questionCollection, "question_id", 100, true
    ),
    databases.createStringAttribute(db, questionCollection, "question", 10000, false)
  ])
}