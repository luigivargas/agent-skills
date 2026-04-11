import { describe, it, expect } from 'vitest';
import { Accomplishment } from '../../src/shared/types';

// Test the groupByMonth logic extracted for testing
function groupByMonth(items: Accomplishment[]): Map<string, Accomplishment[]> {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const groups = new Map<string, Accomplishment[]>();
  for (const item of sorted) {
    const key = item.date.substring(0, 7);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }
  return groups;
}

function makeAccomplishment(overrides: Partial<Accomplishment> = {}): Accomplishment {
  return {
    id: 'test-id',
    title: 'Test',
    description: '',
    date: '2026-01-15',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    category: 'technical',
    tags: [],
    impactLevel: 'medium',
    evidenceLinks: [],
    ...overrides,
  };
}

describe('TimelineView groupByMonth', () => {
  it('groups accomplishments by year-month', () => {
    const items = [
      makeAccomplishment({ id: '1', date: '2026-01-10' }),
      makeAccomplishment({ id: '2', date: '2026-01-25' }),
      makeAccomplishment({ id: '3', date: '2026-02-15' }),
    ];
    const groups = groupByMonth(items);
    expect(groups.size).toBe(2);
    expect(groups.get('2026-01')!.length).toBe(2);
    expect(groups.get('2026-02')!.length).toBe(1);
  });

  it('returns months in descending order', () => {
    const items = [
      makeAccomplishment({ id: '1', date: '2026-01-10' }),
      makeAccomplishment({ id: '2', date: '2026-03-15' }),
      makeAccomplishment({ id: '3', date: '2026-02-20' }),
    ];
    const groups = groupByMonth(items);
    const keys = Array.from(groups.keys());
    expect(keys).toEqual(['2026-03', '2026-02', '2026-01']);
  });

  it('handles empty array', () => {
    const groups = groupByMonth([]);
    expect(groups.size).toBe(0);
  });

  it('handles single item', () => {
    const items = [makeAccomplishment({ id: '1', date: '2026-06-01' })];
    const groups = groupByMonth(items);
    expect(groups.size).toBe(1);
    expect(groups.get('2026-06')!.length).toBe(1);
  });
});
