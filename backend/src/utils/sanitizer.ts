import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

export const sanitizeMarkdown = (content: string): string => {
  // Allow markdown-specific characters but sanitize HTML
  const cleaned = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_TRUSTED_TYPE: false
  });
  
  return cleaned;
};

export const sanitizeId = (id: string): string => {
  // Remove any characters that aren't alphanumeric, dash, or underscore
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
};