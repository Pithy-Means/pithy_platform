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
        [],
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
