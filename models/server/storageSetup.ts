'use server';
import { Permission, Role } from "node-appwrite";
import { createAdminClient } from "@/utils/appwrite";
import { postAttachementBucket } from "@/utils/constants";

console.log(postAttachementBucket);

export default async function setupStorage() {
  console.log(`Initializing storage setup for bucket: ${postAttachementBucket}`);

  //Ensure admin client is fully initialized
  const adminClient = await createAdminClient();

  // Wait for the storage to be initialized and available
  const storage = adminClient.storage;
  if (!storage) {
    console.error("Failed to initialize storage");
    return null;
  }
  console.log("Storage initialized successfully");

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
  // Return the storage instance after setup
  return storage;
}
