import { IndexType, Permission, Role } from "node-appwrite"; 
import { db, userCollection } from "../name"; 
import { databases } from "./config";

export default async function createUserCollection() {
  // Create a new collection
  await databases.createCollection(db, userCollection, userCollection, [
    Permission.create(Role.any()),             // Anyone can create
    Permission.read(Role.users()),             // Regular users can read their own data
    Permission.update(Role.users()),           // Regular users can update their own data
    Permission.delete(Role.users()),           // Regular users can delete their own data
    Permission.read(Role.team('admin')),        // Admins can read all user data
    Permission.update(Role.team('admin')),      // Admins can update all user data
    Permission.delete(Role.team('admin'))       // Admins can delete all user data
  ]);
  console.log('User collection created');

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, userCollection, 'user_id', 100, true, '', true),
    databases.createStringAttribute(db, userCollection, 'first_name', 100, true),
    databases.createStringAttribute(db, userCollection, 'last_name', 100, true),
    databases.createStringAttribute(db, userCollection, 'email', 100, true),
    databases.createStringAttribute(db, userCollection, 'password', 100, true, '', false, true),
    databases.createEnumAttribute(db, userCollection, 'role', ['admin', 'user'], false, 'user'),
    databases.createStringAttribute(db, userCollection, 'avatar', 100, false),
    databases.createStringAttribute(db, userCollection, 'phone', 100, true),
    databases.createStringAttribute(db, userCollection, 'address', 100, true),
    databases.createEnumAttribute(db, userCollection, 'age', ['18-25', '26-35', '36-45', '46 and +'], true, '18-25'),
    databases.createEnumAttribute(db, userCollection, 'gender', ['male', 'female'], true),
    databases.createEnumAttribute(db, userCollection, 'categories', ['student', 'job seeker', 'employer'], true)
  ]);

  // Add attributes specific to the 'student' category
  await Promise.all([
    databases.createEnumAttribute(db, userCollection, 'education_level', ['High School', 'Bachelor’s', 'Master’s'], false),
    databases.createStringAttribute(db, userCollection, 'institution_name', 100, false),
    databases.createStringAttribute(db, userCollection, 'major_subject', 100, false),
    databases.createIntegerAttribute(db, userCollection, 'expected_graduation_year', false)
  ]);

  // Add attributes specific to the 'job seeker' category
  await Promise.all([
    databases.createStringAttribute(db, userCollection, 'resume_link', 255, false),
    databases.createStringAttribute(db, userCollection, 'desired_job_title', 100, false),
    databases.createIntegerAttribute(db, userCollection, 'work_experience_years', false),
    databases.createStringAttribute(db, userCollection, 'skills', 255, false),
    databases.createEnumAttribute(db, userCollection, 'availability_status', ['immediately available', 'open to opportunities'], false)
  ]);

  // Add attributes specific to the 'employer' category
  await Promise.all([
    databases.createStringAttribute(db, userCollection, 'company_name', 100, false),
    databases.createEnumAttribute(db, userCollection, 'company_size', ['1-10 employees', '11-50 employees', '51-200 employees', '201-500 employees', '501+ employees'], false),
    databases.createStringAttribute(db, userCollection, 'industry', 100, false),
    databases.createStringAttribute(db, userCollection, 'position_in_company', 100, false),
    databases.createIntegerAttribute(db, userCollection, 'job_posting_count', false)
  ]);
}