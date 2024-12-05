import { Permission, Role } from "node-appwrite";
import { db, courseCollection } from "../name";
import { databases } from "./config";

export default async function createCourseCollection() {
  // Create a new collection
  await databases.createCollection(db, courseCollection, courseCollection, [
    Permission.create(Role.team("admin")), // Admins create
    Permission.read(Role.users()), // Regular users can read their own data
    Permission.update(Role.team("admin")), // Admins can update their own data
    Permission.delete(Role.team("admin")), // Admins can delete their own data
    Permission.read(Role.team("admin")), // Admins can read all user data
  ]);
  console.log("Course collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      courseCollection,
      "course_id",
      100,
      true,
    ),
    databases.createStringAttribute(db, courseCollection, "user_id", 100, true),
    databases.createStringAttribute(db, courseCollection, "title", 100, true),
    databases.createStringAttribute(
      db,
      courseCollection,
      "description",
      100,
      true,
    ),
    databases.createStringAttribute(db, courseCollection, "price", 100000,  true),
    databases.createStringAttribute(
      db,
      courseCollection,
      "duration",
      100,
      false,
    ),
    databases.createStringAttribute(db, courseCollection, "image", 100, false),
    databases.createStringAttribute(
      db,
      courseCollection,
      "requirements",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      courseCollection,
      "students",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      courseCollection,
      "created_at",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      courseCollection,
      "updated_at",
      100,
      false,
    ),
  ]);
}
