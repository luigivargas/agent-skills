import { useEffect } from 'react';

interface KeyboardShortcuts {
  onQuickAdd: () => void;
  onSearch: () => void;
  onExport: () => void;
  onToggleView: () => void;
}

export function useKeyboardShortcuts({ onQuickAdd, onSearch, onExport, onToggleView }: KeyboardShortcuts) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        // Allow Escape to blur inputs
        if (e.key === 'Escape') {
          target.blur();
        }
        return;
      }

      const isMod = e.ctrlKey || e.metaKey;

      // Ctrl/Cmd + N: Quick add
      if (isMod && e.key === 'n') {
        e.preventDefault();
        onQuickAdd();
      }

      // Ctrl/Cmd + K: Focus search
      if (isMod && e.key === 'k') {
        e.preventDefault();
        onSearch();
      }

      // Ctrl/Cmd + E: Export dialog
      if (isMod && e.key === 'e') {
        e.preventDefault();
        onExport();
      }

      // Ctrl/Cmd + ]: Cycle view
      if (isMod && e.key === ']') {
        e.preventDefault();
        onToggleView();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onQuickAdd, onSearch, onExport, onToggleView]);
}
