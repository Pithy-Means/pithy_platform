'use server';

import { courseCollection, courseAttachementBucket, db } from '@/models/name';
import { createAdminClient } from '@/utils/appwrite';
import { NextResponse } from 'next/server';
import env from '../../../../env';

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    console.log('Fetching courses from Appwrite...');
    const courses = await databases.listDocuments(db, courseCollection);

    const coursesWithImages = await Promise.all(
      courses.documents.map(async (course) => {
        let imageUrl = null;

        if (course.image) {
          try {
            // Fetch the image preview URL directly from Appwrite
            imageUrl = `${env.appwrite.endpoint}/storage/buckets/${courseAttachementBucket}/files/${course.image}/view?project=${env.appwrite.projectId}&project=${env.appwrite.projectId}&mode=admin`;
            // imageUrl = filePreview.href;
          } catch (error) {
            console.error(`Failed to fetch image for course ${course.$id}:`, error);
          }
        }

        return {
          ...course,
          image: imageUrl, // Attach the working image URL
        };
      })
    );

    console.log('Fetched courses with images:', coursesWithImages);
    return NextResponse.json({ message: 'Courses fetched successfully', data: coursesWithImages });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses', error: (error as Error).message },
      { status: 500 }
    );
  }
}