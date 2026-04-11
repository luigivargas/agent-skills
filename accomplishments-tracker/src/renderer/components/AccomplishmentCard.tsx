import React from 'react';
import { Accomplishment } from '../../shared/types';

interface AccomplishmentCardProps {
  accomplishment: Accomplishment;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const impactColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

function AccomplishmentCard({ accomplishment, onEdit, onDelete }: AccomplishmentCardProps) {
  const { id, title, description, date, category, tags, impactLevel, evidenceLinks } =
    accomplishment;

  function handleDelete() {
    if (window.confirm(`Delete "${title}"?`)) {
      onDelete(id);
    }
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>{date}</span>
            <span>·</span>
            <span className="capitalize">{category.replace(/-/g, ' ')}</span>
            <span
              className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${impactColors[impactLevel]}`}
            >
              {impactLevel}
            </span>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(id)}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            aria-label={`Edit ${title}`}
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-300"
            aria-label={`Delete ${title}`}
          >
            🗑️
          </button>
        </div>
      </div>

      {description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      )}

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {evidenceLinks.length > 0 && (
        <div className="mt-2 space-y-1">
          {evidenceLinks.map((link, i) => (
            <a
              key={i}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-xs text-blue-600 hover:underline dark:text-blue-400"
            >
              {link}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default AccomplishmentCard;
