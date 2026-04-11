# Spec: Accomplishments Tracker

## Objective

A desktop application (Electron) for tracking personal and professional accomplishments over time. Users log rich accomplishment entries with metadata (category, tags, impact level), then search, filter, and generate summary reports for performance reviews, resumes, and self-reflection.

**Target user:** Individual professional who wants to capture wins as they happen rather than scrambling to recall them at review time.

**Success looks like:** A user opens the app, logs an accomplishment in under 30 seconds, and can later generate a summary of their last quarter's work in one click.

## Tech Stack

- **Runtime:** Electron (latest stable)
- **Frontend:** React 18 + TypeScript 5
- **Build tool:** Vite (for React) + electron-builder (for packaging)
- **Styling:** Tailwind CSS
- **State management:** React context + useReducer (upgrade to Zustand if needed)
- **Data storage:** Local JSON file (via Electron's `app.getPath('userData')`)
- **Testing:** Vitest + React Testing Library
- **Linting:** ESLint + Prettier

## Commands

```bash
# Development
npm run dev              # Start Electron + Vite in dev mode
npm run dev:renderer     # Start Vite dev server only (renderer)

# Testing
npm test                 # Run all tests
npm test -- --coverage   # Run tests with coverage
npm run test:watch       # Run tests in watch mode

# Build
npm run build            # Build for production
npm run package          # Package Electron app for distribution

# Quality
npm run lint             # ESLint check
npm run lint:fix         # ESLint auto-fix
npm run typecheck        # TypeScript type checking
```

## Project Structure

```
accomplishments-tracker/
├── SPEC.md                    # This file
├── PLAN.md                    # Implementation plan
├── package.json
├── tsconfig.json
├── vite.config.ts
├── electron.vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── main/                  # Electron main process
│   │   ├── index.ts           # App entry, window management
│   │   └── store.ts           # JSON file read/write (IPC handlers)
│   ├── preload/               # Preload scripts
│   │   └── index.ts           # Expose safe IPC methods to renderer
│   ├── renderer/              # React app (renderer process)
│   │   ├── index.html
│   │   ├── main.tsx           # React entry point
│   │   ├── App.tsx            # Root component + routing
│   │   ├── components/        # UI components
│   │   │   ├── AccomplishmentForm.tsx
│   │   │   ├── AccomplishmentCard.tsx
│   │   │   ├── AccomplishmentList.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   ├── TimelineView.tsx
│   │   │   ├── SummaryReport.tsx
│   │   │   └── ExportDialog.tsx
│   │   ├── hooks/             # Custom React hooks
│   │   ├── context/           # React context providers
│   │   ├── lib/               # Utilities (search, export, date helpers)
│   │   └── types/             # TypeScript type definitions
│   └── shared/                # Types/constants shared between processes
│       └── types.ts
├── tests/                     # Unit + integration tests
│   ├── main/
│   ├── renderer/
│   └── shared/
└── resources/                 # App icons, assets
```

## Data Model

```typescript
interface Accomplishment {
  id: string;                  // UUID v4
  title: string;               // Required, 1-200 chars
  description: string;         // Optional, markdown supported
  date: string;                // ISO 8601 date (YYYY-MM-DD)
  createdAt: string;           // ISO 8601 datetime
  updatedAt: string;           // ISO 8601 datetime
  category: Category;          // Enum: see below
  tags: string[];              // User-defined, 0-10 tags
  impactLevel: ImpactLevel;    // low | medium | high | critical
  evidenceLinks: string[];     // URLs or file paths, 0-5 links
}

type Category =
  | 'project'
  | 'leadership'
  | 'technical'
  | 'collaboration'
  | 'learning'
  | 'mentoring'
  | 'process-improvement'
  | 'other';

type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

interface AppData {
  version: number;             // Schema version for migrations
  accomplishments: Accomplishment[];
  customCategories: string[];  // User-added categories
  settings: AppSettings;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultCategory: Category;
  exportFormat: 'markdown' | 'csv' | 'pdf';
}
```

## Code Style

```typescript
// Components: PascalCase, function declarations, props interface
interface AccomplishmentCardProps {
  accomplishment: Accomplishment;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function AccomplishmentCard({ accomplishment, onEdit, onDelete }: AccomplishmentCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{accomplishment.title}</h3>
      {/* ... */}
    </div>
  );
}

// Hooks: camelCase with "use" prefix
function useAccomplishments() { /* ... */ }

// Utilities: camelCase, pure functions preferred
function filterByDateRange(items: Accomplishment[], start: string, end: string): Accomplishment[] {
  return items.filter(item => item.date >= start && item.date <= end);
}

// IPC channels: kebab-case strings
const IPC_CHANNELS = {
  LOAD_DATA: 'store:load-data',
  SAVE_DATA: 'store:save-data',
} as const;
```

## Testing Strategy

- **Framework:** Vitest + React Testing Library
- **Location:** `tests/` mirroring `src/` structure
- **Coverage target:** 80%+ for business logic, 60%+ for UI components
- **Test levels:**
  - **Unit tests:** Data model validation, filtering/search logic, export formatting, date utilities
  - **Integration tests:** IPC communication (main ↔ renderer), form submission flows
  - **Component tests:** Render + interact with each UI component in isolation
- **Testing patterns:** Write the test first (TDD), then implement. For bugs, write a failing test first.

## Features (Priority Order)

### P0 — Core (MVP)
1. **Add accomplishment** — Form with all fields, validation, save to JSON
2. **View accomplishments** — List view with cards showing key info
3. **Edit accomplishment** — Inline or modal editing
4. **Delete accomplishment** — With confirmation dialog

### P1 — Organization
5. **Filter by category** — Dropdown filter on list view
6. **Filter by date range** — Date picker for start/end
7. **Search** — Full-text search across title, description, tags
8. **Sort** — By date, impact level, category

### P2 — Visualization & Reporting
9. **Timeline view** — Chronological timeline/calendar of accomplishments
10. **Summary reports** — Generate weekly/monthly/quarterly summaries grouped by category
11. **Export** — Export to Markdown, CSV, or PDF

### P3 — Polish
12. **Dark/light theme** — System preference detection + manual toggle
13. **Custom categories** — User-defined categories beyond defaults
14. **Keyboard shortcuts** — Quick-add, navigation

## Boundaries

### Always
- Run `npm test` before committing
- Validate user input (title required, date valid, URL format for evidence links)
- Use TypeScript strict mode
- Write tests for new logic before implementing

### Ask First
- Adding new npm dependencies
- Changing the data model (may need migration logic)
- Changing Electron security settings (CSP, node integration)

### Never
- Enable `nodeIntegration` in renderer (use preload + contextBridge)
- Store sensitive data unencrypted
- Skip tests for "simple" changes
- Break existing passing tests

## Success Criteria

- [ ] User can add an accomplishment with all fields in under 30 seconds
- [ ] User can find a specific accomplishment via search in under 5 seconds
- [ ] User can generate a quarterly summary in one click
- [ ] User can export accomplishments to Markdown, CSV, or PDF
- [ ] App loads in under 2 seconds
- [ ] All tests pass with 80%+ coverage on business logic
- [ ] App builds and packages successfully for the current OS

## Open Questions

1. **Backup strategy?** — Should the app auto-backup the JSON file periodically?
2. **Import?** — Should we support importing accomplishments from CSV/JSON?
3. **Reminders?** — Should there be a notification/reminder to log accomplishments regularly?
