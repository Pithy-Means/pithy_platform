import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs'; // For hashing the new password
import { databases } from '@/models/server/config';

const resetPassword = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { token, newPassword } = req.body;

    try {
      // Verify the token and get user email
      const resetDoc = await databases.getDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        'password_resets', // Collection ID
        token // Document ID (token)
      );

      // Check if the token is expired
      if (resetDoc.expiresAt < Date.now()) {
        return res.status(400).json({ error: 'Reset token has expired' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in Appwrite (you may need to adjust the document ID)
      await databases.updateDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        'users', // Your user collection
        resetDoc.email, // Assuming the document ID is the user's email
        { password: hashedPassword }
      );

      // Optionally, delete the reset document
      await databases.deleteDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        'password_resets',
        token
      );

      return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
      if (error instanceof Error) {
      return res.status(500).json({ error: error.message || 'An error occurred.' });
      }
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default resetPassword;
