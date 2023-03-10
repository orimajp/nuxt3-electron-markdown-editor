<script setup lang="ts">
interface Props {
  documentTitle?: string
  editData?: string
}

const props = withDefaults(defineProps<Props>(), {
  documentTitle: '',
  editData: '',
})

const emit = defineEmits<{
  (e: 'update:editData', text: string): void
}>()

const editData = computed({
  get: () => props.editData,
  set: (val) => emit('update:editData', val)
})

const syncMode = ref([0])
const splitMode = ref(1)
const mainEl = ref<HTMLElement | null>(null)

const {
  editorWidth,
} = useEditorWidth(splitMode)

const {
  changeDelayState,
} = useScrollDelay()

watch(
  () => splitMode.value,
  () => changeDelayState()
)

const isEnableScrollSync = computed(() => syncMode.value.length > 0)
const editorWidthRatio = computed(() => `${editorWidth.value}%`)
const previewerWidthRatio = computed(() => `${100 - editorWidth.value}%`)

const {
  initializeScrollPosition,
} = useContentScrollPosition()

initializeScrollPosition()

const { width, height } = useWindowSize()
const editorWidthPx = computed(() => width.value * editorWidth.value / 100)
const contentHeight = computed(() => height.value - 48)
const contentHeightPx = computed(() => `${contentHeight.value}px`)
</script>

<template>
  <EditNavbar
    :document-title="documentTitle"
    v-model:syncMode="syncMode"
    v-model:splitMode="splitMode"
  />
  <v-main class="all-area" ref="mainEl">
    <EditMarkdownEditor
      v-model:editData="editData"
      :width="editorWidthPx"
      :height="contentHeight"
      :isEnableScrollSync="isEnableScrollSync"
      theme="vs-dark"
      class="editor-area"
    />
    <EditMarkdownPreviewer
      :renderText="editData"
      :isEnableScrollSync="isEnableScrollSync"
      class="previewer-area"
    />
  </v-main>
</template>

<style scoped>
.all-area {
  display: flex;
  height: 100%;
}
.editor-area {
  width: v-bind(editorWidthRatio);
  height: v-bind(contentHeightPx);
  background-color: black;
}
.previewer-area {
  width: v-bind(previewerWidthRatio);
  height: v-bind(contentHeightPx);
  overflow: auto;
  background-color: #0d1117;
}
</style>
