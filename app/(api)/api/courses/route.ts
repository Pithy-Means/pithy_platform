import { NextResponse } from "next/server";
// import course from "@/types/Course";
import {courses} from "@/types/courses";

// Route to fetch courses
export async function GET() {
  try {
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
