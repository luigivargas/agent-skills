import { describe, it, expect } from 'vitest';
import {
  Accomplishment,
  Category,
  ImpactLevel,
  DEFAULT_APP_DATA,
  DEFAULT_CATEGORIES,
  DEFAULT_SETTINGS,
} from '../../src/shared/types';

describe('shared types', () => {
  it('DEFAULT_APP_DATA has correct structure', () => {
    expect(DEFAULT_APP_DATA.version).toBe(1);
    expect(DEFAULT_APP_DATA.accomplishments).toEqual([]);
    expect(DEFAULT_APP_DATA.customCategories).toEqual([]);
    expect(DEFAULT_APP_DATA.settings).toEqual(DEFAULT_SETTINGS);
  });

  it('DEFAULT_CATEGORIES contains all expected categories', () => {
    expect(DEFAULT_CATEGORIES).toContain('project');
    expect(DEFAULT_CATEGORIES).toContain('leadership');
    expect(DEFAULT_CATEGORIES).toContain('technical');
    expect(DEFAULT_CATEGORIES).toContain('collaboration');
    expect(DEFAULT_CATEGORIES).toContain('learning');
    expect(DEFAULT_CATEGORIES).toContain('mentoring');
    expect(DEFAULT_CATEGORIES).toContain('process-improvement');
    expect(DEFAULT_CATEGORIES).toContain('other');
    expect(DEFAULT_CATEGORIES).toHaveLength(8);
  });

  it('DEFAULT_SETTINGS has sensible defaults', () => {
    expect(DEFAULT_SETTINGS.theme).toBe('system');
    expect(DEFAULT_SETTINGS.defaultCategory).toBe('other');
    expect(DEFAULT_SETTINGS.exportFormat).toBe('markdown');
  });
});
