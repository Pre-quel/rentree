# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Frontend
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend
```bash
cd backend

# Install dependencies
npm install

# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Note: No linting, type-checking, or testing commands are configured in this project.

## Architecture Overview

This is a React SPA that clones Rentry.co's markdown paste functionality. Key architectural decisions:

### Routing
- Uses hash-based routing (no React Router)
- Route handling in App.tsx switches between views based on URL hash
- Routes: `/new`, `/how`, `/what`, `/langs`, `/contacts`, `/{pasteId}`, `/{pasteId}/edit`, `/{pasteId}/raw`

### State Management
- Global state via React Context API (AppContext.tsx)
- Manages: current paste, loading states, errors, dark mode
- No external state management libraries

### Backend
- **Real MongoDB backend** with Express.js API
- MongoDB connection: Configured via MONGODB_URI in backend/.env
- Database name: 'rentry'
- Collection: 'pastes'
- API endpoints:
  - GET /api/pastes/:id - Fetch paste
  - POST /api/pastes - Create new paste
  - PUT /api/pastes/:id - Update paste (requires editCode if protected)

### Key Services
- **services/api.ts**: Makes HTTP requests to backend API
  - fetchPasteFromAPI(): Retrieves paste by ID
  - savePasteToAPI(): Creates new paste with generated ID
  - updatePasteInAPI(): Updates existing paste (requires edit code)
  
- **services/pasteStore.ts**: Utilities for paste operations
  - generatePasteId(): Creates unique IDs
  - isPasteIdValid(): Validates paste ID format

### View Components
- **EditorView**: Main editor for creating/editing pastes
- **PasteViewerView**: Renders markdown content for viewing
- **RawView**: Shows raw markdown text
- **CheatsheetView**: Markdown syntax reference
- **StaticPageView**: Renders static pages (how, what, langs, contacts)

### Data Model
Primary type is `PasteData` (types.ts):
```typescript
{
  id: string
  content: string
  editCode?: string
  createdAt: string
  updatedAt?: string
}
```

## Development Notes

- Build tool: Vite
- Styling: Tailwind CSS with dark mode support
- Markdown rendering: react-markdown with GitHub Flavored Markdown
- No authentication system - edit codes provide basic protection
- All routing is client-side via URL hash fragments