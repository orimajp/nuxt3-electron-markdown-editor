export const useNofityDirtyState = (
  isDirty: ComputedRef<boolean>,
) => {

  const initDirtyStete = () => {
    noticeDirtyState(isDirty.value)
  }

  watch(
    () => isDirty.value,
    (newVal, oldVal) => {
      if (newVal !== oldVal) {
        console.log('notice dirty=' + newVal)
        noticeDirtyState(newVal)
      }
    }
  )

  const noticeDirtyState = (state: boolean) => {
    window.electronAPI.noticeDirty(state)
  }

  return {
    initDirtyStete,
  }
}
