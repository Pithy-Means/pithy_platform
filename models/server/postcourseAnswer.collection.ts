import { Permission, Role } from 'node-appwrite';
import { db, postCourseAnswerCollection } from '../name';
import { databases } from './config';

export default async function createPostCourseAnswerCollection() {
  // Create a new collection
  await databases.createCollection(db, postCourseAnswerCollection, postCourseAnswerCollection, [
    Permission.create(Role.team('admin')),     // Admins create
    Permission.read(Role.users()),             // Regular users can read their own data
    Permission.update(Role.team('admin')),     // Admins can update their own data
    Permission.delete(Role.team('admin')),     // Admins can delete their own data
    Permission.read(Role.team('admin'))        // Admins can read all user data
  ]);
  console.log('Post course answer collection created');

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, postCourseAnswerCollection, 'user_id', 100, true),
    databases.createStringAttribute(db, postCourseAnswerCollection, 'course_id', 100, true),
    databases.createStringAttribute(db, postCourseAnswerCollection, 'question_id', 100, true),
    databases.createStringAttribute(db, postCourseAnswerCollection, 'answer', 100, true),
    databases.createStringAttribute(db, postCourseAnswerCollection, 'created_at', 100, false),
    databases.createStringAttribute(db, postCourseAnswerCollection, 'updated_at', 100, false)
  ]);
}