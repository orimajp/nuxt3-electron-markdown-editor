/**
 * 分割位置変更で発生する謎のスクロールを暫定的に回避
 * @returns 関数、変数
 */
export const useScrollDelay = () => {
  const scrollDelay = useState('scrollDelay', () => false)

  const changeDelayState = () => {
    if (scrollDelay.value) return
    scrollDelay.value = true
    setTimeout(() => scrollDelay.value = false, 300)
  }

  return {
    changeDelayState,
    scrollDelay,
  }
}