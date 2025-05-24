import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import NotFoundView from './NotFoundView';
import type { PasteData } from '../types';

interface RawViewProps {
  pasteId: string; // Provided by router
}

const RawView: React.FC<RawViewProps> = ({ pasteId }) => {
  const context = useContext(AppContext);
  const [currentViewPaste, setCurrentViewPaste] = useState<PasteData | null>(null);
  const [isViewLoading, setIsViewLoading] = useState(true);
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    if (!context) return;
    setIsViewLoading(true);
    context.clearError();

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

  if (isViewLoading || context.isLoading) {
    return <div className="text-center p-8">Loading paste...</div>;
  }
  
  if (context.error && context.error.type === 'NotFound') {
     return <NotFoundView customMessage={`Raw content for paste ID "${pasteId}" not found. ${context.error.message}`} />;
  }
  if (context.error) {
    return <div className="text-center p-8 text-red-500">Error: {context.error.message}</div>;
  }
  if (!currentViewPaste) {
    return <NotFoundView customMessage={`Raw content for paste ID "${pasteId}" not found.`} />;
  }

  const paste = currentViewPaste;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); 
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('Failed to copy content to clipboard.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 break-all">
            Raw: {paste.urlSegment}
            </h1>
            <a 
                href={`#/${pasteId}`} 
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
                &larr; Back to rendered view
            </a>
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
      </div>
      <pre className="w-full p-3 sm:p-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-md overflow-x-auto text-sm whitespace-pre-wrap break-all font-mono">
        {paste.content}
      </pre>
    </div>
  );
};

export default RawView;