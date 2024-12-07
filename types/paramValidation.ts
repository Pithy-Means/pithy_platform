// import { z } from "zod";

// // Zod schema for Appwrite permission strings
// const appwritePermissionSchema = z.string().regex(
// //   /^(Role\.(any|user\([a-zA-Z0-9_.-]{1,36}\)|team\([a-zA-Z0-9_.-]{1,36}\)))$/,
// /^Permission\.(read|write|update|delete)\((Role\.(user\([a-zA-Z0-9_.-]+\))|team\([a-zA-Z0-9_.-]+\))\)$/,
//   "Invalid permission string."
// );

// // Function to validate all permissions
// const validatePermissions = (permissions: string[]) => {
//   permissions.forEach((permission) => {
//     try {
//         appwritePermissionSchema.parse(permission); // Throws error if invalid

//     } catch (error) {
//       console.error(`Invalid permission: ${permission}`);
//       throw new Error("Invalid permission string.");
//     }
//   });
// };

// export default validatePermissions;