<script setup lang="ts">
interface Props {
  documentTitle?: string
  syncMode?: Array<number>
  splitMode?: number
}

const props = withDefaults(defineProps<Props>(), {
  documentTitle: '',
  syncMode: () => [0],
  splitMode: 1,
})

const emit = defineEmits<{
  (e: 'update:syncMode', num: Array<number> ): void
  (e: 'update:splitMode', num: number): void
}>()

const syncMode = computed({
  get: () => props.syncMode,
  set: (val) => emit('update:syncMode', val)
})

const splitMode = computed({
  get: () => props.splitMode,
  set: (val) => emit('update:splitMode', val)
})

const { isDirty, } = useContentVersion()
const documentTitle = computed(() => props.documentTitle === '' ? '(タイトルなし)' : props.documentTitle)
const displayDocumentTitle = computed(() => isDirty.value ? `(*) ${documentTitle.value}` : `${documentTitle.value}`)
</script>

<template>
  <v-app-bar
  density="compact"
   class="text-grey-darken-1"
  >
  <v-app-bar-title
      class="title"
    >
    {{ displayDocumentTitle  }}
  </v-app-bar-title>
  <v-spacer></v-spacer>
  <v-btn-toggle
      v-model="syncMode"
      multiple
      variant="outlined"
      density="compact"
      class="button-group text-grey-darken-1"
    >
      <v-btn
        tabindex="-1"
      >
        S
      </v-btn>
    </v-btn-toggle>
    <v-btn-toggle
      v-model="splitMode"
      mandatory
      variant="outlined"
      density="compact"
      class="button-group text-grey-darken-1"
    >
      <v-btn
        tabindex="-1"
      >
        E
      </v-btn>
      <v-btn
        tabindex="-1"
      >
        B
      </v-btn>
      <v-btn
        tabindex="-1"
      >
        P
      </v-btn>
    </v-btn-toggle>
  </v-app-bar>
</template>

<style scoped>

.title {
  font-size: 90%;
  margin-right: 16px;
}
.button-group {
  margin-right: 8px;
}
</style>
