"use server";

import { generateValidPostId } from "@/lib/utils";
import { courseCollection, db, postAttachementBucket } from "@/models/name";
import { Courses } from "@/types/schema";
import { createAdminClient } from "@/utils/appwrite";
import { Buffer } from "buffer";
import { NextResponse } from "next/server";
import { ID } from "node-appwrite";

export async function POST(req: Request) {
  const allowedExtensions = [
    "mp4",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "svg",
    "pdf",
    "webp",
  ]; // Allowed file types

  const bodyText = await req.text();
  console.log("Incoming body:", bodyText);

  const data: Courses = JSON.parse(bodyText);
  console.log("Incoming data:", data);
  const image = data.image;

  // Extract file extension from Base64 prefix
  const base64Match = image.match(
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
  const base64Data = image.replace(base64Prefix, "");
  const binaryData = Buffer.from(base64Data, "base64");

  // Create a File object from binary data
  const fileName = `uploaded-file.${fileType}`;
  const mimeType = `${base64Match[1]}/${fileType}`;
  const imageFile = new File([binaryData], fileName, { type: mimeType });

  console.log("Created File object:", imageFile);

  try {
    const { databases, storage } = await createAdminClient();

    console.log("Uploading image to Appwrite...");
    const imageUpload = await storage.createFile(
      postAttachementBucket,
      ID.unique(),
      imageFile,
    );

    console.log("Uploaded image:", imageUpload);
    const imagePreview = await storage.getFilePreview(
      postAttachementBucket,
      imageUpload.$id,
    );
    console.log("Image preview:", imagePreview);

    console.log("Creating course document...");
    const moduleId = generateValidPostId(data.course_id);
    const courseModule = await databases.createDocument(
      db,
      courseCollection,
      moduleId,
      {
        ...data,
        course_id: moduleId,
        image: imageUpload.$id,
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
