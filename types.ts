import React from 'react';

export interface CheatsheetItem {
  typed: string;
  publishedExample: string;
  typedNotes?: React.ReactNode;
}

export interface HeaderInfo {
  level: number;
  text: string;
  id: string;
}

export interface PasteData {
  _id?: string; // MongoDB ObjectId as string
  id: string; // Unique internal ID, can be same as urlSegment if custom
  urlSegment: string; // User-facing URL part, must be unique
  content: string;
  editCode?: string; 
  hasEditCode?: boolean; // Indicates if paste is protected without revealing the code
  createdAt: number; 
  updatedAt: number; 
}

export interface ApiError {
  message: string;
  type?: 'NotFound' | 'Conflict' | 'Authentication' | 'Generic';
}

export interface AppContextType {
  currentPaste: PasteData | null;
  isLoading: boolean; // General loading for current paste or global action
  isSaving: boolean; // Specific for save/update operations
  error: ApiError | null;
  getPaste: (urlSegment: string) => Promise<PasteData | null>;
  addPaste: (paste: Omit<PasteData, '_id' | 'id' | 'createdAt' | 'updatedAt'> & { urlSegment?: string, content: string, editCode?: string }) => Promise<PasteData | null>;
  updatePaste: (urlSegment: string, content: string, currentEditCode?: string, newEditCode?: string) => Promise<PasteData | null>;
  // deletePaste is not implemented in UI, so skipping for now
  clearError: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// For router
export type RouteParams = Record<string, string>;
export type CurrentRoute = {
  path: string;
  params: RouteParams;
  component: React.ComponentType<any>;
};