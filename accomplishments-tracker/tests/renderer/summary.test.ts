import { describe, it, expect } from 'vitest';
import { Accomplishment } from '../../src/shared/types';

// Extracted summary logic for testing
const impactWeight: Record<string, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

function groupByCategory(items: Accomplishment[]): Record<string, Accomplishment[]> {
  const groups: Record<string, Accomplishment[]> = {};
  for (const a of items) {
    if (!groups[a.category]) {
      groups[a.category] = [];
    }
    groups[a.category].push(a);
  }
  return groups;
}

function getTopTags(items: Accomplishment[], limit: number): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>();
  for (const item of items) {
    for (const tag of item.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
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

describe('SummaryReport logic', () => {
  describe('groupByCategory', () => {
    it('groups accomplishments by category', () => {
      const items = [
        makeAccomplishment({ id: '1', category: 'technical' }),
        makeAccomplishment({ id: '2', category: 'leadership' }),
        makeAccomplishment({ id: '3', category: 'technical' }),
      ];
      const groups = groupByCategory(items);
      expect(Object.keys(groups)).toHaveLength(2);
      expect(groups['technical']).toHaveLength(2);
      expect(groups['leadership']).toHaveLength(1);
    });

    it('handles empty array', () => {
      const groups = groupByCategory([]);
      expect(Object.keys(groups)).toHaveLength(0);
    });
  });

  describe('getTopTags', () => {
    it('returns top tags by count', () => {
      const items = [
        makeAccomplishment({ id: '1', tags: ['react', 'typescript'] }),
        makeAccomplishment({ id: '2', tags: ['react', 'node'] }),
        makeAccomplishment({ id: '3', tags: ['react', 'typescript', 'node'] }),
      ];
      const tops = getTopTags(items, 2);
      expect(tops).toHaveLength(2);
      expect(tops[0].tag).toBe('react');
      expect(tops[0].count).toBe(3);
    });

    it('limits results', () => {
      const items = [
        makeAccomplishment({ id: '1', tags: ['a', 'b', 'c', 'd'] }),
      ];
      const tops = getTopTags(items, 2);
      expect(tops).toHaveLength(2);
    });

    it('handles items with no tags', () => {
      const items = [makeAccomplishment({ id: '1', tags: [] })];
      const tops = getTopTags(items, 5);
      expect(tops).toHaveLength(0);
    });
  });

  describe('impact scoring', () => {
    it('calculates correct impact score', () => {
      const items = [
        makeAccomplishment({ id: '1', impactLevel: 'low' }),
        makeAccomplishment({ id: '2', impactLevel: 'high' }),
        makeAccomplishment({ id: '3', impactLevel: 'critical' }),
      ];
      const score = items.reduce((sum, a) => sum + impactWeight[a.impactLevel], 0);
      expect(score).toBe(1 + 3 + 4); // 8
    });
  });
});
