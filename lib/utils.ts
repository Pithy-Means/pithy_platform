import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const generateValidPostId = (post_id?: string): string => {
  const isValidPostId = post_id && /^[a-zA-Z0-9._-]{1,36}$/.test(post_id);
  return isValidPostId ? post_id : uuidv4();
};