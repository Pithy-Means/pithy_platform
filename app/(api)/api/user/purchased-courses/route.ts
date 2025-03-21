// app/api/user/purchased-courses/route.ts
import { courseCollection, db, userCollection } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";
import { Query } from "node-appwrite";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { databases } = await createAdminClient();

    // Get the user
    const userQuery = await databases.listDocuments(db, userCollection, [
      Query.equal("user_id", userId),
    ]);

    if (userQuery.documents.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userQuery.documents[0];
    const studentName = user.lastname + " " + user.firstname;
    const studentEmail = user.email;

    // Find all courses where this user is enrolled
    const coursesQuery = await databases.listDocuments(db, courseCollection, [
      Query.search("students", studentName),
      Query.search("student_email", studentEmail),
    ]);

    return NextResponse.json({
      success: true,
      courses: coursesQuery.documents.map((course) => ({
        course_id: course.course_id,
        title: course.title,
      })),
    });
  } catch (error) {
    console.error("Error fetching user's purchased courses:", error);
    return NextResponse.json(
      {
        error: "Internal server error while fetching purchased courses",
        details: error,
      },
      { status: 500 },
    );
  }
}
