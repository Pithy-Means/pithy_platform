import { Permission, Role } from "node-appwrite";
import { db, fundingCollection } from "../name";
import { databases } from "./config";

export default async function createFundingCollection() {
  // Create a new collection
  await databases.createCollection(db, fundingCollection, fundingCollection, [
    Permission.create(Role.team("admin")), // Admins create
    Permission.create(Role.users()), // Regular users can create
    Permission.read(Role.users()), // Regular users can read their own data
    Permission.update(Role.user("user")), // Regular users can update their own data
    Permission.delete(Role.user("user")), // Regular users can delete their own data
    Permission.delete(Role.team("admin")), // Admins can delete
    Permission.read(Role.team("admin")), // Admins can read all user data
  ]);
  console.log("Funding collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, fundingCollection, "funding_id", 100, true),
    databases.createStringAttribute(db, fundingCollection, "user_id", 100, true),
    databases.createStringAttribute(db, fundingCollection, "title", 1000, false),
    databases.createStringAttribute(db, fundingCollection, "donor", 1000, false),
    databases.createStringAttribute(
      db,
      fundingCollection,
      "description",
      1000000,
      false,
    ),
    databases.createStringAttribute(
      db,
      fundingCollection,
      "eligibre_countries",
      1000,
      false,
    ),
    databases.createStringAttribute(
      db,
      fundingCollection,
      "focus_earlier",
      10000,
      false,
    ),
    databases.createStringAttribute(
      db,
      fundingCollection,
      "grant_size",
      10000,
      false,
    ),
    databases.createStringAttribute(
      db,
      fundingCollection,
      "funding_type",
      100,
      false,
    ),
    databases.createDatetimeAttribute(db, fundingCollection, "closing_date", false),
    databases.createUrlAttribute(db, fundingCollection, "reference_link", false),
  ]);
};