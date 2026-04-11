import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Accomplishment,
  Category,
  ImpactLevel,
  DEFAULT_CATEGORIES,
} from '../../shared/types';

interface AccomplishmentFormProps {
  onSubmit: (accomplishment: Accomplishment) => void;
  initial?: Accomplishment;
  onCancel?: () => void;
}

function AccomplishmentForm({ onSubmit, initial, onCancel }: AccomplishmentFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>(initial?.category ?? 'other');
  const [impactLevel, setImpactLevel] = useState<ImpactLevel>(initial?.impactLevel ?? 'medium');
  const [tagsInput, setTagsInput] = useState(initial?.tags.join(', ') ?? '');
  const [evidenceInput, setEvidenceInput] = useState(initial?.evidenceLinks.join('\n') ?? '');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (title.trim().length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);

    const evidenceLinks = evidenceInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 5);

    const now = new Date().toISOString();
    const accomplishment: Accomplishment = {
      id: initial?.id ?? uuidv4(),
      title: title.trim(),
      description: description.trim(),
      date,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
      category,
      tags,
      impactLevel,
      evidenceLinks,
    };

    onSubmit(accomplishment);

    if (!initial) {
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('other');
      setImpactLevel('medium');
      setTagsInput('');
      setEvidenceInput('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {initial ? 'Edit Accomplishment' : 'Add Accomplishment'}
      </h2>

      {error && (
        <div className="rounded bg-red-100 p-2 text-sm text-red-700 dark:bg-red-900 dark:text-red-200" role="alert">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="What did you accomplish?"
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="Describe the impact and details..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {DEFAULT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="impactLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Impact Level
          </label>
          <select
            id="impactLevel"
            value={impactLevel}
            onChange={(e) => setImpactLevel(e.target.value as ImpactLevel)}
            className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags (comma-separated, max 10)
        </label>
        <input
          id="tags"
          type="text"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="e.g., react, performance, q1-2026"
        />
      </div>

      <div>
        <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Evidence Links (one per line, max 5)
        </label>
        <textarea
          id="evidence"
          value={evidenceInput}
          onChange={(e) => setEvidenceInput(e.target.value)}
          rows={2}
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          placeholder="https://github.com/org/repo/pull/123"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {initial ? 'Update' : 'Add Accomplishment'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default AccomplishmentForm;
