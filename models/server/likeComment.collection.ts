import { Permission, Role } from 'node-appwrite';
import { db, likeCommentCollection } from '../name';
import { databases } from './config';

export default async function createLikeCommentCollection() {
  // Create a new collection
  await databases.createCollection(db, likeCommentCollection, likeCommentCollection, [
    Permission.create(Role.team('admin')),     // Admins create
    Permission.read(Role.users()),             // Regular users can read their own data
    Permission.update(Role.user('user')),      // Regular users can update their own data
    Permission.delete(Role.user('user')),      // Regular users can delete their own data
    Permission.update(Role.team('admin')),     // Admins can update
    Permission.delete(Role.team('admin')),     // Admins can delete
    Permission.read(Role.team('admin'))        // Admins can read all user data
  ]);
  console.log('Like comment collection created');

  // Create common attributes
  await Promise.all([
    databases.createStringAttribute(db, likeCommentCollection, 'like_comment_id', 100, true),
    databases.createStringAttribute(db, likeCommentCollection, 'user_id', 100, true),
    databases.createStringAttribute(db, likeCommentCollection, 'post_id', 100, true),
    databases.createStringAttribute(db, likeCommentCollection, 'comment_id', 100, true),
    databases.createBooleanAttribute(db, likeCommentCollection, '👍', false),
    databases.createStringAttribute(db, likeCommentCollection, 'created_at', 100, false),
    databases.createStringAttribute(db, likeCommentCollection, 'updated_at', 100, false)
  ]);
}