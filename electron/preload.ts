import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  handleReadFle: (callback: any) => ipcRenderer.on('read-file', callback),
  // どうしても型付け方法がわからないのでanyで逃げる(以下の実装だとパラメータ値が渡らない)
  /*
  // https://akabeko.me/blog/2020/12/electron-12/
  handleReadFle: (listener: (value: {textData: string, filePath: string}) => void) =>
      ipcRenderer.on('read-file', (event: IpcRendererEvent, value: {textData: string, filePath: string}) => listener(value))
      */

  handleGetData: (callback: any) => ipcRenderer.on('get-data', callback),

  handleSendWriteResult: (callback: any) => ipcRenderer.on('write-result', callback),

  isProdMode: () => ipcRenderer.invoke('prod-mode'),

  closeConfirm: () => ipcRenderer.invoke('close-confirm'),

  closeWindow: () => ipcRenderer.invoke('window-close'),

})