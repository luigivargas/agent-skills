import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, AppData, Accomplishment } from '../shared/types';

const api = {
  loadData: (): Promise<AppData> => ipcRenderer.invoke(IPC_CHANNELS.LOAD_DATA),
  saveData: (data: AppData): Promise<void> => ipcRenderer.invoke(IPC_CHANNELS.SAVE_DATA, data),
  addAccomplishment: (accomplishment: Accomplishment): Promise<AppData> =>
    ipcRenderer.invoke(IPC_CHANNELS.ADD_ACCOMPLISHMENT, accomplishment),
  updateAccomplishment: (accomplishment: Accomplishment): Promise<AppData> =>
    ipcRenderer.invoke(IPC_CHANNELS.UPDATE_ACCOMPLISHMENT, accomplishment),
  deleteAccomplishment: (id: string): Promise<AppData> =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_ACCOMPLISHMENT, id),
};

contextBridge.exposeInMainWorld('api', api);

export type ElectronAPI = typeof api;
