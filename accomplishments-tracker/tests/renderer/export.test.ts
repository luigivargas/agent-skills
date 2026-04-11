import { describe, it, expect } from 'vitest';
import { exportToMarkdown, exportToCsv } from '../../src/renderer/lib/export';
import { Accomplishment } from '../../src/shared/types';

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

describe('exportToMarkdown', () => {
  it('generates markdown with title and accomplishments', () => {
    const items = [makeAccomplishment({ title: 'Built feature X' })];
    const md = exportToMarkdown(items, 'Q1 Report');

    expect(md).toContain('# Q1 Report');
    expect(md).toContain('## Technical');
    expect(md).toContain('### Built feature X');
    expect(md).toContain('**Date:** 2026-01-15');
    expect(md).toContain('**Impact:** medium');
  });

  it('groups by category', () => {
    const items = [
      makeAccomplishment({ title: 'API work', category: 'technical' }),
      makeAccomplishment({ title: 'Led standup', category: 'leadership' }),
    ];
    const md = exportToMarkdown(items, 'Report');

    expect(md).toContain('## Technical');
    expect(md).toContain('## Leadership');
  });

  it('includes tags and evidence links', () => {
    const items = [
      makeAccomplishment({
        tags: ['react', 'typescript'],
        evidenceLinks: ['https://github.com/pr/1'],
      }),
    ];
    const md = exportToMarkdown(items, 'Report');

    expect(md).toContain('**Tags:** react, typescript');
    expect(md).toContain('https://github.com/pr/1');
  });
});

describe('exportToCsv', () => {
  it('generates CSV with headers', () => {
    const items = [makeAccomplishment()];
    const csv = exportToCsv(items);
    const lines = csv.split('\n');

    expect(lines[0]).toBe('Title,Description,Date,Category,Impact Level,Tags,Evidence Links');
    expect(lines).toHaveLength(2);
  });

  it('escapes commas in values', () => {
    const items = [makeAccomplishment({ title: 'Built feature, with commas' })];
    const csv = exportToCsv(items);

    expect(csv).toContain('"Built feature, with commas"');
  });

  it('escapes quotes in values', () => {
    const items = [makeAccomplishment({ description: 'Used "best" practices' })];
    const csv = exportToCsv(items);

    expect(csv).toContain('"Used ""best"" practices"');
  });

  it('handles multiple accomplishments', () => {
    const items = [
      makeAccomplishment({ id: '1', title: 'First' }),
      makeAccomplishment({ id: '2', title: 'Second' }),
    ];
    const csv = exportToCsv(items);
    const lines = csv.split('\n');

    expect(lines).toHaveLength(3); // header + 2 rows
  });
});
