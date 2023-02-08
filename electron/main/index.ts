// https://gitlab.com/nikosdendrinos/electron-nuxt3-boilerplate/-/blob/main/electron/main/index.ts
// https://github.com/ics-creative/150819_electron_text_editor/blob/maiin/src/main.js
import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import { createMenu } from './menu'
import { openFile, saveFile } from './file'

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html

process.env.ROOT = path.join(__dirname, '../..')
process.env.DIST = path.join(process.env.ROOT, 'dist-electron')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.ROOT, 'public')
  : path.join(process.env.ROOT, '.output/public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const preload = path.join(process.env.DIST, 'preload.js')

const bootstrap = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 540,
    webPreferences: {
      preload,
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }
}

const createWindowFunc = () => {
  console.log('createWindw menu click')
  bootstrap()
}

const openFileFunc = async () => {
  console.log('openFile menu click')
  const result = await openFile()
//  console.log(result)

  const win = BrowserWindow.getFocusedWindow() as BrowserWindow
  win.webContents.send('read-file', result)
}

const saveFileFunc = () => {
  console.log('saveFile menu click')
//  saveFile()
  const win = BrowserWindow.getFocusedWindow() as BrowserWindow

  // TODO 書き込み処理(非同期が絡むとシーケンシャルな処理にはならない可能性がある)
  // * レンダープロセスにデータ取得依頼
  win.webContents.send('get-data')
}

createMenu(createWindowFunc ,openFileFunc, saveFileFunc)

app.whenReady().then(() => {
  bootstrap()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) bootstrap()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('write-data', async (event, value) => {
  console.log('write-data')
  console.log(value)

  // * ファイル書き込み
  const writeResult = await saveFile(event, value)

  // * レンダープロセスに書き込み結果返却
  const win = BrowserWindow.getFocusedWindow() as BrowserWindow
  win.webContents.send('write-result', writeResult)  
})