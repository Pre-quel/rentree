
import React from 'react';
import type { CheatsheetItem } from '../types';

// Fix: Export CheatsheetItem so it can be imported by App.tsx via this module
export type { CheatsheetItem };

export const cheatsheetData: CheatsheetItem[] = [
  {
    typed: `# Header 1\n## Header 2`,
    publishedExample: `# Header 1\n## Header 2\n### Header 3`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'And so on up to 6.'),
  },
  {
    typed: `Return once starts a new line.\nReturn twice (blank line) starts a new paragraph.`,
    publishedExample: `This is the first line.\nThis is the second line.\n\nThis is a new paragraph.`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Behavior demonstrated in "Published" column.'),
  },
  {
    typed: `*Italics*\n**Bold**\n~~Strikeout~~\n==Mark==\n%red%Colored Text%%\n%#8b35c8%Colored Text Hex%%\n!>Spoiler`,
    publishedExample: `*Italics*\n**Bold**\n~~Strikeout~~\n==Mark==\n%red%Colored Text%%\n%#8b35c8%Colored Text Hex%%\n!>Spoiler`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 
      React.createElement('a', { href: '#', target: '_blank', className: 'text-blue-500 hover:underline' }, 'Color list (simulated link)')
    ),
  },
  {
    typed: `<u>Simple Underlined Text</u>`,
    publishedExample: `<u>Simple Underlined Text</u>`,
    typedNotes: React.createElement('div', { className: 'text-gray-500' },
      React.createElement('p', null, 'Use HTML <u> tags to underline text.')
    ),
  },
  {
    typed: `->Centered text<-\n->Right-aligned->`,
    publishedExample: `->Centered text<-\n\n->Right-aligned->`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Also works for images and ### ->Headers<-'),
  },
  {
    typed: `[TOC]\n\n# Section 1\n## Subsection 1.1\n# Section 2`,
    publishedExample: `[TOC]\n\n# Section 1\n## Subsection 1.1\n### Subsubsection 1.1.1\n# Section 2\n## Subsection 2.1`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Generates Table of Contents from # Headers. [TOC2] - From h2 to h6. [TOC3] - From h3 to h6, and so on up to 6. (Specific TOC level not implemented in this clone, shows full TOC)'),
  },
  {
    typed: `- Bulleted list item a\n- Bulleted list item b\n    - Nested item b1`,
    publishedExample: `- Bulleted list item a\n- Bulleted list item b\n    - Nested item b1\n    - Nested item b2\n* Can use asterisk too\n    * Nested asterisk`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Nested lists use 4 spaces or 1 tab. An asterisk (*) can be used instead of a dash.'),
  },
  {
    typed: `1. Numbered list item\n2. Numbered list item\n    1. Nested list item\n    2. Nested list item`,
    publishedExample: `1. Numbered list item\n2. Numbered list item\n    1. Nested list item\n    2. Nested list item\n3. Third item`,
  },
  {
    typed: `- [ ] Checkbox 1\n- [x] Checkbox 2`,
    publishedExample: `- [ ] Checkbox 1\n- [x] Checkbox 2`,
  },
  {
    typed: `[//]: (comment here)`,
    publishedExample: `This is visible.\n[//]: (This comment will not be visible in the rendered output.)\nThis is also visible.`,
    typedNotes: React.createElement('p', null, 'Adding [//]: () to a line will comment it out, so that it does not appear when viewing the page.'),
  },
  {
    typed: `>> How to use quotes in Markdown?\n> Just prepend text with >`,
    publishedExample: `>> How to use quotes in Markdown?\n> Just prepend text with >\n> > Another level of quote.\n> Back to first level.`,
  },
  {
    typed: "``` python\ns = \"Triple backticks ( ``` ) generate code block\"\nprint(s)\n```",
    publishedExample: "``` python\ns = \"Triple backticks ( ``` ) generate code block\"\nprint(s)\n```\n\n```javascript\nconsole.log('Hello from JS!');\n```\n\n```\nNo language specified.\n```",
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'For the list of supported languages see a simulated ', React.createElement('a', { href: '#', className: 'text-blue-500 hover:underline' }, 'langs page'), '. (Syntax highlighting is basic in this clone)'),
  },
  {
    typed: "Single backtick generates `inline code`",
    publishedExample: "Single backtick generates `inline code` here and `another one`.",
  },
  {
    typed: `***`,
    publishedExample: `Text above rule\n***\nText below rule\n---\nAnother rule\n___ \nYet another`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Horizontal rule, <hr>'),
  },
  {
    typed: `\\*not italics\\*`,
    publishedExample: `\\*not italics\\* but *this is*.\n\n\\# Not a header.`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'To produce a literal asterisk or any symbol used in Markdown, use backslash to escape it.'),
  },
  {
    typed: `Header | Header\n------ | ------\nCell   | Cell\nCell   | Cell\n\nCenter | Right\n:----: | ----:\nCell   | Cell`,
    publishedExample: `Header | Header | Another\n------ | ------ | -----\nCell   | Cell   | More\nCell   | Cell   | Data\n\nCenter | Left | Right\n:----: | :--- | ----:\nC      | L    | R\nCC     | LL   | RR`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Columns can be aligned to the right with --: and centered with :--:. Left is default ---.'),
  },
  {
    typed: `!!! note Admonition title\n    Admonition text\n\n!!! info\n    Title or text can be skipped`,
    publishedExample: `!!! note Admonition title\n    Admonition text with *markdown* **inside**.\n\n!!! info\n    Only text, title skipped.\n\n!!! warning Warning Title\n\n!!! danger\n    This is dangerous!`,
    typedNotes: React.createElement('div', { className: 'text-gray-500' }, 
      React.createElement('p', null, 'Main types: info, note, warning, danger. Defaults to warning.'),
      React.createElement('p', null, 'Additional types: greentext (simulated)')
    ),
  },
  {
    typed: `Autolinks:\nhttps://rentry.co/\nrentry.co`,
    publishedExample: `Autolinks:\nhttps://rentry.co/\nrentry.co\nwww.google.com`,
  },
  {
    typed: `Link description:\n[Markdown paste service](https://rentry.co)`,
    publishedExample: `Link description:\n[Markdown paste service](https://rentry.co)\n[Another link](http://example.com "Link title")`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Be sure to include the "http(s)://" part of the link.'),
  },
  {
    typed: `![Alt Tag](https://picsum.photos/50/50)\n\n![Alt Tag](https://picsum.photos/60/60){100px:100px}\n\n![Alt Tag](https://picsum.photos/70/70 "Title")\n\n![Alt Tag](https://picsum.photos/80/80#left)`,
    publishedExample: `This is some text before an image ![Raccoon](https://picsum.photos/seed/raccoon1/150/100 "A cute raccoon"). And text after.\n\nImage with specified size: ![Placeholder](https://picsum.photos/seed/placeholder1/200/150){100px:75px}\n\nFloating image: ![Floats left](https://picsum.photos/seed/floatleft/100/100#left) This text should wrap around the image. If the image is on the left, the text will flow to its right. Keep adding more text to see the wrapping effect. This can be very useful for layout purposes. \n\nAnd a right floating image: ![Floats right](https://picsum.photos/seed/floatright/120/90#right) This text will wrap around the right-floated image. Text will appear to the left of the image. More text here to demonstrate the effect fully.\n\nClear float:\n!;\nThis text appears below floated images.\n\n[![Clickable Raccoon](https://picsum.photos/seed/clickrac/100/80 "Go to Rentry")](https://rentry.co)`,
    typedNotes: React.createElement('div', { className: 'text-gray-500 text-xs' },
      React.createElement('p', null, 'Be sure to include direct link to the image. Alt tag shows if image fails to load. Title tag controls mouseover text. Add #left or #right to float. Sizes {Wpx:Hpx}, {W%:H%}, {Wvw:Hvw}, {Whw:Hhw} or {W:H} (pixels).'),
      React.createElement('p', {className: 'mt-1'}, 'Images can be links by wrapping them: [![Alt](src)](link)'),
      React.createElement('p', {className: 'mt-1'}, 'Youtube thumbnail (example): [![YT](https://img.youtube.com/vi/xyz/hqdefault.jpg){W:H}](https://youtube.com/watch?v=xyz)')
    ),
  },
   {
    typed: `(empty line above)\n!;`,
    publishedExample: `![Image Left](https://picsum.photos/seed/imgleft2/100/50#left) This text is next to the image.\n\n!;\nThis text is below the floated image due to !; (float clear).`,
    typedNotes: React.createElement('span', { className: 'text-gray-500' }, 'Float Clear: Makes all following content sit below a previous image float. Useful to fix broken layouts. Make sure to leave an empty line above.'),
  },
];