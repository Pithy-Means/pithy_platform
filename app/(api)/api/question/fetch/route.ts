import { fetchQuestions } from "@/lib/actions/user.actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetchQuestions();
    if (!response) {
      return NextResponse.json(
        { message: "No questions found." },
        { status: 404 }
      );
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );    
  }
}