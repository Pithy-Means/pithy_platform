"use server";

import { getCourse } from "@/lib/actions/user.actions";
import { generateValidPostId } from "@/lib/utils";
import { moduleCollection, db, postAttachementBucket } from "@/models/name";
import { Modules } from "@/types/schema";
import { createAdminClient } from "@/utils/appwrite";
import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: Request) {
  const allowedExtensions = ["mp4", "jpg", "jpeg", "png", "gif", "svg", "pdf"]; // Allowed file types

  const bodyText = await req.text();
  console.log("Incoming body:", bodyText);

  const data: Modules = JSON.parse(bodyText);
  console.log("Incoming data:", data);
  const video = data.video;

  // Extract file extension from Base64 prefix
  const base64Match = video.match(
    /^data:(image|video|application)\/(\w+);base64,/,
  );

  if (!base64Match) {
    console.error("Invalid Base64 format");
    return NextResponse.json(
      { message: "Invalid image format" },
      { status: 400 },
    );
  }

  const fileType = base64Match[2]; // Extract the file extension
  console.log("Extracted file type:", fileType);

  // Validate against allowed extensions
  if (!allowedExtensions.includes(fileType)) {
    console.error("Unsupported file type:", fileType);
    return NextResponse.json(
      { message: "Unsupported file type" },
      { status: 400 },
    );
  }

  const base64Prefix = base64Match[0];
  const base64Data = video.replace(base64Prefix, "");
  const binaryData = Buffer.from(base64Data, "base64");

  // Create a File object from binary data
  const fileName = `uploaded-file.${fileType}`;
  const mimeType = `${base64Match[1]}/${fileType}`;
  const videoFile = new File([binaryData], fileName, { type: mimeType });

  console.log("Created File object:", videoFile);

  try {
    const { databases, storage } = await createAdminClient();

    console.log("Uploading image to Appwrite...");
    const imageUpload = await storage.createFile(
      postAttachementBucket,
      ID.unique(),
      videoFile,
    );
    console.log("Uploaded image:", imageUpload);

    if (!data.course_id) {
      throw new Error("course_id is required");
    }
    const courseId = await getCourse(data.course_id);
    console.log("Course found:", courseId);

    console.log("Creating course document...");
    const moduleId = generateValidPostId(data.module_id);
    const courseModule = await databases.createDocument(
      db,
      moduleCollection,
      moduleId,
      {
        ...data,
        course_id: courseId.$id,
        module_id: moduleId,
        video: imageUpload.$id,
      },
    );

    console.log("Course created successfully:", courseModule);
    return NextResponse.json({
      message: "Course created successfully",
      data: courseModule,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { message: "Failed to create course", error: (error as Error).message },
      { status: 500 },
    );
  }
}
