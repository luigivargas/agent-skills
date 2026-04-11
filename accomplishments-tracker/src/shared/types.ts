export type Category =
  | 'project'
  | 'leadership'
  | 'technical'
  | 'collaboration'
  | 'learning'
  | 'mentoring'
  | 'process-improvement'
  | 'other';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Accomplishment {
  id: string;
  title: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
  tags: string[];
  impactLevel: ImpactLevel;
  evidenceLinks: string[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  defaultCategory: Category;
  exportFormat: 'markdown' | 'csv' | 'pdf';
}

export interface AppData {
  version: number;
  accomplishments: Accomplishment[];
  customCategories: string[];
  settings: AppSettings;
}

export const DEFAULT_CATEGORIES: Category[] = [
  'project',
  'leadership',
  'technical',
  'collaboration',
  'learning',
  'mentoring',
  'process-improvement',
  'other',
];

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  defaultCategory: 'other',
  exportFormat: 'markdown',
};

export const DEFAULT_APP_DATA: AppData = {
  version: 1,
  accomplishments: [],
  customCategories: [],
  settings: DEFAULT_SETTINGS,
};

export const IPC_CHANNELS = {
  LOAD_DATA: 'store:load-data',
  SAVE_DATA: 'store:save-data',
  ADD_ACCOMPLISHMENT: 'store:add-accomplishment',
  UPDATE_ACCOMPLISHMENT: 'store:update-accomplishment',
  DELETE_ACCOMPLISHMENT: 'store:delete-accomplishment',
} as const;
