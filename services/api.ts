import type { PasteData, ApiError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export const fetchPasteFromAPI = async (id: string): Promise<PasteData | { error: ApiError }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pastes/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        error: { 
          message: data.error || 'Failed to fetch paste', 
          type: response.status === 404 ? 'NotFound' : 'Generic' 
        } 
      };
    }
    
    // Transform backend response to match frontend expectations
    return {
      ...data.paste,
      id: data.paste._id,
      urlSegment: data.paste._id, // Map _id to urlSegment
      hasEditCode: data.paste.hasEditCode,
      createdAt: new Date(data.paste.createdAt).toISOString(),
      updatedAt: data.paste.updatedAt ? new Date(data.paste.updatedAt).toISOString() : undefined,
    };
  } catch (e: any) {
    console.error("Error fetching paste from API:", e);
    return { error: { message: e.message || 'Failed to fetch paste.', type: 'Generic' } };
  }
};

export const savePasteToAPI = async (
  paste: { content: string, editCode?: string, urlSegment?: string }
): Promise<PasteData | { error: ApiError }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pastes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: paste.content,
        editCode: paste.editCode,
        urlSegment: paste.urlSegment
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        error: { 
          message: data.error || 'Failed to save paste', 
          type: 'Generic' 
        } 
      };
    }
    
    // Transform backend response to match frontend expectations
    const pasteData = data.paste;
    return {
      ...pasteData,
      id: pasteData._id,
      urlSegment: pasteData._id, // Map _id to urlSegment
      createdAt: new Date(pasteData.createdAt).toISOString(),
      updatedAt: pasteData.updatedAt ? new Date(pasteData.updatedAt).toISOString() : undefined,
    };
  } catch (e: any) {
    console.error("Error saving paste to API:", e);
    return { error: { message: e.message || 'Failed to save paste.', type: 'Generic' } };
  }
};

export const updatePasteInAPI = async (
  id: string,
  content: string,
  editCode?: string,
  newEditCode?: string
): Promise<PasteData | { error: ApiError }> => {
  try {
    const requestBody: any = { content };
    
    // Only include editCode if it's provided and not empty
    if (editCode && editCode.trim() !== '') {
      requestBody.editCode = editCode;
    }
    
    // Only include newEditCode if it's provided and not empty
    if (newEditCode && newEditCode.trim() !== '') {
      requestBody.newEditCode = newEditCode;
    }
    
    const response = await fetch(`${API_BASE_URL}/pastes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { 
        error: { 
          message: data.error || 'Failed to update paste', 
          type: response.status === 403 ? 'Authentication' : 
                 response.status === 404 ? 'NotFound' : 'Generic' 
        } 
      };
    }
    
    // Transform backend response to match frontend expectations
    const pasteData = data.paste;
    return {
      ...pasteData,
      id: pasteData._id,
      urlSegment: pasteData._id, // Map _id to urlSegment
      createdAt: new Date(pasteData.createdAt).toISOString(),
      updatedAt: pasteData.updatedAt ? new Date(pasteData.updatedAt).toISOString() : undefined,
    };
  } catch (e: any) {
    console.error("Error updating paste in API:", e);
    return { error: { message: e.message || 'Failed to update paste.', type: 'Generic' } };
  }
};