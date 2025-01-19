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
      "title",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "provider",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "study_level",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "amount",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "deadline",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "discipline",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "country_of_study",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      scholarshipCollection,
      "reference_link",
      1000,
      false,
    ),
  ]);
}
