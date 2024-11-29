import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // const path = `./public/${file.name}`;
  // await writeFile(path, buffer);

  const userId = req.headers.get("x-user-id") || "default";

  const filePath = `./uploads/${userId}/${Date.now()}_${file.name}`;
  await writeFile(filePath, buffer);

  console.log(`File saved to ${filePath}`);
  return NextResponse.json({ message: "File uploaded successfully!" });
}