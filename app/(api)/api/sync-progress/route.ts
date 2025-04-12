// app/(api)/api/sync-progress/route.ts
"use server";
import { getSession } from "@/lib/actions/user.actions";
import { db, userProgressCollection } from "@/models/name";
import { createAdminClient } from "@/utils/appwrite";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get the current user
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "Authentication required" }, 
        { status: 401 }
      );
    }
    
    const userId = session.$id;
    const { updates } = await request.json();
    
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { message: "No updates provided" },
        { status: 400 }
      );
    }

    const { databases } = await createAdminClient();
    
    // Process each update in sequence
    const results = await Promise.all(
      updates.map(async (update) => {
        const { moduleId, currentTime, completed, lastUpdated } = update;
        
        try {
          // Check if a progress record already exists
          const existingRecords = await databases.listDocuments(
            db,
            userProgressCollection,
            [
              `user_id=${userId}`,
              `module_id=${moduleId}`
            ]
          );
          
          if (existingRecords.documents.length > 0) {
            // Update existing record
            const existingId = existingRecords.documents[0].$id;
            await databases.updateDocument(
              db,
              userProgressCollection,
              existingId,
              {
                current_time: currentTime,
                completed: completed,
                last_updated: lastUpdated
              }
            );
            return { moduleId, status: "updated" };
          } else {
            // Create new record
            await databases.createDocument(
              db,
              userProgressCollection,
              "unique()",
              {
                user_id: userId,
                module_id: moduleId,
                current_time: currentTime,
                completed: completed,
                last_updated: lastUpdated
              }
            );
            return { moduleId, status: "created" };
          }
        } catch (error) {
          console.error(`Error updating progress for module ${moduleId}:`, error);
          return { moduleId, status: "failed", error: (error as Error).message };
        }
      })
    );
    
    return NextResponse.json({
      message: "Progress synced successfully",
      results
    });
  } catch (error) {
    console.error("Error syncing progress:", error);
    return NextResponse.json(
      { message: "Failed to sync progress", error: (error as Error).message },
      { status: 500 }
    );
  }
}