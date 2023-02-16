<script setup lang="ts">
// https://github.com/bazingaedward/monaco-editor-vue3/blob/main/src/MonacoEditor.vue
// https://github.com/nuxt/framework/discussions/5246
// https://berezuzu.medium.com/resizable-monaco-editor-3e922ad54e4
import type { Monaco } from '@monaco-editor/loader'
import type monaco from 'monaco-editor'
import { debounce } from 'lodash'

const APPBAR_HEIGHT = 48

interface Props {
  width?: number
  height?: number
  editData: string
  theme?: string
  isEnableScrollSync?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 0,
  height: 0,
  theme: 'vs',
  isEnableScrollSync: true,
})

const emit = defineEmits(['editorWillMount', 'editorDidMount', 'change', 'update:editData'])

const editorElement = ref<HTMLElement | null>(null)

const styleWidth = computed(() => `${props.width}px`)
const styleHeight = computed(() => `${props.height}px`)

const {
  isDirty,
  initilizeVersionId,
  updateCurrentVersionId,
} = useContentVersion()

const {
  initDirtyStete
} = useNofityDirtyState(isDirty)

watch(
  () => props.editData,
  () => {
    const versionId = getVersionId()
    if (versionId) {
      updateCurrentVersionId(versionId)
    }
  }
)

watch(
  () => [props.width, props.height],
  ([newWidth, newHeight]) => {
    editor.layout({ width: newWidth, height: newHeight })
  }
)

const resizeEditor = () => {
  if (editor && editorElement.value) {
    editor.layout({ width: props.width, height: props.height })
  }
}
//const debouncedResizeEditor = debounce(resizeEditor, 100, { maxWait: 200 })
const debouncedResizeEditor = debounce(resizeEditor)

let monaco_: Monaco
let editor: monaco.editor.IStandaloneCodeEditor

onMounted(() => {
  initMonaco()
  window.addEventListener('resize', debouncedResizeEditor)
  nextTick(() => {
      setTimeout(() => focus(), 500)
    })
})

onBeforeUnmount(() => {
  editor && editor.dispose()
  window.removeEventListener('resize', debouncedResizeEditor)
})

const focus = () => {
  editor?.focus()
}

watch(
  () => props.editData,
  (newVal) => {
    newVal !== getValue() && setValue(newVal)
  }
)

const height = computed(() => props.height)
const isEnableScrollSync = computed(() => props.isEnableScrollSync)
const {
  setEditor,
} = useEditorScrollHandler(height, isEnableScrollSync)

const initMonaco = async () => {
  const loader = await import('@monaco-editor/loader').then(m => m?.default)
  monaco_ = await loader.init()
  emit('editorWillMount', monaco_)
  editor = monaco_.editor['create'](editorElement.value as HTMLElement, {
    value: props.editData,
    language: 'markdown',
    theme: props.theme,
    wordWrap: 'on',
    occurrencesHighlight: false,
    quickSuggestions: false,
  })

  if (editor) {
    setEditor(editor)
    const versionId = getVersionId()
    if (versionId) {
      initilizeVersionId(versionId)
      initDirtyStete()
    }
    editor.onDidChangeModelContent((event) => {
      const value = editor.getValue()
      if( props.editData != value) {
        emit('change', value, event)
        emit('update:editData', value)
      }
    })
  }

  emit('editorDidMount', editor)
}

const setValue = (value: string) => {
  if (editor) return (editor as monaco.editor.IStandaloneCodeEditor).setValue(value)
}

const getValue = () => {
  if (!editor) return ''
  return (editor as monaco.editor.IStandaloneCodeEditor).getValue()
}

const getVersionId = () => {
  if (!editor) return 1
  const model = (editor as monaco.editor.IStandaloneCodeEditor).getModel()
  if (!model) return 1
  return model.getAlternativeVersionId()
}
</script>

<template>
  <div
    ref="editorElement"
    class="editor"
  />
</template>

<style scoped>
.editor {
  text-align: left;
  width: v-bind(styleWidth);
  height: v-bind(styleHeight);
}
</style>
