import { Permission, Role } from "node-appwrite";
import { db, paymentCollection } from "../name";
import { databases } from "./config";

export default async function createPaymentCollection() {
  // Create a new collection
  await databases.createCollection(db, paymentCollection, paymentCollection, [
    Permission.create(Role.users()), // Regular users can create their own data
    Permission.update(Role.team("admin")), // Admins can update their own data
    Permission.delete(Role.team("admin")), // Admins can delete their own data
    Permission.read(Role.team("admin")), // Admins can read all user data
  ]);
  console.log("Payment collection created");

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(
      db,
      paymentCollection,
      "payment_id",
      100,
      false,
    ), // Payment ID
    databases.createStringAttribute(
      db,
      paymentCollection,
      "user_id",
      100,
      false,
    ), // User ID
    databases.createStringAttribute(
      db,
      paymentCollection,
      "status",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "network",
      100,
      false,
    ),
    databases.createIntegerAttribute(
      db,
      paymentCollection, "amount", false
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "currency",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "tx_ref",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "phone_number",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "email",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "method",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "course_choice",
      100,
      false,
    ),
    databases.createBooleanAttribute(
      db,
      paymentCollection,
      "checked",
      false,
      false
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "name",
      100,
      false,
    ),
    databases.createStringAttribute(
      db,
      paymentCollection,
      "customer_referral_code",
      100,
      false,
    ),
  ]);
}
