// import { NextRequest, NextResponse } from "next/server";
// import { postAttachementBucket } from "@/models/name";
// import { Permission, Role } from "node-appwrite";
// import authenticateSessionToken from "@/lib/hooks/getUserId";
// import { storage } from "@/models/server/config";



// export async function POST(req: NextRequest) {
//   try {
//     // 0. Validate session token befor proceeding
//     const authResult = await authenticateSessionToken(req);
//     console.log("Auth result:", authResult);
//     if (!authResult || authResult.status !== 200) {
//       return NextResponse.json({ error: authResult.message }, { status: 401 });
//     }

//     //1. Retrieve session token from cookies
//     // const sessionToken = authResult.userId;
//     const { userId } = authResult as { userId: string };
//     console.log("authenticated user ID:", userId);


//     //6.  Parse the incoming request | form data
//     const data = await req.formData();
//     console.log("Incoming data", data);

//     const file = data.get("file") as File;
//     console.log("Received the File:", file);

//     // Helper: Validate File
//     const validateFile = (file: File | null): { valid: boolean; message?: string } => {
//       if (!file) return { valid: false, message: "No file uploaded" };
//       if (!(file instanceof File)) return { valid: false, message: "Invalid file type" };
//       if (file.size <= 0) return { valid: false, message: "File size must be greater than 0" };
//       if (!file.type) return { valid: false, message: "File type is missing or unsupported" };
//       return { valid: true };
//     };

//     //7. Validate the file
//     const fileValidation = validateFile(file);
//     if (!fileValidation.valid) {
//       return NextResponse.json({ error: fileValidation.message }, { status: 400 });
//     }

//     //8. Convert the file to a Buffer and create a readable stream
//     const buffer = Buffer.from(await file.arrayBuffer());
//     console.log("File Buffer created");

//     // 9. Create an Appwrite File object
//     const appwriteFile = new File([buffer], file.name, { type: file.type });
//     console.log("Appwrite File created:", appwriteFile);

//     //10.  Generate unique file ID  for Appwrite
//     const uniqueFileId = `file_${Date.now()}`;
//     console.log("Unique File ID:", uniqueFileId);

//     // 10. Define permissions for the specific user

//     // const storage = new Storage(client)

//     // const { storage } = await createAdminClient();
//     // if (!storage) {
//     //   console.error("Failed to initialize Appwrite storage.");
//     //   return NextResponse.json(
//     //     { error: "Server storage initialization failed." },
//     //     { status: 500 }
//     //   );
//     // }

//     // Define permissions for the specific user
//     const permissions = [
//       Permission.read(Role.user(userId)),  // Allow the user to read their file
//       Permission.write(Role.user(userId)), // Allow the user to write to their file
//       Permission.update(Role.user(userId)), // Allow the user to update their file
//       Permission.delete(Role.user(userId)), // Allow the user to delete their file
//       Permission.delete(Role.team("admin")), // Admins can delete
//     ];
//     // const permissions = [`user:${userId}`] // Allow user to read and write];

//     //12. Upload the file to Appwrite Storage
//     const response = await storage.createFile(
//       postAttachementBucket,
//       uniqueFileId,
//       appwriteFile,
//       permissions,
//     );



//     console.log(`File uploaded successfully: ${response.$id}`);
//     return NextResponse.json({
//       fileId: response.$id,
//       message: "File uploaded successfully!",
//     });

//   } catch (error) {
//     console.error("Error uploading file", error);

//     // Handle specific errors
//     if (error instanceof Error && error.message.includes("formData")) {
//       return NextResponse.json(
//         { error: "Failed to parse form data. Ensure the request uses multipart/form-data." },
//         { status: 400 }
//       );
//     }

//     if (error instanceof Error && error.message.includes("createFile")) {
//       return NextResponse.json(
//         { error: "File upload to storage failed. Check Appwrite SDK configuration." },
//         { status: 500 }
//       );
//     }
//     return NextResponse.json({ error: "Failed to upload file" },
//       { status: 500 }
//     );
//   }
// }