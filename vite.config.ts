import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import remarkDirective from 'remark-directive';
import remarkEmoji from 'remark-emoji';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [
        mdx({
          remarkPlugins: [
            remarkGfm,
            remarkMath,
            remarkFrontmatter,
            remarkDirective,
            remarkEmoji
          ],
          rehypePlugins: [
            rehypeKatex,
            rehypeHighlight,
            rehypeSlug,
            rehypeAutolinkHeadings
          ]
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
