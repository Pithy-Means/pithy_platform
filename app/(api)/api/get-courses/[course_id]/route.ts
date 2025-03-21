// /app/api/courses/[course_id]/route.ts

"use server";

import { NextResponse } from "next/server";
import { Query } from "node-appwrite";
import { courseCollection, db, postAttachementBucket } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import env from "@/env";

export async function GET(
  req: Request,
  { params }: { params: { course_id: string } },
) {
  const { course_id } = params; // Access the course_id from the URL parameters

  try {
    const { databases } = await createAdminClient();
    console.log(`Fetching course with ID: ${course_id} from Appwrite...`);

    // Fetch the specific course by ID
    const course = await databases.listDocuments(db, courseCollection, [
      Query.equal("course_id", course_id),
    ]);

    if (course.documents.length === 0) {
      return NextResponse.json(
        {
          message: "Course not found",
        },
        { status: 404 },
      );
    }

    // Get the first course document
    const courseData = course.documents[0];

    let imageUrl = null;
    if (courseData.image) {
      try {
        // Fetch the image preview URL directly from Appwrite
        imageUrl = `${env.appwrite.endpoint}/storage/buckets/${postAttachementBucket}/files/${courseData.image}/view?project=${env.appwrite.projectId}&project=${env.appwrite.projectId}`;
      } catch (error) {
        console.error(
          `Failed to fetch image for course ${courseData.$id}:`,
          error,
        );
      }
    }

    // Return the course data with the image URL
    return NextResponse.json({
      message: "Course fetched successfully",
      data: { ...courseData, image: imageUrl },
    });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { message: "Failed to fetch course", error: (error as Error).message },
      { status: 500 },
    );
  }
}
