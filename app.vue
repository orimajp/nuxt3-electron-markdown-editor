<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { WriteFile } from '~~/models/WriteFile'
const documentTitle = ref('')
const filePath = ref('')
const editData = ref('')

/*
onKeyStroke(['r', 'R', 'Control'], async (e) => {
  const mode = await window.electronAPI.isProdMode()
  console.log('Ctrl+R')
  if (mode) {
    e.preventDefault()
  }
  e.preventDefault()
//  alert(`mode=${mode}`)
  return false
})*/
/*
window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
  const message = '入力内容が保存されない可能性があります。ページを離れますか？'
  e.preventDefault()
  e.returnValue = message
  return message
})*/

/*
window.onbeforeunload = (e) => {
  console.log(e)
  console.log('I do not want to be closed')

  // メッセージボックスがユーザに表示される通常のブラウザーとは違って、
  // 無効でない値を返却すれば、何も表示せずにクローズをキャンセルします。
  // アプリケーションがクローズするのをユーザに確認させるには、
  // ダイアログAPIを使用することを推奨します。
  e.returnValue = false
}
*/

const { clearDirty } = useContentVersion()

window.electronAPI.handleReadFle((event, value) => {
  console.log(value)
  documentTitle.value = value.fileName
  filePath.value = value.filePath
  editData.value = value.fileData
  nextTick(() => {
    clearDirty()
  })
})

window.electronAPI.handleGetData((event) => {
  const writeFile: WriteFile = {
    filePath: filePath.value,
    fileData: editData.value,
  }
  event.sender.send('write-data', writeFile)
})

window.electronAPI.handleSendWriteResult((event, value) => {
  if (value) {
    filePath.value = value.filePath
    documentTitle.value = value.fileName
    nextTick(() => {
      clearDirty()
    })
  }
})
</script>

<template>
  <v-app>
    <MarkdownEditor
      :document-title="documentTitle"
      v-model:editData="editData"
    />
  </v-app>
</template>
