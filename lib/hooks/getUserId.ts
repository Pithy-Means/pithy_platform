// import { createSessionClient } from '@/utils/appwrite';  // Assuming you have a function to create the client
// import { cookies } from 'next/headers'
// import { NextRequest, NextResponse } from 'next/server';


// export default async function authenticateSessionToken(req: NextRequest) {
//   try {
//     // Step1: Get the Authorization header from the request
//     const authHeader = req.headers.get('Authorization');
//     console.log('Raw Authorization Header:', authHeader);

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return { status: 401, message: 'Authorization header missing or malformed' };
//     }
//     console.log('Full headers:', req.headers);


//     // Step2: Extract the token from the Authorization header
//     // const authToken = authHeader.slice(7); // Remove 'Bearer ' from the token
//     let authToken = authHeader.split(' ')[1]; // Extract the token from the header
//     console.log('Extracted Auth Token (raw):', authToken);
//     // console.log('Auth token:', authToken);
//     // console.log('Extracted Auth Token:', authToken);
//     if (!authToken) {
//       return { status: 401, message: 'Token is missing from Authorization header.' };
//     }

//     // If token is an object, convert to string
//     if (typeof authToken !== 'string') {
//       authToken = String(authToken); // Ensure it's a string
//       console.warn('Auth Token was an object, converted to string:', authToken);
//     }

//     // Step3: Validate the token format
//     const validFormat = /^[a-zA-Z0-9._-]{1,256}$/;
//     if (!validFormat.test(authToken)) {
//       return { status: 401, message: 'Invalid session token format. Please log in again.' };
//     }

//     // Step4: Create the client for your authentication service (Appwrite or other)
//     const { account } = await createSessionClient();
//     console.log('Appwrite client initialized');

//     // Step5: Verify the session using the session token
//     const session = await account.getSession(authToken);
//     console.log('Session:', session);
//     if (!session || session.secret !== authToken) {
//       return { status: 401, message: 'Invalid session. Please log in again.' };
//     }

//     // Step6: Optionally, you can store the session or user info in `req.user`
//     if (session.expire && parseInt(session.expire) < Date.now() / 1000) {
//       return { status: 401, message: 'Session has expired. Please log in again.' };
//     }
//     console.log('Session validated:', session);

//     //Step7: req.user = session.userId;
//     return { status: 200, userId: session.userId };
//     console.log('Authenticated user ID:', session.userId);
//   } catch (error) {
//     console.error('Error validating session:', error);
//     return { status: 401, message: 'Failed to authenticate session.' };
//   }
// };

// // export default authenticateSessionToken;


// // Refreshing the session
// export const refreshSession = async (req: NextRequest, res: NextResponse) => {
//   try {
//     const authToken = cookies().get('authToken')?.value; // Get the session token from the cookie
//     if (!authToken) {
//       return NextResponse.json({ message: 'Token not found.' }, { status: 401 });
//     }
//     const { account } = await createSessionClient();
//     const session = await account.getSession(authToken);
//     if (!session || session.secret !== authToken) {
//       return NextResponse.json({ message: 'Invalid session. Please log in again.' }, { status: 401 });
//     }
//     const newSession = await account.getSession(authToken);
//     res.cookies.set('authToken', newSession.secret, {
//       path: '/',
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 60 * 60, // 1 hour
//       // history: 1, // 1 hour
//     });

//   } catch (error) {
//     console.error('Error refreshing session:', error);
//     return NextResponse.json({ message: 'Failed to refresh session.' }, { status: 500 });
//   }
// };
