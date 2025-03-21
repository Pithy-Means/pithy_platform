"use server";
import env from "@/env";
import { db, moduleCollection, postAttachementBucket } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET() {
  try {
    const { databases } = await createAdminClient();
    
    // Solution 1: Increase the limit to fetch all at once
    const modules = await databases.listDocuments(
      db,
      moduleCollection,
      [Query.limit(1000)] // Increase the limit to fetch all at once
    );
    // OR Solution 2: Implement pagination to get all modules
    // This is more robust for larger collections
    /*
    let allModules = [];
    let offset = 0;
    const limit = 25; // Appwrite's default limit
    
    while (true) {
      const response = await databases.listDocuments(
        db,
        moduleCollection,
        {
          limit: limit,
          offset: offset
        }
      );
      
      allModules = [...allModules, ...response.documents];
      
      if (response.documents.length < limit) {
        break; // We've reached the end of the collection
      }
      
      offset += limit;
    }
    
    const modules = { documents: allModules };
    */

    const moduleWithVideo = await Promise.all(
      modules.documents.map(async (module) => {
        let videoUrl = null;
        if (module.video) {
          try {
            // Fetch the video preview URL directly from Appwrite
            videoUrl = `${env.appwrite.endpoint}/storage/buckets/${postAttachementBucket}/files/${module.video}/view?project=${env.appwrite.projectId}&project=${env.appwrite.projectId}`;
            // imageUrl = filePreview.href;
          } catch (error) {
            console.error(
              `Failed to fetch video for module ${module.$id}:`,
              error,
            );
          }
        }
        return {
          ...module,
          video: videoUrl, // Attach the working video URL
        };
      }),
    );
    
    return NextResponse.json({
      message: "Modules fetched successfully",
      data: moduleWithVideo,
    });
  } catch (error) {
    console.error("Error fetching modules:", error);
    return NextResponse.json(
      { message: "Failed to fetch modules", error: (error as Error).message },
      { status: 500 },
    );
  }
}