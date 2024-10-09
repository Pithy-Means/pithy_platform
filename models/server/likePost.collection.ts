import { Permission, Role } from 'node-appwrite';
import { db, likePostCollection } from '../name';
import { databases } from './config';

export default async function createLikePostCollection() {
  // Create a new collection
  await databases.createCollection(db, likePostCollection, likePostCollection, [
    Permission.create(Role.team('admin')),     // Admins create
    Permission.read(Role.users()),             // Regular users can read their own data
    Permission.update(Role.user('user')),      // Regular users can update their own data
    Permission.delete(Role.user('user')),      // Regular users can delete their own data
    Permission.update(Role.team('admin')),     // Admins can update
    Permission.delete(Role.team('admin')),     // Admins can delete
    Permission.read(Role.team('admin'))        // Admins can read all user data
  ]);
  console.log('Like post collection created');

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, likePostCollection, 'user_id', 100, true),
    databases.createStringAttribute(db, likePostCollection, 'post_id', 100, true),
    databases.createBooleanAttribute(db, likePostCollection, '👍', false),
    databases.createStringAttribute(db, likePostCollection, 'created_at', 100, false),
    databases.createStringAttribute(db, likePostCollection, 'updated_at', 100, false)
  ]);
}