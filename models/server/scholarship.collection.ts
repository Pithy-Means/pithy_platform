import { Permission, Role } from "node-appwrite";
import { db, scholarshipCollection } from "../name";
import { databases } from "./config";

export default async function createScholarshipCollection() {
  // Create a new collection
  await databases.createCollection(
    db,
    scholarshipCollection,
    scholarshipCollection,
    [
      Permission.create(Role.team("admin")), // Admins create
      Permission.read(Role.users()), // Regular users can read their own data
      Permission.update(Role.team("admin")), // Admins can update
      Permission.delete(Role.team("admin")), // Admins can delete
      Permission.read(Role.team("admin")), // Admins can read all user data
    ],
  );
  console.log("Scholarship collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "scholarship_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "comment",
      1000,
      false,
    ),
  ]);
}
