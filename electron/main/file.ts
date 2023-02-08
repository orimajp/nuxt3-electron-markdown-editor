import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { FileData } from '~~/models/FileData'
import { WriteFile } from '~~/models/WriteFile'
import { WriteResult } from '~~/models/WriteResult'

//export const openFile = async (): Promise<null | { textData: string, filePath: string }> => {
export const openFile = async (): Promise<null | FileData> => {
  const win = BrowserWindow.getFocusedWindow() as BrowserWindow

  const result = await dialog.showOpenDialog(
    win,
    // どんなダイアログを出すかを指定するプロパティ
    {
      properties: ["openFile"],
      filters: [
        {
          name: "Documents",
          // 読み込み可能な拡張子を指定
//          extensions: ["txt", "html", "md", "js", "ts"],
          extensions: ["md"],
        },
      ],
    }
  )

  // [ファイル選択]ダイアログが閉じられた後の処理
  if (result.filePaths.length > 0) {
    const filePath = result.filePaths[0];

    const fileName = path.basename(filePath)

    // テキストファイルを読み込む
    const textData = fs.readFileSync(filePath, "utf8");
    // ファイルパスとテキストデータを返却

    const readFile: FileData = {
      fileName: fileName,
      filePath: filePath,
      fileData: textData,
    }

//    return {
//      filePath,
//      textData,
//    }
    return readFile
  }

  // ファイル選択ダイアログで何も選択しなかった場合は、nullを返しておく
  return null
}

export const saveFile = async (event: Event, writeFile: WriteFile): Promise<WriteResult | void> => {
  let saveFilePath: string
  
  //　初期の入力エリアに設定されたテキストを保存しようとしたときは新規ファイルを作成する
  if (writeFile.filePath) {
    saveFilePath = writeFile.filePath;
  } else {
    const win = BrowserWindow.getFocusedWindow() as BrowserWindow
    // 新規ファイル保存の場合はダイアログをだし、ファイル名をユーザーに決定してもらう
    const result = await dialog.showSaveDialog(
      win,
      // どんなダイアログを出すかを指定するプロパティ
      {
        //@ts-ignore
        properties: ["openFile"],
        filters: [
          {
            name: "Documents",
            extensions: ["md"],
          },
        ],
      }
    );
    // キャンセルした場合
    if (result.canceled) {
      // 処理を中断
      return;
    }
    saveFilePath = result.filePath as string;
  }

  // ファイルを保存
  fs.writeFileSync(saveFilePath, writeFile.fileData);

  const saveFileName = path.basename(saveFilePath)
  const writeResult: WriteResult = {
    fileName: saveFileName,
    filePath: saveFilePath,
  }

  return writeResult
}
