import { db, referalCollection } from "../name";
import { databases } from "./config";

export const createReferalCollection = async () => {
  await databases.createCollection(
    db, referalCollection, referalCollection
  )

  await Promise.all([
    databases.createStringAttribute(db, referalCollection, "referal_id", 100, true),
    databases.createStringAttribute(db, referalCollection, "user_id", 100, true),
    databases.createStringAttribute(db, referalCollection, "code", 100, false),
    databases.createStringAttribute(db, referalCollection, "link", 100, false),
    databases.createStringAttribute(db, referalCollection, "bonus", 100, false),
    databases.createEnumAttribute(db, referalCollection, "status", ["active", "inactive"], false, "inactive"),
  ])
};