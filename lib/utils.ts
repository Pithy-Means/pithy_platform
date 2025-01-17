import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseStringify(data: unknown) {
  if (data === undefined || data === null){
    console.error("Error: Input is undefined or null");
    throw new Error("Input data cannot be undefined or null.");
  }

  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error parsing JSON:", err.message);
      } else {
        console.error("Error parsing JSON: unknown error");
      }
      throw new Error("Failed to parse user data."); // Optional: throw an error if parsing fails
    }
  }
  return data; // Return data as is if already an object
}

export const parseString = (data: string) => {
  if (!data || typeof data !== "string") {
    console.error("Error: Input data is not a valid string.");
    return data;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return data;
  }
}

export const generateValidPostId = (post_id?: string): string => {
  const isValidPostId = post_id && /^[a-zA-Z0-9._-]{1,36}$/.test(post_id);
  return isValidPostId ? post_id : uuidv4();
};

export const generateValidId = () =>
  `${Date.now()}_${Math.random().toString(36).substr(2, 35)}`;

// Utility function to get the current date in ISO 8601 format
export const timeFetcher = (date: string, daysOffset: number): string => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + daysOffset);
  return newDate.toISOString(); // Ensure it returns the ISO string
};

