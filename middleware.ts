import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import getOrCreateDB from './models/server/seed';
// import getOrCreateStorage from './models/server/storageSetup';
import { getSession } from './lib/actions/user.actions';

let dbPromise: Promise<any> | null = null;

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  if (!dbPromise) {
    dbPromise = getOrCreateDB();
  }
  
  // Initialize DB and Storage
  await dbPromise;
  
  // Example: Check if the user is authenticated (token in cookies)
  const session = await getSession();

  // If the user is authenticated, redirect to the dashboard
  const url = request.nextUrl.pathname;

  if (url.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL('/', request.url); // Change this to your login page
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", "/dashboard/:path*"
  ],
}
