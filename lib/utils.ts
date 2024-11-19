import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseStringify(data: unknown) {
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (err: unknown) {
      if (err instanceof Error){
        console.error("Error parsing JSON:", err.message);
      } else {
        console.error("Error parsing JSON: unknown error");
      }
      throw new Error("Failed to parse user data."); // Optional: throw an error if parsing fails
    }
  }
  return data; // Return data as is if already an object
}


export const generateValidPostId = (post_id?: string): string => {
  const isValidPostId = post_id && /^[a-zA-Z0-9._-]{1,36}$/.test(post_id);
  return isValidPostId ? post_id : uuidv4();
};