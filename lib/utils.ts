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



/**
 * Generates alternative spellings for a word to enable fuzzy search
 * @param word The original search term
 * @returns Array of alternative spellings including the original
 */
export function generateAlternativeSpellings(word: string) {
  if (!word || word.length < 3) return [word]; // Don't generate alternatives for very short words
  
  const alternatives = [word];
  
  // 1. Character swaps (e.g., "teh" instead of "the")
  for (let i = 0; i < word.length - 1; i++) {
    const swapped = word.substring(0, i) + 
                    word[i+1] + 
                    word[i] + 
                    word.substring(i+2);
    alternatives.push(swapped);
  }
  
  // 2. Missing characters (e.g., "progamming" instead of "programming")
  for (let i = 0; i < word.length; i++) {
    const missing = word.substring(0, i) + word.substring(i+1);
    alternatives.push(missing);
  }
  
  // 3. Extra character (common typos near the key on keyboard)
  // This is simplified, but you could expand with a full keyboard proximity map
  for (let i = 0; i <= word.length; i++) {
    // Only add a few common typos to keep the number of queries reasonable
    const charToCheck = word[Math.max(0, i-1)];
    if (charToCheck) {
      const adjacentChars = getAdjacentKeys(charToCheck);
      for (const adjacent of adjacentChars) {
        // Insert an adjacent character
        const withExtra = word.substring(0, i) + adjacent + word.substring(i);
        alternatives.push(withExtra);
      }
    }
  }
  
  // Return unique alternatives, limiting to a reasonable number
  // to avoid excessive database calls
  return [...new Set(alternatives)].slice(0, 5);
}

/**
 * Returns adjacent keys on a QWERTY keyboard for common typos
 */
export function getAdjacentKeys(char: string) {
  const keyboardMap = {
    'a': ['s', 'q', 'z'],
    'b': ['v', 'n', 'g', 'h'],
    'c': ['x', 'v', 'd', 'f'],
    'd': ['s', 'f', 'e', 'r', 'c', 'x'],
    'e': ['w', 'r', 'd', 'f', '3', '4'],
    'f': ['d', 'g', 'r', 't', 'c', 'v'],
    'g': ['f', 'h', 't', 'y', 'v', 'b'],
    'h': ['g', 'j', 'y', 'u', 'b', 'n'],
    'i': ['u', 'o', 'k', 'l', '8', '9'],
    'j': ['h', 'k', 'u', 'i', 'n', 'm'],
    'k': ['j', 'l', 'i', 'o', 'm'],
    'l': ['k', 'o', 'p'],
    'm': ['n', 'j', 'k'],
    'n': ['b', 'm', 'h', 'j'],
    'o': ['i', 'p', 'k', 'l', '9', '0'],
    'p': ['o', 'l', '0'],
    'q': ['w', 'a', '1', '2'],
    'r': ['e', 't', 'd', 'f', '4', '5'],
    's': ['a', 'd', 'w', 'e', 'z', 'x'],
    't': ['r', 'y', 'f', 'g', '5', '6'],
    'u': ['y', 'i', 'h', 'j', '7', '8'],
    'v': ['c', 'b', 'f', 'g'],
    'w': ['q', 'e', 'a', 's', '2', '3'],
    'x': ['z', 'c', 's', 'd'],
    'y': ['t', 'u', 'g', 'h', '6', '7'],
    'z': ['a', 'x', 's']
  };
  
  return keyboardMap[char.toLowerCase() as keyof typeof keyboardMap] || [];
}