import React from 'react';

interface StaticPageViewProps {
  title: string;
  content: string | React.ReactNode;
}

const StaticPageView: React.FC<StaticPageViewProps> = ({ title, content }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{title}</h1>
      {typeof content === 'string' ? (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</p>
      ) : (
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">{content}</div>
      )}
       <a href="#/new" className="inline-block mt-8 text-indigo-600 dark:text-indigo-400 hover:underline">
        &larr; Back to creating a new paste
      </a>
    </div>
  );
};

export default StaticPageView;
