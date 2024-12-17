import { Permission, Role } from "node-appwrite";
import { db, moduleCollection } from "../name";
import { databases } from "./config";

export default async function createModuleCollection() {
  await databases.createCollection(db, moduleCollection, moduleCollection, [
    Permission.create(Role.team("admin")),
    Permission.create(Role.users()),
    Permission.read(Role.users()),
    Permission.update(Role.user("user")),
    Permission.delete(Role.user("user")),
    Permission.delete(Role.team("admin")),
    Permission.read(Role.team("admin"))
  ]);

  console.log("Module collection created");
  
  await Promise.all([
    databases.createStringAttribute(db, moduleCollection, "module_id", 100, true),
    databases.createStringAttribute(db, moduleCollection, "course_id", 100, true),
    databases.createStringAttribute(db, moduleCollection, "module_title", 100, false),
    databases.createStringAttribute(db, moduleCollection, "module_description", 100000, false),
    databases.createStringAttribute(db, moduleCollection, "video", 10000, false),
    databases.createStringAttribute(db, moduleCollection, "module_duration", 100, false),
    databases.createStringAttribute(db, moduleCollection, "module_comment", 100, false),
    databases.createEnumAttribute(db, moduleCollection, "module_status", ["open", "closed"], false),
  ]);
};