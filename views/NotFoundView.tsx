import React from 'react';

interface NotFoundViewProps {
  customMessage?: string;
  message?: string; // Allow generic message too, for router fallback
}

const NotFoundView: React.FC<NotFoundViewProps> = ({ customMessage, message }) => {
  const displayMessage = customMessage || message || "The page or paste you're looking for doesn't exist.";
  return (
    <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <svg className="mx-auto h-16 w-16 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H9.5a1 1 0 00-1 1v1.5M13 16V6a1 1 0 011-1H15.5a1 1 0 011 1v1.5" /> {/* Custom path for a 'lost' look */}
      </svg>
      <h1 className="mt-6 text-2xl font-bold text-gray-800 dark:text-gray-100">Oops! Not Found</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-300">{displayMessage}</p>
      <a
        href="#/new"
        className="mt-8 inline-block px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
      >
        Create a New Paste
      </a>
    </div>
  );
};

export default NotFoundView;
