import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkEmoji from 'remark-emoji';
import remarkToc from 'remark-toc';
import remarkFootnotes from 'remark-footnotes';
import remarkBreaks from 'remark-breaks';
import remarkGemoji from 'remark-gemoji';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import { visit } from 'unist-util-visit';
import mermaid from 'mermaid';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

// Initialize mermaid
mermaid.initialize({ 
  startOnLoad: true,
  theme: 'default',
  themeVariables: {
    darkMode: false
  }
});

// Custom remark plugin to handle [TOC] syntax
function remarkCustomToc() {
  return (tree: any) => {
    visit(tree, 'paragraph', (node: any, index: any, parent: any) => {
      if (node.children.length === 1 && 
          node.children[0].type === 'text' && 
          (node.children[0].value === '[TOC]' || node.children[0].value === '[[toc]]')) {
        parent.children[index] = {
          type: 'toc',
          data: {
            hName: 'div',
            hProperties: { className: ['toc-placeholder'] }
          }
        };
      }
    });
  };
}

// Custom remark plugin to handle custom block syntax like !name{width%\ncontent\n%}
function remarkCustomBlocks() {
  return (tree: any, file: any) => {
    visit(tree, 'root', (node: any) => {
      const children = node.children;
      const newChildren = [];
      let i = 0;
      
      while (i < children.length) {
        const child = children[i];
        
        // Check if this is a paragraph with custom block start
        if (child.type === 'paragraph' && 
            child.children.length > 0 && 
            child.children[0].type === 'text') {
          
          const text = child.children[0].value;
          const match = text.match(/^!(\w+)\{(\d+)%$/);
          
          if (match) {
            // Look for the closing %} in subsequent nodes
            let j = i + 1;
            let found = false;
            const contentNodes = [];
            
            while (j < children.length) {
              const nextNode = children[j];
              
              // Check if this node contains %}
              if (nextNode.type === 'paragraph' && 
                  nextNode.children.length === 1 && 
                  nextNode.children[0].type === 'text' &&
                  nextNode.children[0].value === '%}') {
                found = true;
                break;
              }
              
              // Collect content nodes
              contentNodes.push(nextNode);
              j++;
            }
            
            if (found) {
              // Create custom block with content
              const blockNode = {
                type: 'paragraph',
                children: [{
                  type: 'html',
                  value: `<div class="custom-block custom-block-${match[1]}" style="width: ${match[2]}%;">`
                }]
              };
              
              const closingNode = {
                type: 'paragraph',
                children: [{
                  type: 'html',
                  value: '</div>'
                }]
              };
              
              // Add the opening div, content nodes, and closing div
              newChildren.push(blockNode);
              newChildren.push(...contentNodes);
              newChildren.push(closingNode);
              
              // Skip processed nodes
              i = j + 1;
              continue;
            }
          }
        }
        
        // If not a custom block, just add the node
        newChildren.push(child);
        i++;
      }
      
      node.children = newChildren;
    });
  };
}

// Custom remark plugin to handle directives for admonitions
function remarkAdmonitions() {
  return (tree: any) => {
    visit(tree, 'containerDirective', (node: any) => {
      const validTypes = ['note', 'tip', 'info', 'warning', 'danger', 'important', 'caution'];
      if (validTypes.includes(node.name)) {
        const data = node.data || (node.data = {});
        data.hName = 'div';
        data.hProperties = {
          className: ['admonition', `admonition-${node.name}`, node.name]
        };
      }
    });
  };
}

export const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [processedContent, setProcessedContent] = useState(content);

  useEffect(() => {
    // Don't process [TOC] - let the custom plugin handle it
    setProcessedContent(content);
  }, [content]);

  useEffect(() => {
    // Render mermaid diagrams
    if (containerRef.current) {
      const mermaidElements = containerRef.current.querySelectorAll('.language-mermaid');
      mermaidElements.forEach((element, index) => {
        const graphDefinition = element.textContent || '';
        const mermaidDiv = document.createElement('div');
        mermaidDiv.className = 'mermaid';
        mermaidDiv.textContent = graphDefinition;
        element.parentNode?.replaceChild(mermaidDiv, element);
        
        try {
          mermaid.render(`mermaid-${Date.now()}-${index}`, graphDefinition).then(({ svg }) => {
            mermaidDiv.innerHTML = svg;
          });
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      });

      // Handle TOC placeholder
      const tocPlaceholder = containerRef.current.querySelector('.toc-placeholder');
      if (tocPlaceholder) {
        const headings = containerRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const toc = document.createElement('nav');
        toc.className = 'table-of-contents my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg';
        
        const tocTitle = document.createElement('h2');
        tocTitle.textContent = 'Table of Contents';
        tocTitle.className = 'text-xl font-bold mb-2';
        toc.appendChild(tocTitle);
        
        const tocList = document.createElement('ul');
        tocList.className = 'space-y-1';
        
        headings.forEach((heading) => {
          if (heading.textContent !== 'Table of Contents' && heading.id) {
            const level = parseInt(heading.tagName[1]);
            const li = document.createElement('li');
            li.className = `ml-${(level - 1) * 4}`;
            
            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent || '';
            link.className = 'text-blue-600 dark:text-blue-400 hover:underline';
            
            li.appendChild(link);
            tocList.appendChild(li);
          }
        });
        
        toc.appendChild(tocList);
        tocPlaceholder.parentNode?.replaceChild(toc, tocPlaceholder);
      }
    }
  }, [processedContent]);

  return (
    <div ref={containerRef} className="prose prose-lg dark:prose-invert max-w-none 
      prose-headings:font-semibold prose-headings:text-gray-800 dark:prose-headings:text-gray-100
      prose-h1:text-3xl prose-h1:border-b prose-h1:pb-2 prose-h1:border-gray-300 dark:prose-h1:border-gray-600
      prose-h2:text-2xl prose-h2:border-b prose-h2:pb-1 prose-h2:border-gray-300 dark:prose-h2:border-gray-600
      prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-base
      prose-p:my-2 prose-p:text-gray-700 dark:prose-p:text-gray-300
      prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900 dark:prose-strong:text-gray-100
      prose-em:text-gray-800 dark:prose-em:text-gray-200
      prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
      prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 prose-pre:text-white dark:prose-pre:text-gray-100
      prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
      prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5
      prose-li:my-0.5 prose-li:text-gray-700 dark:prose-li:text-gray-300
      prose-table:my-4 prose-table:border-collapse
      prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:p-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-700
      prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:p-2
      prose-tr:bg-white dark:prose-tr:bg-gray-800 hover:prose-tr:bg-gray-50 dark:hover:prose-tr:bg-gray-700
      prose-hr:my-6 prose-hr:border-gray-300 dark:prose-hr:border-gray-600
      prose-img:rounded prose-img:max-w-full prose-img:h-auto">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkMath,
          remarkFrontmatter,
          remarkDirective,
          remarkAdmonitions,
          remarkCustomBlocks,
          remarkEmoji,
          remarkGemoji,
          remarkCustomToc,
          [remarkToc, { heading: 'Table of Contents', maxDepth: 3, tight: true }],
          remarkFootnotes,
          remarkBreaks
        ]}
        rehypePlugins={[
          rehypeRaw,
          rehypeKatex,
          rehypeHighlight,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }]
        ]}
        components={{
          // Custom rendering for task lists
          input: ({ node, ...props }: any) => {
            if (props.type === 'checkbox') {
              return (
                <input
                  {...props}
                  disabled
                  className="mr-2 align-middle cursor-default"
                />
              );
            }
            return <input {...props} />;
          },
          // Custom rendering for admonitions/callouts using directives
          div: ({ node, className, children, ...props }: any) => {
            // Handle custom containers/admonitions
            if (node?.data?.hName === 'div' && node?.data?.hProperties?.className) {
              const classes = node.data.hProperties.className;
              if (Array.isArray(classes) && classes.some((c: string) => c.startsWith('admonition'))) {
                const type = classes.find((c: string) => ['note', 'tip', 'info', 'warning', 'danger', 'important', 'caution'].includes(c)) || 'note';
                const colors = {
                  note: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
                  tip: 'border-green-500 bg-green-50 dark:bg-green-900/20',
                  info: 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20',
                  warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
                  danger: 'border-red-500 bg-red-50 dark:bg-red-900/20',
                  important: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
                  caution: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                };
                return (
                  <div className={`my-4 p-4 rounded-md border-l-4 ${colors[type as keyof typeof colors]}`} {...props}>
                    {children}
                  </div>
                );
              }
              // Handle custom blocks
              if (Array.isArray(classes) && classes.some((c: string) => c === 'custom-block')) {
                const style = node.data.hProperties.style || {};
                return (
                  <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600" style={style} {...props}>
                    {children}
                  </div>
                );
              }
            }
            return <div className={className} {...props}>{children}</div>;
          },
          // Custom rendering for inline code
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;
            
            if (isInline) {
              return (
                <code className="text-pink-600 dark:text-pink-400 bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded" {...props}>
                  {children}
                </code>
              );
            }
            
            // Special handling for mermaid
            if (match && match[1] === 'mermaid') {
              return (
                <pre className={className} {...props}>
                  <code className="language-mermaid">{children}</code>
                </pre>
              );
            }
            
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // Handle span elements with style attributes for colors
          span: ({ node, style, children, ...props }: any) => {
            return <span style={style} {...props}>{children}</span>;
          },
          // Handle details/summary elements
          details: ({ node, children, ...props }: any) => {
            return (
              <details className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg" {...props}>
                {children}
              </details>
            );
          },
          summary: ({ node, children, ...props }: any) => {
            return (
              <summary className="cursor-pointer font-semibold hover:text-blue-600 dark:hover:text-blue-400" {...props}>
                {children}
              </summary>
            );
          },
          // Custom rendering for images with alignment support
          img: ({ node, ...props }: any) => {
            const { src, alt, title } = props;
            let className = "max-w-full h-auto inline-block rounded";
            let style: React.CSSProperties = {};
            
            // Check for alignment markers in alt text
            if (alt?.includes('#left')) {
              style.float = 'left';
              style.marginRight = '1em';
              style.marginBottom = '0.5em';
            } else if (alt?.includes('#right')) {
              style.float = 'right';
              style.marginLeft = '1em';
              style.marginBottom = '0.5em';
            } else if (alt?.includes('#center')) {
              className += " block mx-auto";
            }
            
            // Check for size in alt text (e.g., #200x150)
            const sizeMatch = alt?.match(/#(\d+)x(\d+)/);
            if (sizeMatch) {
              style.width = `${sizeMatch[1]}px`;
              style.height = `${sizeMatch[2]}px`;
            }
            
            return <img src={src} alt={alt?.replace(/#(left|right|center|\d+x\d+)/g, '').trim()} title={title} className={className} style={style} />;
          },
          // Custom rendering for paragraphs with alignment
          p: ({ node, children, ...props }: any) => {
            const text = typeof children === 'string' ? children : '';
            let className = "my-2";
            let processedChildren = children;
            
            if (typeof text === 'string') {
              if (text.endsWith('->')) {
                className += " text-right";
                processedChildren = text.slice(0, -2).trim();
              } else if (text.startsWith('->') && text.endsWith('<-')) {
                className += " text-center";
                processedChildren = text.slice(2, -2).trim();
              }
            }
            
            return <p className={className} {...props}>{processedChildren}</p>;
          },
          // Enhanced table rendering
          table: ({ node, children, ...props }: any) => {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border-collapse" {...props}>
                  {children}
                </table>
              </div>
            );
          },
          // Keyboard keys
          kbd: ({ node, children, ...props }: any) => {
            return (
              <kbd className="px-2 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" {...props}>
                {children}
              </kbd>
            );
          },
          // Subscript and superscript
          sub: ({ node, children, ...props }: any) => {
            return <sub className="text-xs" {...props}>{children}</sub>;
          },
          sup: ({ node, children, ...props }: any) => {
            return <sup className="text-xs" {...props}>{children}</sup>;
          },
          // Definition lists
          dl: ({ node, children, ...props }: any) => {
            return <dl className="my-4" {...props}>{children}</dl>;
          },
          dt: ({ node, children, ...props }: any) => {
            return <dt className="font-semibold mt-2" {...props}>{children}</dt>;
          },
          dd: ({ node, children, ...props }: any) => {
            return <dd className="ml-6 text-gray-700 dark:text-gray-300" {...props}>{children}</dd>;
          },
          // Enhanced blockquote
          blockquote: ({ node, children, ...props }: any) => {
            return (
              <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4" {...props}>
                {children}
              </blockquote>
            );
          },
          // Mark/highlight
          mark: ({ node, children, ...props }: any) => {
            return (
              <mark className="bg-yellow-300 dark:bg-yellow-500 text-black dark:text-gray-900 px-1 rounded" {...props}>
                {children}
              </mark>
            );
          },
          // Abbreviations
          abbr: ({ node, children, ...props }: any) => {
            return (
              <abbr className="border-b border-dotted border-gray-500 cursor-help" {...props}>
                {children}
              </abbr>
            );
          }
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};