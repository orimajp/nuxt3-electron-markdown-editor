import { IpcRendererEvent } from "electron";
import { FileData } from "~~/models/FileData";
import { WriteResult } from "~~/models/WriteResult";

export interface IElectronAPI {
  // https://zenn.dev/rakim_stayfresh/articles/2928ac74a153a5
//  handleReadFle: (callback: (event: IpcRendererEvent, value: {textData: string, filePath: string}) => void) => () => void,
  handleReadFle: (callback: (event: IpcRendererEvent, value: FileData) => void) => () => void,
  handleGetData: (callback: (event: IpcRendererEvent) => void ) => () => void,
  handleSendWriteResult:(callback: (event: IpcRendererEvent, value: WriteResult | void) => void) => () => void



}

declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
