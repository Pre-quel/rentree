import type { PasteData } from '../types';

// const PASTE_STORAGE_KEY = 'rentryClonePastes'; // No longer used

// export const loadPastesFromStorage = (): Record<string, PasteData> => { // No longer used
//   return {};
// };

// export const savePastesToStorage = (pastes: Record<string, PasteData>): void => { // No longer used
// };

export const generateRandomId = (length: number = 6): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Validate custom URL segment (slug-like)
export const isValidUrlSegment = (segment: string): boolean => {
  if (!segment) return true; // Empty is fine, will generate ID by backend or client before API call
  return /^[a-zA-Z0-9_-]+$/.test(segment) && segment.length <= 50;
};