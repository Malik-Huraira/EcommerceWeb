import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Get the backend base URL for images
const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8081';

/**
 * Converts a relative image path to a full URL
 * Handles both relative paths (/uploads/...) and full URLs (https://...)
 */
export function getImageUrl(imagePath: string | undefined | null): string {
  if (!imagePath) {
    return '/placeholder.svg';
  }
  
  // Decode any unicode escape sequences
  let decodedPath = imagePath;
  try {
    // Handle JSON unicode escapes like \u0026
    if (imagePath.includes('\\u')) {
      decodedPath = JSON.parse(`"${imagePath}"`);
    }
  } catch {
    decodedPath = imagePath;
  }
  
  // If it's already a full URL, return as-is
  if (decodedPath.startsWith('http://') || decodedPath.startsWith('https://')) {
    return decodedPath;
  }
  
  // If it's a relative path starting with /uploads, prepend backend URL
  if (decodedPath.startsWith('/uploads')) {
    return `${BACKEND_URL}${decodedPath}`;
  }
  
  // For other relative paths, assume they're local
  return decodedPath;
}
