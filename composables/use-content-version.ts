/**
 * 更新管理
 * @returns 更新管理関数
 */
export const useContentVersion = () => {
  const _originalVersionId = useState('originalVersion', () => 1)
  const _currentVersioId = useState('currentVersionId', () => 1)

  const initilizeVersionId = (versionId: number) => {
    _originalVersionId.value = versionId
    updateCurrentVersionId(versionId)
    debug()
  }

  const clearDirty = () => {
    _originalVersionId.value = _currentVersioId.value
    debug()
  }

  const isDirty = computed(() => _originalVersionId.value !== _currentVersioId.value)

  const updateCurrentVersionId = (versionId: number) => {
    _currentVersioId.value = versionId
    debug()
  }

  const debug = () => {
    console.log(`originalVersionId=${_originalVersionId.value}, currentVersionId=${_currentVersioId.value}, isDirty=${isDirty.value}`)
  }

  return {
    initilizeVersionId,
    clearDirty,
    isDirty,
    updateCurrentVersionId,
  }
}
