import { Permission, Role } from "node-appwrite";
import { postAttachementBucket } from "../name";
import { storage } from "./config";

export default async function setupStorage() {
  try {
    // Get the bucket
    await storage.getBucket(postAttachementBucket);
    console.log("Bucket already exists");
  } catch (error) {
    try {
      await storage.createBucket(
        postAttachementBucket,
        postAttachementBucket,
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
        false,
        50,
        [
          "jpg",
          "png",
          "gif",
          "jpeg",
          "webp",
          "heic",
          "heif",
          "svg",
          "pdf",
          "doc",
          "docx",
          "xls",
          "mp4",
          "webm",
          "mp3",
          "wav",
        ],
      );
      console.log("Storage setup complete");
    } catch (error) {
      console.log("Error creating bucket", error);
    }
  }
  return storage;
}
