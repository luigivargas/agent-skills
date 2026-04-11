import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { app } from 'electron';
import { AppData, Accomplishment, DEFAULT_APP_DATA } from '../shared/types';

export interface Store {
  loadData(): AppData;
  saveData(data: AppData): void;
  addAccomplishment(accomplishment: Accomplishment): AppData;
  updateAccomplishment(accomplishment: Accomplishment): AppData;
  deleteAccomplishment(id: string): AppData;
}

export function getStorePath(): string {
  return join(app.getPath('userData'), 'accomplishments-data.json');
}

export function createStore(filePath?: string): Store {
  const storePath = filePath ?? getStorePath();

  function loadData(): AppData {
    try {
      if (!existsSync(storePath)) {
        saveData(DEFAULT_APP_DATA);
        return DEFAULT_APP_DATA;
      }
      const raw = readFileSync(storePath, 'utf-8');
      const data: AppData = JSON.parse(raw);
      return data;
    } catch {
      return DEFAULT_APP_DATA;
    }
  }

  function saveData(data: AppData): void {
    const dir = dirname(storePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    // Atomic write: write to temp then rename
    const tmpPath = storePath + '.tmp';
    writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    const { renameSync } = require('fs');
    renameSync(tmpPath, storePath);
  }

  function addAccomplishment(accomplishment: Accomplishment): AppData {
    const data = loadData();
    data.accomplishments.push(accomplishment);
    saveData(data);
    return data;
  }

  function updateAccomplishment(accomplishment: Accomplishment): AppData {
    const data = loadData();
    const index = data.accomplishments.findIndex((a) => a.id === accomplishment.id);
    if (index === -1) {
      throw new Error(`Accomplishment not found: ${accomplishment.id}`);
    }
    data.accomplishments[index] = accomplishment;
    saveData(data);
    return data;
  }

  function deleteAccomplishment(id: string): AppData {
    const data = loadData();
    data.accomplishments = data.accomplishments.filter((a) => a.id !== id);
    saveData(data);
    return data;
  }

  return { loadData, saveData, addAccomplishment, updateAccomplishment, deleteAccomplishment };
}
