import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import EditorView from './views/EditorView';
import PasteViewerView from './views/PasteViewerView';
import RawView from './views/RawView';
import CheatsheetView from './views/CheatsheetView';
import StaticPageView from './views/StaticPageView';
import NotFoundView from './views/NotFoundView';
import type { CurrentRoute, RouteParams } from './types';

const routes: Record<string, { component: React.ComponentType<any>, pattern: RegExp, keys: string[] }> = {
  new: { component: EditorView, pattern: /^\/?new\/?$/, keys: [] },
  how: { component: CheatsheetView, pattern: /^\/?how\/?$/, keys: [] },
  what: { component: () => <StaticPageView title="What is this?" content="This is a Rentry.co clone. It allows you to paste and share text/markdown snippets." />, pattern: /^\/?what\/?$/, keys: [] },
  langs: { component: () => <StaticPageView title="Supported Languages (Syntax Highlighting)" content="This clone supports basic syntax highlighting for common languages like Python, JavaScript, HTML, CSS, etc., via the markdown renderer." />, pattern: /^\/?langs\/?$/, keys: [] },
  contacts: { component: () => <StaticPageView title="Contacts" content="This is a demo project. No real contacts here!" />, pattern: /^\/?contacts\/?$/, keys: [] },
  viewPaste: { component: PasteViewerView, pattern: /^\/?([a-zA-Z0-9_-]+)\/?$/, keys: ['pasteId'] },
  editPaste: { component: EditorView, pattern: /^\/?([a-zA-Z0-9_-]+)\/edit\/?$/, keys: ['pasteId'] },
  rawPaste: { component: RawView, pattern: /^\/?([a-zA-Z0-9_-]+)\/raw\/?$/, keys: ['pasteId'] },
};

const parseRoute = (hash: string): CurrentRoute => {
  const path = hash.startsWith('#') ? hash.substring(1) : '/new'; // Default to /new
  
  for (const key in routes) {
    const route = routes[key];
    const match = route.pattern.exec(path);
    if (match) {
      const params: RouteParams = {};
      route.keys.forEach((paramName, index) => {
        params[paramName] = match[index + 1];
      });
      return { path, params, component: route.component };
    }
  }
  // Fallback to new if no hash or unknown
  if (path === '/' || path === '') return { path: '/new', params: {}, component: EditorView };

  // If path exists but doesn't match any route other than a potential paste ID that was not found
  if (/^\/?([a-zA-Z0-9_-]+)\/?$/.test(path) || 
      /^\/?([a-zA-Z0-9_-]+)\/(edit|raw)\/?$/.test(path)) {
    return { path, params: { pasteId: path.split('/')[1] }, component: NotFoundView }; // Specific NotFound for paste URLs
  }

  return { path, params: {}, component: () => <NotFoundView message="Page not found." /> }; // Generic NotFound
};


const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<CurrentRoute>(parseRoute(window.location.hash));

  const handleHashChange = useCallback(() => {
    setCurrentRoute(parseRoute(window.location.hash));
  }, []);

  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/new';
    } else {
      handleHashChange(); // Initial parse
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleHashChange]);

  const ActiveComponent = currentRoute.component;

  return (
    <AppProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto px-2 sm:px-4 py-8 w-full max-w-5xl">
          <ActiveComponent {...currentRoute.params} key={currentRoute.path} /> {/* Pass params and key for re-mount on path change */}
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
};

export default App;
