import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

// SVG Icons for Sun and Moon
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);


const Footer: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    // This should not happen if Footer is rendered within AppProvider
    return <footer className="text-center py-6 mt-8 border-t border-gray-200 dark:border-gray-700">Loading context...</footer>;
  }
  const { isDarkMode, toggleDarkMode } = context;

  return (
    <footer className="text-center py-6 mt-auto border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-4 relative">
        <nav className="space-x-2 sm:space-x-3 text-gray-500 dark:text-gray-400 text-sm">
          <a href="#/new" className="hover:underline">new</a>&middot;
          <a href="#/what" className="hover:underline">what</a>&middot;
          <a href="#/how" className="hover:underline">how</a>&middot;
          <a href="#/langs" className="hover:underline">langs</a>&middot;
          <a href="#/contacts" className="hover:underline">contacts</a>
        </nav>
        <button
          onClick={toggleDarkMode}
          title="Toggle dark/light mode"
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
         <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Rentry.co Clone - For demonstration purposes.
          </p>
      </div>
    </footer>
  );
};

export default Footer;
