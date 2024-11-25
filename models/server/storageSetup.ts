import { Permission, Role } from "node-appwrite";
import { postAttachementBucket } from "../name";

import { createAdminClient } from "@/utils/appwrite";
// import { storage } from "./config";

const { storage } = createAdminClient();

//Export postAttachementBucket
export { postAttachementBucket };

export default async function setupStorage() {
  try {
    // Get the bucket
    await storage.getBucket(postAttachementBucket);
    console.log("Bucket already exists");
  } catch (error) {
    try {
      // Create the bucket
      await storage.createBucket(
        postAttachementBucket,
        postAttachementBucket,
        [
          Permission.read(Role.users()), // Everyone can read
          Permission.create(Role.users()), // Everyone can write
          Permission.create(Role.team("admin")), // Admins can write
          Permission.update(Role.team("admin")), // Admins can update
          Permission.delete(Role.team("admin")), // Admins can delete
        ],
      false, undefined, undefined, [
          "jpg", "png", "gif", "jpeg", "webp", "mp4",
        ]);

      //set allowed file type and maximum file size
      // await storage.updateBucket(postAttachementBucket, {
      //   allowedFileExtensions: ["jpg", "jpeg", "png", "gif", "svg", "webp", "mp4"],
      //   maximumFileSize: 10 * 1024 * 1024, // 10 MB in bytes
      // });

      console.log("Storage setup complete");
    } catch (error) {
      console.log("Error creating bucket", error);
    }
  }
  return storage;
}
