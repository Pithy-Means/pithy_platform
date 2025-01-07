import { postAttachementBucket } from "../name";
import { storage } from "./config";




export default async function setupStorage() {
  console.log(`Initializing storage setup for bucket: ${postAttachementBucket}`);

  //Ensure admin client is fully initialized
  // const adminClient = await createAdminClient();

  // Wait for the storage to be initialized and available
  // const storage = adminClient.storage;
  // if (!storage) {
  //   console.error("Failed to initialize storage");
  //   return null;
  // }
  // console.log("Storage initialized successfully");

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
        [],
        false,
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
