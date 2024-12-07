import { createSessionClient } from '@/utils/appwrite';  // Assuming you have a function to create the client
// import { NextRequest} from 'next/server';
// import { parseCookies } from 'nookies'; // For cookie parsing
import { cookies} from 'next/headers'
import { NextRequest, NextResponse } from 'next/server';

type AuthResult = 
| { status: 200; userId: string} 
| { status: 401; message: string};

const authenticateSessionToken = async (): Promise <AuthResult> => {
  try {
    // Parse the cookies from the request
    // const cookies = parseCookies({  }); // Parse the cookies from the request
    // const token = cookies.authToken; // Get the session token from the cookie

    // if (!token) {
    //   return { status: 401, message: 'No token provided. Please log in.' };
    //   // return { status: 401, message: 'No token provided. Please log in.' };
    // }
    const authToken = cookies().get('authToken')?.value;
    if (!authToken) {
      return { status: 401, message: 'No token provided. Please log in.' };
    }

    // Create the client for your authentication service (Appwrite or other)
    const { account } = await createSessionClient();

    // Verify the session using the session token
    const session = await account.getSession(authToken); // You may need to adjust this based on your auth service's method

    if (!session || session.secret !== authToken) {
      return { status: 401, message: 'Invalid session. Please log in again.' };
    }
    // Optionally, you can store the session or user info in `req.user`
    // req.user = session.userId; 
    return { status: 200, userId: session.userId }; 
  } catch (error) {
    console.error('Session validation failed:', error);
    return { status: 401, message: 'Failed to authenticate session.' };
  }
};

export default authenticateSessionToken;


// Refreshing the session
export const refreshSession = async (req: NextRequest, res: NextResponse) => {
  try {
    const authToken = cookies().get('authToken')?.value; // Get the session token from the cookie
    if (!authToken) {
      return NextResponse.json({ message: 'Token not found.' }, { status: 401 });
    }
    const { account } = await createSessionClient();
    const session = await account.getSession(authToken);
    if (!session || session.secret !== authToken) {
      return NextResponse.json({ message: 'Invalid session. Please log in again.' }, { status: 401 });
    }
    const newSession = await account.getSession(authToken);
    res.cookies.set('authToken', newSession.secret, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 , // 1 hour
      // history: 1, // 1 hour
    });

  } catch (error) {
    console.error('Error refreshing session:', error);
    return NextResponse.json({ message: 'Failed to refresh session.' }, { status: 500 });
  }
};