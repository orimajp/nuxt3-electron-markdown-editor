<script setup lang="ts">
import { WriteFile } from '~~/models/WriteFile'
const documentTitle = ref('')
const filePath = ref('')
const editData = ref('')

const {
  isDirty,
  clearDirty
} = useContentVersion()

const unloadEventListener = async (e: BeforeUnloadEvent) => {
  console.log('I do not want to be closed')
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = "aa" // これを入れないと必ず終了してしまう
    await window.electronAPI.closeConfirm()
  }
}

/*
onMounted(() => {
  window.addEventListener('beforeunload', unloadEventListener)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', unloadEventListener)
})
*/

/*
window.onbeforeunload = async (e) => {
  if (isDirty.value) {
//    e.returnValue = false
    const num = window.electronAPI.closeConfirm()
    if (num !== 0) {
//      window.electronAPI.closeWindow()
    }
    e.returnValue = false
    return false
//    return false
  } else {
//    e.returnValue = false
    window.electronAPI.closeWindow()
  }
}
*/

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
