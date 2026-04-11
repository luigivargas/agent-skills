import React, { useState, useCallback, useRef } from 'react';
import { useApp } from './context/AppContext';
import { useTheme } from './context/ThemeContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import AccomplishmentForm from './components/AccomplishmentForm';
import AccomplishmentList from './components/AccomplishmentList';
import FilterBar, { FilterState, DEFAULT_FILTERS } from './components/FilterBar';
import TimelineView from './components/TimelineView';
import SummaryReport from './components/SummaryReport';
import ExportDialog from './components/ExportDialog';
import ThemeToggle from './components/ThemeToggle';
import { filterAccomplishments } from './lib/filters';
import { Accomplishment } from '../shared/types';

type ViewMode = 'list' | 'timeline' | 'summary';
const VIEW_CYCLE: ViewMode[] = ['list', 'timeline', 'summary'];

function App() {
  const { state, addAccomplishment, updateAccomplishment, deleteAccomplishment } = useApp();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const searchRef = useRef<HTMLInputElement>(null);

  const handleToggleForm = useCallback(() => {
    setShowForm((prev) => !prev);
    setEditingId(null);
  }, []);

  const handleFocusSearch = useCallback(() => {
    const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
    searchInput?.focus();
  }, []);

  const handleToggleExport = useCallback(() => {
    setShowExport((prev) => !prev);
  }, []);

  const handleCycleView = useCallback(() => {
    setViewMode((prev) => {
      const idx = VIEW_CYCLE.indexOf(prev);
      return VIEW_CYCLE[(idx + 1) % VIEW_CYCLE.length];
    });
  }, []);

  useKeyboardShortcuts({
    onQuickAdd: handleToggleForm,
    onSearch: handleFocusSearch,
    onExport: handleToggleExport,
    onToggleView: handleCycleView,
  });

  if (state.loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="mb-4 text-4xl">🏆</div>
          <p className="text-gray-500 dark:text-gray-400">Loading your accomplishments...</p>
        </div>
      </div>
    );
  }

  const filtered = filterAccomplishments(state.data.accomplishments, filters);
  const editingItem = editingId
    ? state.data.accomplishments.find((a) => a.id === editingId)
    : undefined;

  function handleAdd(accomplishment: Accomplishment) {
    addAccomplishment(accomplishment);
    setShowForm(false);
  }

  function handleUpdate(accomplishment: Accomplishment) {
    updateAccomplishment(accomplishment);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    deleteAccomplishment(id);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🏆 Accomplishments Tracker
          </h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* View mode tabs */}
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
              {([
                { key: 'list' as const, label: '📋' , title: 'List view' },
                { key: 'timeline' as const, label: '📅', title: 'Timeline view' },
                { key: 'summary' as const, label: '📊', title: 'Summary report' },
              ]).map((v) => (
                <button
                  key={v.key}
                  onClick={() => setViewMode(v.key)}
                  className={`px-2 py-1 text-xs transition-colors ${
                    viewMode === v.key
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  } ${v.key === 'list' ? 'rounded-l-md' : ''} ${v.key === 'summary' ? 'rounded-r-md' : ''}`}
                  title={v.title}
                  aria-label={v.title}
                >
                  {v.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowExport(true)}
              className="rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              title="Export (Ctrl+E)"
            >
              Export
            </button>
            <button
              onClick={handleToggleForm}
              className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
              title="Add accomplishment (Ctrl+N)"
            >
              {showForm ? 'Close' : '+ Add'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-4 p-6">
        {(showForm || editingId) && (
          <AccomplishmentForm
            onSubmit={editingId ? handleUpdate : handleAdd}
            initial={editingItem}
            onCancel={() => {
              setShowForm(false);
              setEditingId(null);
            }}
          />
        )}

        {viewMode !== 'summary' && (
          <FilterBar filters={filters} onChange={setFilters} />
        )}

        {viewMode !== 'summary' && (
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              {filtered.length} accomplishment{filtered.length !== 1 ? 's' : ''}
              {filtered.length !== state.data.accomplishments.length &&
                ` (of ${state.data.accomplishments.length} total)`}
            </span>
          </div>
        )}

        {viewMode === 'list' && (
          <AccomplishmentList
            accomplishments={filtered}
            onEdit={(id) => {
              setEditingId(id);
              setShowForm(false);
            }}
            onDelete={handleDelete}
          />
        )}

        {viewMode === 'timeline' && (
          <TimelineView
            accomplishments={filtered}
            onEdit={(id) => {
              setEditingId(id);
              setShowForm(false);
            }}
          />
        )}

        {viewMode === 'summary' && (
          <SummaryReport accomplishments={state.data.accomplishments} />
        )}
      </main>

      {/* Keyboard shortcut hints */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white px-6 py-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-4xl items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-700">Ctrl+N</kbd> Add</span>
          <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-700">Ctrl+K</kbd> Search</span>
          <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-700">Ctrl+E</kbd> Export</span>
          <span><kbd className="rounded bg-gray-100 px-1.5 py-0.5 font-mono dark:bg-gray-700">Ctrl+]</kbd> Switch view</span>
        </div>
      </footer>

      {showExport && (
        <ExportDialog
          accomplishments={filtered}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}

export default App;
