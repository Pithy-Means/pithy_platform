import { Permission, Role } from 'node-appwrite';
import { db, preCourseAnswerCollection } from '../name';
import { databases } from './config';

export default async function createPreCourseAnswerCollection() {
  // Create a new collection
  await databases.createCollection(db, preCourseAnswerCollection, preCourseAnswerCollection, [
    Permission.create(Role.team('admin')),     // Admins create
    Permission.read(Role.users()),             // Regular users can read their own data
    Permission.update(Role.team('admin')),     // Admins can update their own data
    Permission.delete(Role.team('admin')),     // Admins can delete their own data
    Permission.read(Role.team('admin'))        // Admins can read all user data
  ]);
  console.log('Pre course answer collection created');

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, preCourseAnswerCollection, 'pre_course_answer_id', 100, true),
    databases.createStringAttribute(db, preCourseAnswerCollection, 'user_id', 100, true),
    databases.createStringAttribute(db, preCourseAnswerCollection, 'course_id', 100, true),
    databases.createStringAttribute(db, preCourseAnswerCollection, 'question_id', 100, true),
    databases.createStringAttribute(db, preCourseAnswerCollection, 'answer', 100, true),
    databases.createStringAttribute(db, preCourseAnswerCollection, 'created_at', 100, false),
    databases.createStringAttribute(db, preCourseAnswerCollection, 'updated_at', 100, false)
  ]);
}