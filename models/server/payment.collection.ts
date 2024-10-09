import { Permission, Role } from 'node-appwrite';
import { db, paymentCollection } from '../name';
import { databases } from './config';

export default async function createPaymentCollection() {
  // Create a new collection
  await databases.createCollection(db, paymentCollection, paymentCollection, [
    Permission.create(Role.users()),             // Regular users can create their own data
    Permission.update(Role.team('admin')),     // Admins can update their own data
    Permission.delete(Role.team('admin')),     // Admins can delete their own data
    Permission.read(Role.team('admin'))        // Admins can read all user data
  ]);
  console.log('Payment collection created');

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, paymentCollection, 'user_id', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'course_id', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'payment_id', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'payment_status', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'payment_method', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'payment_amount', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'payment_currency', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'payment_description', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'payment_receipt', 100, true),
    databases.createStringAttribute(db, paymentCollection, 'created_at', 100, false),
    databases.createStringAttribute(db, paymentCollection, 'updated_at', 100, false)
  ]);
}