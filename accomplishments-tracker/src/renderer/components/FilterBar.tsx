import React, { useState } from 'react';
import { Category, DEFAULT_CATEGORIES, ImpactLevel } from '../../shared/types';

export interface FilterState {
  searchQuery: string;
  category: Category | 'all';
  impactLevel: ImpactLevel | 'all';
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'impact' | 'category' | 'title';
  sortOrder: 'asc' | 'desc';
}

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  impactLevel: 'all',
  dateFrom: '',
  dateTo: '',
  sortBy: 'date',
  sortOrder: 'desc',
};

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function FilterBar({ filters, onChange }: FilterBarProps) {
  function update(partial: Partial<FilterState>) {
    onChange({ ...filters, ...partial });
  }

  return (
    <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => update({ searchQuery: e.target.value })}
            placeholder="Search accomplishments..."
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <select
          value={filters.category}
          onChange={(e) => update({ category: e.target.value as Category | 'all' })}
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Categories</option>
          {DEFAULT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </option>
          ))}
        </select>

        <select
          value={filters.impactLevel}
          onChange={(e) => update({ impactLevel: e.target.value as ImpactLevel | 'all' })}
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Impact</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500 dark:text-gray-400">From</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => update({ dateFrom: e.target.value })}
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
        <label className="text-sm text-gray-500 dark:text-gray-400">To</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => update({ dateTo: e.target.value })}
          className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />

        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-gray-400">Sort</label>
          <select
            value={filters.sortBy}
            onChange={(e) => update({ sortBy: e.target.value as FilterState['sortBy'] })}
            className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="date">Date</option>
            <option value="impact">Impact</option>
            <option value="category">Category</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => update({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
            className="rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            aria-label={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {filters.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
