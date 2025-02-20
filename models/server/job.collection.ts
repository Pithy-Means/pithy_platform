import { Permission, Role } from "node-appwrite";
import { db, jobCollection } from "../name";
import { databases } from "./config";

export default async function createJobCollection() {
  // Create a new collection
  await databases.createCollection(db, jobCollection, jobCollection, [
    Permission.create(Role.team("admin")), // Admins create
    Permission.create(Role.users()), // Regular users can create
    Permission.read(Role.users()), // Regular users can read their own data
    Permission.update(Role.user("user")), // Regular users can update their own data
    Permission.delete(Role.user("user")), // Regular users can delete their own data
    Permission.delete(Role.team("admin")), // Admins can delete
    Permission.read(Role.team("admin")), // Admins can read all user data
  ]);
  console.log("Job collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, jobCollection, "job_id", 100, true),
    databases.createStringAttribute(db, jobCollection, "user_id", 100, true),
    databases.createStringAttribute(db, jobCollection, "job_title", 100, false),
    databases.createStringAttribute(
      db,
      jobCollection,
      "job_description",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      jobCollection,
      "location_of_work",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      jobCollection,
      "job_earlier",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      jobCollection,
      "country_of_work",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      jobCollection,
      "employer",
      100,
      false,
    ),
    databases.createDatetimeAttribute(db, jobCollection, "closing_date", false),
    databases.createUrlAttribute(db, jobCollection, "application_link", false),
  ]);
}
