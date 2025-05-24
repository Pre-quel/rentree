import React from 'react';
import { CheatsheetItem, cheatsheetData } from '../components/CheatsheetData';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

const CheatsheetView: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <header className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100">Markdown Cheatsheet</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">A Rentry.co Inspired Markdown Guide</p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr className="text-left">
              <th className="p-3 sm:p-4 font-semibold text-gray-700 dark:text-gray-200 w-1/2">What you type</th>
              <th className="p-3 sm:p-4 font-semibold text-gray-700 dark:text-gray-200 w-1/2">What will be published</th>
            </tr>
          </thead>
          <tbody>
            {cheatsheetData.map((item: CheatsheetItem, index: number) => (
              <tr key={index} className={`border-t border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                <td className="p-3 sm:p-4 align-top">
                  <pre className="bg-gray-100 dark:bg-gray-700 p-2 sm:p-3 rounded text-xs sm:text-sm whitespace-pre-wrap break-all font-mono text-gray-700 dark:text-gray-200">{item.typed}</pre>
                  {item.typedNotes && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{item.typedNotes}</div>
                  )}
                </td>
                <td className="p-3 sm:p-4 align-top markdown-body prose-sm sm:prose-base dark:prose-invert max-w-none">
                  <MarkdownRenderer content={item.publishedExample} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CheatsheetView;
