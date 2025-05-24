import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import NotFoundView from './NotFoundView';
import type { PasteData } from '../types';

interface PasteViewerViewProps {
  pasteId: string; // Provided by router
}

const PasteViewerView: React.FC<PasteViewerViewProps> = ({ pasteId }) => {
  const context = useContext(AppContext);
  const [currentViewPaste, setCurrentViewPaste] = useState<PasteData | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(true);
  
  const [editCodeAttempt, setEditCodeAttempt] = useState('');
  const [showEditCodePrompt, setShowEditCodePrompt] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  // isAuthenticatedForEdit is not really needed here, as edit button will ask for code if necessary on click


  useEffect(() => {
    if (!context) return;
    setIsViewLoading(true);
    setShowEditCodePrompt(false);
    setAuthError(null);
    context.clearError(); // Clear global error

    context.getPaste(pasteId)
      .then(fetchedPaste => {
        setCurrentViewPaste(fetchedPaste);
      })
      .finally(() => {
        setIsViewLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pasteId, context?.getPaste, context?.clearError]);


  if (!context) {
    return <div className="text-center p-8">Loading context...</div>;
  }

  if (isViewLoading || context.isLoading) { // Use both local view loading and global context loading
    return <div className="text-center p-8">Loading paste...</div>;
  }

  if (context.error && context.error.type === 'NotFound') {
     return <NotFoundView customMessage={`Paste with ID "${pasteId}" not found. ${context.error.message}`} />;
  }
  if (context.error) { // Other global errors from context during fetch
    return <div className="text-center p-8 text-red-500">Error: {context.error.message}</div>;
  }
  if (!currentViewPaste) { // Should be covered by above, but as a fallback
    return <NotFoundView customMessage={`Paste with ID "${pasteId}" not found.`} />;
  }
  
  const paste = currentViewPaste; // Use the fetched paste for rendering

  const handleEditClick = () => {
    if (paste.editCode) {
      setShowEditCodePrompt(true);
    } else {
      window.location.hash = `#/${pasteId}/edit`;
    }
  };

  const handleEditCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (paste.editCode && editCodeAttempt === paste.editCode) {
      // Simulate checking code then navigating. In a real app, edit view might re-auth.
      // For this simulation, we assume if it matches here, edit view will grant access.
      // A more robust way would be for the edit view to take the code attempt.
      setShowEditCodePrompt(false);
      window.location.hash = `#/${pasteId}/edit`;
    } else if (paste.editCode && editCodeAttempt !== paste.editCode) {
      setAuthError("Incorrect edit code.");
    } else { // No edit code, should not have shown prompt
      setShowEditCodePrompt(false);
      window.location.hash = `#/${pasteId}/edit`;
    }
  };

  const handleCloneAndEdit = () => {
    try {
      sessionStorage.setItem('cloneContent', paste.content);
      window.location.hash = '#/new?clone=true';
    } catch (e) {
      console.error("Error using sessionStorage for cloning:", e);
      alert("Could not clone paste due to browser storage limitations.");
    }
  };


  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 break-all">
          Viewing: {paste.urlSegment}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Created: {new Date(paste.createdAt).toLocaleString()} | Updated: {new Date(paste.updatedAt).toLocaleString()}
        </p>
        {paste._id && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">DB ID: {paste._id}</p> }
      </div>

      <div className="flex space-x-2 mb-6">
        <button
          onClick={handleEditClick}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
        >
          Edit
        </button>
        <a
          href={`#/${pasteId}/raw`}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
        >
          Raw
        </a>
        <button
          onClick={handleCloneAndEdit}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
        >
          Clone & Edit
        </button>
      </div>

      {showEditCodePrompt && (
        <form onSubmit={handleEditCodeSubmit} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Enter Edit Code</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">This paste is protected. Enter the edit code to modify it.</p>
          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={editCodeAttempt}
              onChange={(e) => { setEditCodeAttempt(e.target.value); setAuthError(null); }}
              className="flex-grow p-2 border border-gray-300 dark:border-gray-500 rounded-md dark:bg-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Edit code"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
            >
              Unlock
            </button>
          </div>
          {authError && <p className="text-red-500 text-sm mt-2">{authError}</p>}
        </form>
      )}

      <article className="markdown-body prose dark:prose-invert max-w-none prose-sm sm:prose-base">
        <MarkdownRenderer content={paste.content} />
      </article>
    </div>
  );
};

export default PasteViewerView;