import { IndexType, Permission, Role } from "node-appwrite";
import { db, userCollection } from "../name";
import { databases } from "./config";

export default async function createUserCollection() {
  // Create a new collection
  await databases.createCollection(db, userCollection, userCollection, [
    Permission.create(Role.any()), // Anyone can create
    Permission.read(Role.user("user")), // Regular users can read their own data
    Permission.update(Role.user("user")), // Regular users can update their own data
    Permission.delete(Role.user("user")), // Regular users can delete their own data
    Permission.read(Role.team("admin")), // Admins can read all user data
    Permission.update(Role.team("admin")), // Admins can update all user data
    Permission.delete(Role.team("admin")), // Admins can delete all user data
  ]);
  console.log("User collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      userCollection,
      "user_id",
      40,
      true,
    ),
    databases.createStringAttribute(
      db,
      userCollection,
      "firstname",
      100,
      true,
    ),
    databases.createStringAttribute(db, userCollection, "lastname", 100, true),
    databases.createStringAttribute(db, userCollection, "email", 100, true),
    databases.createStringAttribute(
      db,
      userCollection,
      "password",
      100,
      true,
    ),
    databases.createEnumAttribute(
      db,
      userCollection,
      "role",
      ["admin", "user"],
      false,
      "user",
    ),
    databases.createStringAttribute(db, userCollection, "avatar", 100, false),
    databases.createStringAttribute(db, userCollection, "phone", 100, true),
    databases.createStringAttribute(db, userCollection, "address", 100, true),
    databases.createEnumAttribute(
      db,
      userCollection,
      "age",
      ["18-25", "26-35", "36-45", "46 and +"],
      true
    ),
    databases.createEnumAttribute(
      db,
      userCollection,
      "gender",
      ["male", "female"],
      true,
    ),
    databases.createEnumAttribute(
      db,
      userCollection,
      "categories",
      ["student", "job seeker", "employer"],
      true,
    ),

    databases.createEnumAttribute(
      db,
      userCollection,
      "education_level",
      ["Tertiary", "High School", "Bachelor’s", "Diploma", "Master’s", "PhD"],
      false,
    ),
    databases.createStringAttribute(
      db,
      userCollection,
      "institution_name",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      userCollection,
      "major_subject",
      100,
      false,
    ),
    databases.createIntegerAttribute(
      db,
      userCollection,
      "expected_graduation_year",
      false,
    ),

    databases.createStringAttribute(
      db,
      userCollection,
      "desired_job_title",
      100,
      false,
    ),
    databases.createStringAttribute(db, userCollection, "skills", 255, false),
    databases.createStringAttribute(
      db,
      userCollection,
      "years_of_work_experience",
      5,
      false,
    ),
    databases.createStringAttribute(
      db,
      userCollection,
      "resume_link",
      255,
      false,
    ),
    databases.createEnumAttribute(
      db,
      userCollection,
      "availability_status",
      ["immediately available", "open to opportunities"],
      false,
    ),

    databases.createStringAttribute(
      db,
      userCollection,
      "company_name",
      100,
      false,
    ),
    databases.createEnumAttribute(
      db,
      userCollection,
      "company_size",
      [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "501+ employees",
      ],
      false,
    ),
    databases.createStringAttribute(
      db,
      userCollection,
      "industry_type",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      userCollection,
      "position_in_company",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      userCollection,
      "job_posting_count",
      5,
      false,
    ),
  ]);
}
