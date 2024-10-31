import type { NextApiRequest, NextApiResponse } from 'next';
import { Client, Databases, Query} from 'appwrite';
import sgMail from '@sendgrid/mail';


// Initialize Appwrite client
const client = new Client();
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string) // Your Appwrite endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID as string); // Your Appwrite project ID

// const account = new Account(client);
const databases = new Databases(client);

// Initialize SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string); // Your SendGrid API Key

// Function to check if the user exists
const userExists = async (email: string): Promise<boolean> => {
  try {
    // const users = await account.list();
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID as string,
      'users' // Your user collection
      [Query.equal('email', email)]
    );
    // return users.users.some(user => user.email === email);
    return response.documents.length > 0;
  } catch (error) {
    throw new Error('Unable to check user existence');
  } finally {
    return false;
  }
};

const sendResetLink = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      // Check if the user exists in the database
      const exists = await userExists(email);
      if (!exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate a unique reset token (you can implement your own token generation)
      const resetToken = Math.random().toString(36).substring(2, 15);

      // Store the reset token in the database with an expiration time (e.g., 1 hour)
      const expirationTime = Date.now() + 3600000; // 1 hour in milliseconds
      await databases.createDocument(
        process.env.APPWRITE_DATABASE_ID as string,
        'password_resets', // Collection ID for password reset tokens
        resetToken, // Document ID
        { email, token: resetToken, expiresAt: expirationTime }
      );

      // Construct the reset link
      const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

      // Send the reset email
      const msg = {
        to: email,
        from: 'no-reply@yourdomain.com', // Use your verified SendGrid domain
        subject: 'Password Reset Request',
        text: `Click this link to reset your password: ${resetLink}`,
        html: `<strong>Click this link to reset your password:</strong> <a href="${resetLink}">${resetLink}</a>`,
      };

      await sgMail.send(msg);

      return res.status(200).json({ message: 'Reset link sent to your email.' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message || 'An error occurred.' });
      }
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

export default sendResetLink;
