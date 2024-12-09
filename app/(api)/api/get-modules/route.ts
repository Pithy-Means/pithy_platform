"use server";

import env from "@/env";
import { courseAttachementBucket, db, moduleCollection } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    const modules = await databases.listDocuments(db, moduleCollection);

    const moduleWithVideo = await Promise.all(
      modules.documents.map(async (module) => {
        let videoUrl = null;

        if (module.video) {
          try {
            // Fetch the video preview URL directly from Appwrite
            videoUrl = `${env.appwrite.endpoint}/storage/buckets/${courseAttachementBucket}/files/${module.video}/view?project=${env.appwrite.projectId}&project=${env.appwrite.projectId}&mode=admin`;
            // imageUrl = filePreview.href;
          } catch (error) {
            console.error(`Failed to fetch video for module ${module.$id}:`, error);
          }
        }

        return {
          ...module,
          video: videoUrl, // Attach the working video URL
        };
      })
    )

    return NextResponse.json({ message: 'Modules fetched successfully', data: moduleWithVideo });

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses', error: (error as Error).message },
      { status: 500 }
    );
  }
}