<script setup lang="ts">
import { WriteFile } from '~~/models/WriteFile'
const documentTitle = ref('')
const filePath = ref('')
const editData = ref('')

const {
  clearDirty
} = useContentVersion()

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
