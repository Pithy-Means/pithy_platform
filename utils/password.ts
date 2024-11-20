import { Client, Databases } from 'appwrite';
import bcrypt from 'bcryptjs'; // For hashing the new password

// Initialize Appwrite client
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT as string) // Your Appwrite endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID as string); // Your Appwrite project ID

const databases = new Databases(client);

/**
 * Verify a reset token and retrieve the associated email address.
 * @param token The reset token to verify.
 * @returns The user's email if the token is valid, or null if invalid or expired.
 */
export const verifyResetToken = async (token: string): Promise<string | null> => {
    try {
        const resetDoc = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID as string,
            'password_resets', // Collection ID
            token
        );

        if (resetDoc.expiresAt < Date.now()) {
            return null; // Token has expired
            console.log('Token has expired');
        }

        return resetDoc.email; // Return the associated email
    } catch {
        return null; // Token is invalid or does not exist
    }
};


/**
* Hash a plaintext password.
* @param password The plaintext password to hash.
* @returns The hashed password.
*/
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};


/**
* Update the user's password in the database.
* @param email The user's email address.
* @param hashedPassword The hashed password to set.
*/
export const updateUserPassword = async (email: string, hashedPassword: string): Promise<void> => {
    await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        'users', // Your user collection ID
        email,   // Document ID is assumed to be the user's email
        { password: hashedPassword }
    );
};