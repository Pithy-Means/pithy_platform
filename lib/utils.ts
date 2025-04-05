import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a unique referral code for users
export const generateReferralCode = (length: number = 40): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function parseStringify(data: unknown) {
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
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
  return data;
};

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

// Define this helper function elsewhere in your code
export function formatDateWithOrdinal(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Add ordinal suffix to the day
  const ordinal = getOrdinalSuperscript(day);

  // Using HTML for superscript formatting
  return `${day}${ordinal}, ${month}/${year}`;
}

// Helper function to get the correct ordinal suffix
function getOrdinalSuperscript(day: number): string {
  // Determine the ordinal suffix
  let suffix = 'th';
  if (day % 10 === 1 && day % 100 !== 11) {
    suffix = 'st';
  } else if (day % 10 === 2 && day % 100 !== 12) {
    suffix = 'nd';
  } else if (day % 10 === 3 && day % 100 !== 13) {
    suffix = 'rd';
  }
  
  // Convert to Unicode superscript
  return suffix
    .replace('t', 'ᵗ')
    .replace('s', 'ˢ')
    .replace('n', 'ⁿ')
    .replace('r', 'ʳ')
    .replace('d', 'ᵈ')
    .replace('h', 'ʰ');
}
