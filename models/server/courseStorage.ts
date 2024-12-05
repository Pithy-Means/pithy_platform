import { Permission, Role } from "node-appwrite";
import { courseAttachementBucket } from "../name";
import { storage } from "./config";

export default async function courseStorage() {
  try {
    // Get the bucket
    await storage.getBucket(courseAttachementBucket);
    console.log("Course Bucket already exists");
  } catch (error) {
    try {
      await storage.createBucket(
        courseAttachementBucket,
        courseAttachementBucket,
        [
          Permission.read(Role.users()), // Everyone can read
          Permission.create(Role.users()), // Everyone can write
          Permission.update(Role.users()), // Everyone can update
          Permission.delete(Role.users()), // Everyone can delete
          Permission.read(Role.team("admin")), // Admins can read
          Permission.create(Role.team("admin")), // Admins can write
          Permission.update(Role.team("admin")), // Admins can update
          Permission.delete(Role.team("admin")), // Admins can delete
        ],
        false,
        true,
        50000000,
        [
          "mp4", // Video files
          "jpeg", // Image files
          "jpg", // Image files
          "png", // Image files
          "gif", // Image files
          "svg", // Image files
          "pdf", // Document files
        ],
      );
      console.log("Course Storage setup complete");
    } catch (error) {
      console.log("Error creating bucket", error);
    }
  }
  return storage;
}
