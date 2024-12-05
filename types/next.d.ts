// types/next.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    user?: string; // You can specify the type based on the expected user object. For example, string for user ID.
  }
}
