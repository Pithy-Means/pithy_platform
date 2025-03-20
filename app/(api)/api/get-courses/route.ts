"use server";

import { courseCollection, db, postAttachementBucket } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";
import env from "@/env";

export async function GET() {
  try {
    const { databases } = await createAdminClient();
    const courses = await databases.listDocuments(db, courseCollection);

    const coursesWithImages = await Promise.all(
      courses.documents.map(async (course) => {
        let imageUrl = null;

        if (course.image) {
          try {
            // Fetch the image preview URL directly from Appwrite
            imageUrl = `${env.appwrite.endpoint}/storage/buckets/${postAttachementBucket}/files/${course.image}/view?project=${env.appwrite.projectId}&project=${env.appwrite.projectId}`;
            // imageUrl = filePreview.href;
          } catch (error) {
            console.error(
              `Failed to fetch image for course ${course.$id}:`,
              error,
            );
          }
        }

        return {
          ...course,
          image: imageUrl, // Attach the working image URL
        };
      }),
    );
    return NextResponse.json({
      message: "Courses fetched successfully",
      data: coursesWithImages,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Failed to fetch courses", error: (error as Error).message },
      { status: 500 },
    );
  }
}
