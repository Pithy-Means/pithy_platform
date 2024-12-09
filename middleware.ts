/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import getOrCreateDB from './models/server/seed';
import { getLoggedInUser, getSession } from './lib/actions/user.actions';
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

  // Example: Check if the user is authenticated using the session from cookies or headers
  const session = await getSession(); // Ensure getSession takes the request to fetch session from cookies or headers
  const user = await getLoggedInUser();
  const url = request.nextUrl.pathname;

  // 1. Restrict access to `/dashboard` for unauthenticated users
  if (url.startsWith("/dashboard")) {
    if (!session) {
      const backUrl = new URL('/', request.url); // Redirect to the homepage (or login page)
      return NextResponse.redirect(backUrl);
    }
  }

  // 2. Restrict access to admin-only pages for non-admin users
  if (url.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL('/login', request.url); // Redirect to login if not logged in
      return NextResponse.redirect(loginUrl);
    }

    // Check if the user has an admin role
    if (!user || user.role !== 'admin') {
      const forbiddenUrl = new URL('/403', request.url); // Redirect to a "403 Forbidden" page
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  return NextResponse.next();
}

// Matching Paths Configuration
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // This matches everything except API and static files
    "/dashboard/:path*", // This matches all routes starting with /dashboard
    "/admin/:path*" // This matches all routes starting with /admin
  ],
}
