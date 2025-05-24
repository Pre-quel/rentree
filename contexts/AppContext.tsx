import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AppContextType, PasteData, ApiError } from '../types';
import { fetchPasteFromAPI, savePasteToAPI, updatePasteInAPI } from '../services/api';
import { generateRandomId } from '../services/pasteStore'; // For client-side ID generation if needed

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPaste, setCurrentPaste] = useState<PasteData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // For fetching
  const [isSaving, setIsSaving] = useState(false); // For add/update
  const [error, setError] = useState<ApiError | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load dark mode preference (no changes here)
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (darkModePreference === 'false') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
      }
      return newMode;
    });
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const getPaste = useCallback(async (urlSegment: string): Promise<PasteData | null> => {
    setIsLoading(true);
    setError(null);
    setCurrentPaste(null); 
    const response = await fetchPasteFromAPI(urlSegment);
    setIsLoading(false);
    if ('error' in response) {
      setError(response.error);
      return null;
    }
    setCurrentPaste(response);
    return response;
  }, []);

  const addPaste = useCallback(async (
    pasteDraft: Omit<PasteData, '_id' | 'id' | 'createdAt' | 'updatedAt'> & { urlSegment?: string, content: string, editCode?: string }
  ): Promise<PasteData | null> => {
    setIsSaving(true);
    setError(null);
    
    const payload = {
        ...pasteDraft,
        urlSegment: pasteDraft.urlSegment || generateRandomId() // Ensure urlSegment is present
    };

    const response = await savePasteToAPI(payload);
    setIsSaving(false);
    if ('error' in response) {
      setError(response.error);
      return null;
    }
    // setCurrentPaste(response); // Optionally set current paste after creation
    return response;
  }, []);

  const updatePaste = useCallback(async (
    urlSegment: string, 
    content: string, 
    currentEditCodeAttempt?: string, 
    newEditCode?: string
  ): Promise<PasteData | null> => {
    setIsSaving(true);
    setError(null);
    const response = await updatePasteInAPI(urlSegment, content, currentEditCodeAttempt, newEditCode);
    setIsSaving(false);
    if ('error' in response) {
      setError(response.error);
      return null;
    }
    setCurrentPaste(response); // Update current paste with new data
    return response;
  }, []);

  const contextValue: AppContextType = {
    currentPaste,
    isLoading,
    isSaving,
    error,
    getPaste,
    addPaste,
    updatePaste,
    clearError,
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};