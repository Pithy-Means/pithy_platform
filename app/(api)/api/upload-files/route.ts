import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/appwrite";
import { postAttachementBucket } from "@/utils/constants";
import { Permission, Role, Account } from "node-appwrite";
import { parseCookies } from "nookies";  // For cookie parsing to extract session token


export async function POST(req: NextRequest) {
  try {
    // 1. Retrieve session token from cookies (assuming token is stored as 'sessionToken')
    const cookies = parseCookies({ req }); // Parse the cookies from the request
    // const sessionToken = cookies.get('sessionToken'); // Get the session token from the cookie
    const sessionToken = cookies.sessionToken; // Get the session token from the cookie

    console.log("Session token:", sessionToken);

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Initialize Appwrite storage and client
    const { storage, client } = await createAdminClient();
    console.log("Appwrite storage initialized");

    //3. Validate the user account & session token
    const account = new Account(client);
    client.setJWT(sessionToken); // Set the JWT token

    //4. Get the current session and validate it
    const session = await account.getSession("current");
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }
    console.log("Session validated:", session);
    // Optional: Check session expiry or user roles
    if (parseInt(session.expire) < Date.now() / 1000) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    //5.  Get the authenticated user's  account details
    const user = await account.get(); // Get the user account
    console.log("User account fetched:", user);

    //6.  Parse the incoming request | form data
    const data = await req.formData();
    console.log("Incoming data", data);

    const file = data.get("file") as File;
    console.log("Received the File:", file);

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    //7.  Validate the file size and type
    if (file.size <= 0) {
      return NextResponse.json({ error: "Invalid file size" }, { status: 400 });
      // throw new Error("Invalid file size");
    }

    if (!file.type) {
      return NextResponse.json(
        { error: "File type is missing or unsupported." },
        { status: 400 }
      );
    }
    //8. Convert the file to a Buffer and create a readable stream
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log("File Buffer created");

    // 9. Create an Appwrite File object
    const appwriteFile = new File([buffer], file.name, { type: file.type });
    console.log("Appwrite File created:", appwriteFile);

    //10.  Generate unique file ID  for Appwrite
    const uniqueFileId = `file_${Date.now()}`;
    console.log("Unique File ID:", uniqueFileId);

    // 10. Define permissions for the specific user

    // const storage = new Storage(client)

    // const { storage } = await createAdminClient();
    // if (!storage) {
    //   console.error("Failed to initialize Appwrite storage.");
    //   return NextResponse.json(
    //     { error: "Server storage initialization failed." },
    //     { status: 500 }
    //   );
    // }

    // Define permissions for the specific user
    const permissions = [
      Permission.read(Role.user(user.$id)),  // Allow the user to read their file
      Permission.write(Role.user(user.$id)), // Allow the user to write to their file
      Permission.update(Role.user(user.$id)), // Allow the user to update their file
      Permission.delete(Role.user(user.$id)), // Allow the user to delete their file
      Permission.delete(Role.team("admin")), // Admins can delete
    ];
    // const permissions = [`user:${userId}`] // Allow user to read and write];

    //12. Upload the file to Appwrite Storage
    const response = await storage.createFile(
      postAttachementBucket,
      uniqueFileId,
      appwriteFile,
      permissions,
    );

    console.log(`File uploaded successfully: ${response.$id}`);
    return NextResponse.json({
      fileId: response.$id,
      message: "File uploaded successfully!",
    });

  } catch (error) {
    console.error("Error uploading file", error);

    // Handle specific errors
    if (error instanceof Error && error.message.includes("formData")) {
      return NextResponse.json(
        { error: "Failed to parse form data. Ensure the request uses multipart/form-data." },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes("createFile")) {
      return NextResponse.json(
        { error: "File upload to storage failed. Check Appwrite SDK configuration." },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   const data = await req.text();
//   console.log('Incomming data', data);
//   const { media_url } = JSON.parse(data);
//   console.log('Media URL:', media_url);

//   if (media_url !== 'string') {
//     console.log('Invalid media URL');
//     // return NextResponse.json({ error: "Invalid media URL" }, { status: 400 });
//     throw new Error("Invalid media URL");
//   }

//   try {
//     const { storage } = await createAdminClient();

//     let base64media = '';
//     if (media_url.endsWith('.jpeg')) {
//       base64media = 'data:image/jpeg;base64,';
//     } else if (media_url.endsWith('.mp4')) {
//       base64media = 'data:video/mp4;base64,';
//     } else if (media_url.endsWith('.jpg')) {
//       base64media = 'data:image/jpg;base64,';
//     } else {
//       throw new Error("Unsupported media type");
//     }

//     const buffer = Buffer.from(base64media, 'base64');

//     const appwriteFile = new File([buffer], media_url, { type: media_url });

//     const response = await storage.createFile(
//       postAttachementBucket,
//       media_url,
//       appwriteFile,
//     );

//     console.log(`File uploaded successfully: ${response.$id}`);
//     return NextResponse.json({ fileId: response.$id, message: "File uploaded successfully!" });
//   } catch (error) {
//     console.log('Error uploading file:', error);
//   }
// }