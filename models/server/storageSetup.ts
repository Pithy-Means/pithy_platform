import { Permission, Role } from "node-appwrite";
import { postAttachementBucket } from "../name";
import { storage } from "./config";

export default async function setupStorage() {
  try {
    // Get the bucket
    await storage.getBucket(postAttachementBucket);
    console.log("Bucket already exists");
  } catch (error) {
    console.log("Bucket does not exist, creating it now");
    try {
      // Create the bucket
      await storage.createBucket(
        postAttachementBucket,
        postAttachementBucket,
        [
          Permission.create(Role.any()),
          Permission.read(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any()),
        ],
        true,
        true,
        50000000,
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
  // Return the storage instance after setup
  return storage;
}
