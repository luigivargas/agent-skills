# Implementation Plan: Accomplishments Tracker

## Overview

Build an Electron desktop app with a React + TypeScript renderer for tracking professional accomplishments. Data is persisted as a local JSON file. The app supports CRUD operations, filtering/search, timeline visualization, summary reports, and export.

## Architecture Decisions

- **Electron with contextBridge** — Renderer has no direct Node access. All file I/O goes through IPC via a preload script. This follows Electron security best practices.
- **JSON file storage** — Simple, portable, no database dependency. Read entire file on startup, write on every mutation (debounced). Schema versioning field enables future migrations.
- **Vite + electron-vite** — Fast HMR for the renderer, unified build config for main + preload + renderer processes.
- **Tailwind CSS** — Utility-first styling, no custom CSS files to manage. Consistent with modern React projects.
- **Vitest** — Compatible with Vite, fast, supports React Testing Library out of the box.

## Dependency Graph

```
shared/types.ts (data model)
    │
    ├── main/store.ts (JSON file I/O)
    │       │
    │       └── main/index.ts (Electron app + IPC handlers)
    │               │
    │               └── preload/index.ts (contextBridge)
    │                       │
    │                       └── renderer/ (React app)
    │                           ├── context/AppContext.tsx (state management)
    │                           │       │
    │                           │       ├── components/AccomplishmentForm.tsx
    │                           │       ├── components/AccomplishmentList.tsx
    │                           │       ├── components/AccomplishmentCard.tsx
    │                           │       ├── components/FilterBar.tsx
    │                           │       ├── components/TimelineView.tsx
    │                           │       ├── components/SummaryReport.tsx
    │                           │       └── components/ExportDialog.tsx
    │                           │
    │                           └── lib/ (filtering, search, export utilities)
    │
    └── tests/ (mirrors src/ structure)
```

## Task List

### Phase 1: Foundation (Scaffold + Data Layer)

- [ ] Task 1: Initialize project with electron-vite, React, TypeScript, Tailwind
- [ ] Task 2: Define shared types (Accomplishment, AppData, AppSettings)
- [ ] Task 3: Implement JSON file store (main process: read/write/migrate)
- [ ] Task 4: Set up IPC bridge (main handlers + preload contextBridge)
- [ ] Task 5: Create AppContext with useReducer for renderer state

### Checkpoint: Foundation
- [ ] Electron app launches with a blank React page
- [ ] Data loads from JSON file on startup via IPC
- [ ] All tests pass, `npm run build` succeeds

### Phase 2: Core CRUD (P0 — MVP)

- [ ] Task 6: Build AccomplishmentForm component (add/edit)
- [ ] Task 7: Build AccomplishmentCard component
- [ ] Task 8: Build AccomplishmentList component
- [ ] Task 9: Wire up add/edit/delete through AppContext → IPC → store
- [ ] Task 10: Add input validation (title required, date valid, URL format)

### Checkpoint: Core CRUD
- [ ] User can add, view, edit, delete accomplishments
- [ ] Data persists across app restarts
- [ ] All tests pass, app builds clean

### Phase 3: Organization (P1 — Filter, Search, Sort)

- [ ] Task 11: Build FilterBar component (category dropdown + date range picker)
- [ ] Task 12: Implement filter/search utility functions
- [ ] Task 13: Implement full-text search across title, description, tags
- [ ] Task 14: Add sort controls (by date, impact, category)

### Checkpoint: Organization
- [ ] User can filter, search, and sort accomplishments
- [ ] Filters combine correctly (category + date range + search text)
- [ ] All tests pass

### Phase 4: Visualization & Reporting (P2)

- [ ] Task 15: Build TimelineView component (chronological display)
- [ ] Task 16: Build SummaryReport component (grouped by category, period)
- [ ] Task 17: Implement export utilities (Markdown, CSV)
- [ ] Task 18: Build ExportDialog component with format selection
- [ ] Task 19: Add PDF export support

### Checkpoint: Visualization & Reporting
- [ ] Timeline displays accomplishments chronologically
- [ ] Summary report generates for a selected period
- [ ] Export produces valid Markdown, CSV, and PDF files
- [ ] All tests pass

### Phase 5: Polish (P3)

- [ ] Task 20: Add dark/light/system theme support
- [ ] Task 21: Add custom category management
- [ ] Task 22: Add keyboard shortcuts (quick-add, navigation)
- [ ] Task 23: Final UI polish, loading states, empty states, error handling

### Checkpoint: Complete
- [ ] All acceptance criteria from SPEC.md met
- [ ] All tests pass with 80%+ coverage on business logic
- [ ] App packages successfully for current OS
- [ ] Ready for review

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Electron security misconfiguration | High | Never enable nodeIntegration; use contextBridge exclusively; test CSP |
| JSON file corruption on crash | Medium | Write to temp file then rename (atomic write); keep one backup |
| PDF export complexity | Medium | Use a lightweight library (e.g., jsPDF); defer if it blocks MVP |
| Large data files slow the app | Low | Unlikely for personal use (<10k entries); add pagination if needed |
| electron-vite setup issues | Medium | Fall back to manual Vite + Electron config if needed |

## Open Questions (deferred)

- Backup strategy → Implement auto-backup in Phase 5 if time allows
- Import from CSV/JSON → Defer to post-MVP
- Reminders/notifications → Defer to post-MVP
