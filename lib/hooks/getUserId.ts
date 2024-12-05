import { createSessionClient } from '@/utils/appwrite';  // Assuming you have a function to create the client
import { NextApiRequest, NextApiResponse} from 'next';
import { parseCookies } from 'nookies'; // For cookie parsing

const authenticateSessionToken = async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  try {
    // Parse the cookies from the request
    const cookies = parseCookies({ req }); // Parse the cookies from the request
    const token = cookies.authToken; // Get the session token from the cookie

    if (!token) {
      return res.status(401).json({ message: 'No token provided. Please log in.' });
    }

    // Create the client for your authentication service (Appwrite or other)
    const { account } = await createSessionClient();

    // Verify the session using the session token
    const session = await account.getSession('current'); // You may need to adjust this based on your auth service's method

    if (!session || session.$id !== token) {
      return res.status(401).json({ message: 'Invalid session. Please log in again.' });
    }

    // Optionally, you can store the session or user info in `req.user`
    req.user = session.userId; 
    // res.status(200).json({message: 'Authentication successful', userId: session.userId}); // Return the user ID or other info
    next(); // Proceed to the next middleware or route handler
    

  } catch (error) {
    console.error('Session validation failed:', error);

    // Handle specific errors or return a generic message
    return res.status(401).json({ message: 'Failed to authenticate session.' });
  }
};

export default authenticateSessionToken;


