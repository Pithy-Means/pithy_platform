import { Permission, Role } from "node-appwrite";
import { db, certificateCollection } from "../name";
import { databases } from "./config";

export default function createCertificateCollection() {
  // Create a new collection
  databases.createCollection(db, certificateCollection, certificateCollection, [
    Permission.create(Role.team("admin")), // Admins create
    Permission.read(Role.user("user")), // Regular users can read their own data
    Permission.update(Role.team("admin")), // Admins can update
    Permission.delete(Role.team("admin")), // Admins can delete
    Permission.read(Role.team("admin")), // Admins can read all user data
  ]);
  console.log("Certificate collection created");

  // Create common attributes
  Promise.all([
    databases.createStringAttribute(
      db,
      certificateCollection,
      "user_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      certificateCollection,
      "course_id",
      100,
      true,
    ),
    databases.createStringAttribute(
      db,
      certificateCollection,
      "certificate_id",
      100,
      true,
    ),
    databases.createDocument(db, certificateCollection, "certificate", true),
    databases.createStringAttribute(
      db,
      certificateCollection,
      "created_at",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      certificateCollection,
      "updated_at",
      100,
      false,
    ),
  ]);
}
