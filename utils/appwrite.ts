'use server';
import env from "@/env";
import { Client, Databases, Account, Users, Storage } from "node-appwrite";
import { cookies } from "next/headers";

export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId);
    

  const session = cookies().get("authToken");
  // console.log("Session cookie value:", session?.value);

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  // Check if the session is valid
  const account = new Account(client);
  try {
    // Validate the session to get the user details
    const user = await account.get();
    console.log("Session is valid for user:", user);
  } catch (error) {
    console.error("Session is invalid:", error);
    throw new Error("Invalid or expired session token");
  }

  return {
    get account() {
      // return new Account(client);
      return account;
    },
  };
}

// export const createAdminClient = async() => {
//   const client = new Client();
//   client
//     .setEndpoint(env.appwrite.endpoint)
//     .setProject(env.appwrite.projectId)
//     .setKey(env.appwrite.apiKey);

//     // console.log('Appwrite client created', client);
  
//   return {
//     client: client,
//     get account() {
//       return new Account(client);
//     },
//     get databases() {
//       return new Databases(client);
//     },
//     get users() {
//       return new Users(client);
//     },
//     get storage() {
//       return new Storage(client);
//     },
//   };
// };

export const createAdminClient = async() => {
  const client = new Client();
  client
    .setEndpoint(env.appwrite.endpoint)
    .setProject(env.appwrite.projectId)
    .setKey(env.appwrite.apiKey);

    // console.log('Appwrite client created', client);
    const utils = {
      account: new Account(client),
      databases: new Databases(client),
      users: new Users(client),
      storage: new Storage(client),
    };
  
  return {client, ...utils};
}

// Explicitly export Account and other utilities if needed
// export { Account, Databases, Users, Storage };
