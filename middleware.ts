/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import getOrCreateDB from './models/server/seed';
import { getSession } from './lib/actions/user.actions';
import setupStorage from './models/server/storageSetup';
import courseStorage from './models/server/courseStorage';

let dbPromise: Promise<any> | null = null;

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  // Initialize DB and Storage only once
  if (!dbPromise) {
    dbPromise = getOrCreateDB();
    // Ensure storage setup is done asynchronously if needed
    await setupStorage();
    await courseStorage();
  }

  // Wait for DB and Storage initialization to complete
  await dbPromise;

  // Example: Check if the user is authenticated using the session from cookies
  const session = await getSession(); // Ensure getSession takes the request to fetch session from cookies or headers

  const url = request.nextUrl.pathname;

  // Redirect unauthenticated users to login if they are trying to access the dashboard
  if (url.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL('/', request.url); // Change this to your login page
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Matching Paths Configuration
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // This matches everything except API and static files
    "/dashboard/:path*" // This matches all routes starting with /dashboard
  ],
}
