import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../contexts/AppContext';
import type { PasteData } from '../types';
import { generateRandomId, isValidUrlSegment } from '../services/pasteStore';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

interface EditorViewProps {
  pasteId?: string; // Provided by router if editing
}

const EditorView: React.FC<EditorViewProps> = ({ pasteId }) => {
  const context = useContext(AppContext);
  const [content, setContent] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [editCode, setEditCode] = useState(''); // For new paste or changing existing
  const [currentEditCodeAttempt, setCurrentEditCodeAttempt] = useState(''); // For verifying edit code on existing pastes
  
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [originalPasteForEdit, setOriginalPasteForEdit] = useState<PasteData | null>(null);
  
  const [pageLoading, setPageLoading] = useState(true); // For initial load of paste data
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isAuthenticatedForEdit, setIsAuthenticatedForEdit] = useState(false);

  useEffect(() => {
    // Handle content for cloning from PasteViewerView
    const cloneContent = sessionStorage.getItem('cloneContent');
    if (window.location.hash.includes('?clone=true') && cloneContent) {
      setContent(cloneContent);
      sessionStorage.removeItem('cloneContent');
      // Remove ?clone=true from hash to prevent re-triggering
      window.history.replaceState(null, '', window.location.pathname + window.location.hash.split('?')[0]);
    }
  }, []);


  useEffect(() => {
    if (!context) return;
    context.clearError(); // Clear global errors when editor loads
    setFormError(null);
    setSuccessMessage(null);
    setPageLoading(true);

    if (pasteId) {
      setIsEditingMode(true);
      context.getPaste(pasteId).then(fetchedPaste => {
        if (fetchedPaste) {
          setOriginalPasteForEdit(fetchedPaste);
          setContent(fetchedPaste.content);
          setCustomUrl(fetchedPaste.urlSegment); // URL is not editable
          if (fetchedPaste.hasEditCode) {
            setIsAuthenticatedForEdit(false);
          } else {
            setIsAuthenticatedForEdit(true); // No edit code, authenticated by default
          }
        } else {
          // Paste not found via API, context.error will be set
          // Allow user to create new paste with this URL if they wish
          setCustomUrl(pasteId);
          setIsEditingMode(false); // Fallback to new paste mode, but prefill URL
          setIsAuthenticatedForEdit(true);
        }
        setPageLoading(false);
      });
    } else {
      // New paste mode
      setIsEditingMode(false);
      setOriginalPasteForEdit(null);
      setContent(sessionStorage.getItem('cloneContent') || ''); // Use cloned content if available
      if(sessionStorage.getItem('cloneContent')) sessionStorage.removeItem('cloneContent');
      setCustomUrl('');
      setEditCode('');
      setCurrentEditCodeAttempt('');
      setIsAuthenticatedForEdit(true); // New pastes don't need auth
      setPageLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasteId, context?.getPaste, context?.clearError]); // context itself is stable, getPaste is callback

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We'll verify the edit code when actually updating the paste
    setIsAuthenticatedForEdit(true);
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!context) return;
    context.clearError();
    setFormError(null);
    setSuccessMessage(null);

    if (isEditingMode && originalPasteForEdit && originalPasteForEdit.hasEditCode && !isAuthenticatedForEdit) {
        setFormError("Please enter the correct edit code to update this paste.");
        return;
    }

    let urlToUse = customUrl.trim();

    if (!isEditingMode) { // Creating new paste
      if (!isValidUrlSegment(urlToUse)) {
        setFormError("Custom URL has invalid characters or is too long. Use a-z, A-Z, 0-9, _, -.");
        return;
      }
      // If customUrl is empty, API or client will generate one (API preferred for uniqueness check)
    } else if (originalPasteForEdit) { // Editing existing paste
      urlToUse = originalPasteForEdit.urlSegment; // Ensure we use the original URL segment
    } else {
      setFormError("Cannot determine URL. Original paste data missing for edit.");
      return;
    }

    let result;
    if (isEditingMode && originalPasteForEdit) {
      result = await context.updatePaste(originalPasteForEdit.urlSegment, content, currentEditCodeAttempt, editCode.trim());
      if (result && !context.error) {
         setSuccessMessage('Paste updated successfully!');
         setOriginalPasteForEdit(result); // Update local original paste state
         setEditCode(''); // Clear new edit code field after successful update
      }
    } else { // Adding new paste
      const pasteDraft = {
        urlSegment: urlToUse || undefined, // Let API generate if empty
        content,
        editCode: editCode.trim() === '' ? undefined : editCode.trim(),
      };
      result = await context.addPaste(pasteDraft);
      if (result && !context.error) {
        setSuccessMessage(`Paste published successfully at #${result.urlSegment}`);
        window.location.hash = `#/${result.urlSegment}`;
        // Optionally clear form, but navigation handles it
      }
    }

    if (context.error) {
      setFormError(context.error.message);
    }
  };

  if (!context) return <div className="text-center p-8">Initializing context...</div>;
  if (pageLoading) return <div className="text-center p-8">Loading editor...</div>;
  
  // If editing a paste that requires an edit code and user is not yet authenticated
  if (isEditingMode && originalPasteForEdit && originalPasteForEdit.hasEditCode && !isAuthenticatedForEdit) {
    return (
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Edit Paste: {originalPasteForEdit.urlSegment}</h2>
        <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">This paste is protected. Enter the edit code to proceed.</p>
        <form onSubmit={handleAuthSubmit}>
          <div className="mb-4">
            <label htmlFor="currentEditCodeAttempt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Edit Code
            </label>
            <input
              type="password"
              id="currentEditCodeAttempt"
              value={currentEditCodeAttempt}
              onChange={(e) => setCurrentEditCodeAttempt(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          {(formError || context.error) && <p className="text-red-500 text-sm mb-3">{formError || context.error?.message}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  // Render editor form (for new paste or authenticated edit)
  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        {isEditingMode && originalPasteForEdit ? `Edit: ${originalPasteForEdit.urlSegment}` : 'Create New Paste'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="pasteContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Markdown Content
          </label>
          <textarea
            id="pasteContent"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={showPreview ? 10 : 20}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 ease-in-out font-mono text-sm"
            placeholder="Enter your markdown here..."
            required
            disabled={context.isSaving}
          />
        </div>

        <div className="flex justify-end">
            <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none"
                disabled={context.isSaving}
            >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
        </div>

        {showPreview && (
            <div className="mt-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Preview</h3>
                <div className="markdown-body prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                    <MarkdownRenderer content={content} />
                </div>
            </div>
        )}

        <div>
          <label htmlFor="customUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Custom URL (optional)
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-400 mr-1 hidden sm:inline">rentryclone.app/#/</span>
            <span className="text-gray-500 dark:text-gray-400 mr-1 sm:hidden"># /</span>
            <input
              type="text"
              id="customUrl"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="my-awesome-paste"
              disabled={isEditingMode || context.isSaving} 
              aria-describedby="customUrlHelp"
            />
          </div>
           <p id="customUrlHelp" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isEditingMode ? "URL cannot be changed after creation." : "Leave blank for a random URL. (a-z, A-Z, 0-9, _, -)"}
          </p>
        </div>

        <div>
          <label htmlFor="editCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {isEditingMode && originalPasteForEdit?.editCode ? 'Change Edit Code (optional)' : 'Set Edit Code (optional)'}
          </label>
          <input
            type="password"
            id="editCode"
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={isEditingMode && originalPasteForEdit?.editCode ? "Enter new code to change, or blank to keep current" : "Protect your paste from edits"}
            aria-describedby="editCodeHelp"
            disabled={context.isSaving}
          />
           <p id="editCodeHelp" className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {isEditingMode && originalPasteForEdit?.editCode ? "Leave blank to keep the current edit code. Enter a new code to change it. To remove, your API should handle an empty string submission." : "If set, this code will be required to edit the paste later."}
          </p>
        </div>
        
        {(formError || context.error) && <p className="text-red-500 dark:text-red-400 text-sm my-3 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">{formError || context.error?.message}</p>}
        {successMessage && <p className="text-green-600 dark:text-green-400 text-sm my-3 p-3 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-md">{successMessage}</p>}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          disabled={context.isSaving}
        >
          {context.isSaving ? 'Processing...' : (isEditingMode ? 'Update Paste' : 'Publish Paste')}
        </button>
      </form>
    </div>
  );
};

export default EditorView;