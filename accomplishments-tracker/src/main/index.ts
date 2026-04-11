import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { createStore } from './store';
import { IPC_CHANNELS, Accomplishment } from '../shared/types';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  const store = createStore();

  ipcMain.handle(IPC_CHANNELS.LOAD_DATA, () => {
    return store.loadData();
  });

  ipcMain.handle(IPC_CHANNELS.SAVE_DATA, (_event, data) => {
    store.saveData(data);
  });

  ipcMain.handle(IPC_CHANNELS.ADD_ACCOMPLISHMENT, (_event, accomplishment: Accomplishment) => {
    return store.addAccomplishment(accomplishment);
  });

  ipcMain.handle(IPC_CHANNELS.UPDATE_ACCOMPLISHMENT, (_event, accomplishment: Accomplishment) => {
    return store.updateAccomplishment(accomplishment);
  });

  ipcMain.handle(IPC_CHANNELS.DELETE_ACCOMPLISHMENT, (_event, id: string) => {
    return store.deleteAccomplishment(id);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
