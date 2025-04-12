import { db, userProgressCollection } from "../name";
import { databases } from "./config";

export async function createUserProgress () {
  await databases.createCollection(db, userProgressCollection, userProgressCollection);
  console.log('User Progress Collection created!');

  await Promise.all([
    databases.createStringAttribute(
      db,
      userProgressCollection,
      "userProgress_id",
      100,
      true
    ),
    databases.createStringAttribute(
      db,
      userProgressCollection,
      "user_id",
      100,
      true
    ),
    databases.createStringAttribute(
      db,
      userProgressCollection,
      "module_id",
      100,
      true
    ),
    databases.createStringAttribute(
      db,
      userProgressCollection,
      "current_time",
      100,
      false
    ),
    databases.createStringAttribute(
      db,
      userProgressCollection,
      "last_updated",
      100,
      false
    ),
    databases.createBooleanAttribute(
      db,
      userProgressCollection,
      "completed",
      false
    )
  ])
}