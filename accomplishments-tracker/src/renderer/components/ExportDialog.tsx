import React, { useState } from 'react';
import { Accomplishment } from '../../shared/types';
import { exportToMarkdown, exportToCsv } from '../lib/export';

interface ExportDialogProps {
  accomplishments: Accomplishment[];
  onClose: () => void;
}

function ExportDialog({ accomplishments, onClose }: ExportDialogProps) {
  const [format, setFormat] = useState<'markdown' | 'csv'>('markdown');
  const [title, setTitle] = useState('Accomplishments Report');

  function handleExport() {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'markdown') {
      content = exportToMarkdown(accomplishments, title);
      filename = 'accomplishments.md';
      mimeType = 'text/markdown';
    } else {
      content = exportToCsv(accomplishments);
      filename = 'accomplishments.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Export Accomplishments
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="export-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report title
            </label>
            <input
              id="export-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
            <div className="mt-2 flex gap-3">
              {([
                { value: 'markdown' as const, label: 'Markdown (.md)' },
                { value: 'csv' as const, label: 'CSV (.csv)' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormat(opt.value)}
                  className={`flex-1 rounded border px-3 py-2 text-sm font-medium transition-colors ${
                    format === opt.value
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Exporting {accomplishments.length} accomplishment{accomplishments.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportDialog;
