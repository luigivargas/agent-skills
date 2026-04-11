import { describe, it, expect } from 'vitest';
import { filterAccomplishments } from '../../src/renderer/lib/filters';
import { Accomplishment } from '../../src/shared/types';
import { DEFAULT_FILTERS } from '../../src/renderer/components/FilterBar';

function makeAccomplishment(overrides: Partial<Accomplishment> = {}): Accomplishment {
  return {
    id: 'test-id',
    title: 'Test Accomplishment',
    description: 'Test description',
    date: '2026-01-15',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    category: 'technical',
    tags: ['react'],
    impactLevel: 'medium',
    evidenceLinks: [],
    ...overrides,
  };
}

describe('filterAccomplishments', () => {
  const items: Accomplishment[] = [
    makeAccomplishment({ id: '1', title: 'Built API', category: 'technical', impactLevel: 'high', date: '2026-01-10', tags: ['backend'] }),
    makeAccomplishment({ id: '2', title: 'Led sprint', category: 'leadership', impactLevel: 'medium', date: '2026-02-15', tags: ['agile'] }),
    makeAccomplishment({ id: '3', title: 'Mentored intern', category: 'mentoring', impactLevel: 'low', date: '2026-03-20', tags: ['mentoring', 'growth'] }),
    makeAccomplishment({ id: '4', title: 'React migration', category: 'technical', impactLevel: 'critical', date: '2026-01-25', tags: ['react', 'frontend'] }),
  ];

  it('returns all items with default filters', () => {
    const result = filterAccomplishments(items, DEFAULT_FILTERS);
    expect(result).toHaveLength(4);
  });

  it('filters by category', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, category: 'technical' });
    expect(result).toHaveLength(2);
    expect(result.every((a) => a.category === 'technical')).toBe(true);
  });

  it('filters by impact level', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, impactLevel: 'high' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Built API');
  });

  it('filters by date range', () => {
    const result = filterAccomplishments(items, {
      ...DEFAULT_FILTERS,
      dateFrom: '2026-02-01',
      dateTo: '2026-03-31',
    });
    expect(result).toHaveLength(2);
  });

  it('searches by title', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, searchQuery: 'react' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React migration');
  });

  it('searches by tags', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, searchQuery: 'agile' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Led sprint');
  });

  it('searches by description', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, searchQuery: 'test description' });
    expect(result).toHaveLength(4);
  });

  it('sorts by date ascending', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, sortBy: 'date', sortOrder: 'asc' });
    expect(result[0].date).toBe('2026-01-10');
    expect(result[result.length - 1].date).toBe('2026-03-20');
  });

  it('sorts by date descending', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, sortBy: 'date', sortOrder: 'desc' });
    expect(result[0].date).toBe('2026-03-20');
    expect(result[result.length - 1].date).toBe('2026-01-10');
  });

  it('sorts by impact', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, sortBy: 'impact', sortOrder: 'desc' });
    expect(result[0].impactLevel).toBe('critical');
    expect(result[result.length - 1].impactLevel).toBe('low');
  });

  it('combines category and date range filters', () => {
    const result = filterAccomplishments(items, {
      ...DEFAULT_FILTERS,
      category: 'technical',
      dateFrom: '2026-01-20',
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('React migration');
  });

  it('returns empty array when no items match', () => {
    const result = filterAccomplishments(items, { ...DEFAULT_FILTERS, searchQuery: 'nonexistent' });
    expect(result).toHaveLength(0);
  });
});
