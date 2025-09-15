import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import type { MacroStep } from '@/types'

/**
 * 宏录制组合式函数
 */
export function useMacroRecorder() {
  const appStore = useAppStore()
  const isRecording = ref(false)
  const currentSteps = ref<MacroStep[]>([])
  const recordStartTime = ref(0)

  /**
   * 开始录制
   */
  const startRecording = () => {
    if (isRecording.value) return

    isRecording.value = true
    currentSteps.value = []
    recordStartTime.value = Date.now()
    appStore.setRecording(true)

    // 添加事件监听器
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    appStore.showMessage('开始录制宏...', 'info')
  }

  /**
   * 停止录制
   */
  const stopRecording = () => {
    if (!isRecording.value) return

    isRecording.value = false
    appStore.setRecording(false)

    // 移除事件监听器
    document.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('keyup', handleKeyUp)

    appStore.showMessage('录制已完成', 'success')
  }

  /**
   * 处理鼠标按下事件
   */
  const handleMouseDown = (e: MouseEvent) => {
    const time = Date.now() - recordStartTime.value
    const step: MacroStep = {
      type: 'mousedown',
      button: e.button,
      time
    }
    currentSteps.value.push(step)
    console.log('录制鼠标按下:', step)
  }

  /**
   * 处理鼠标释放事件
   */
  const handleMouseUp = (e: MouseEvent) => {
    const time = Date.now() - recordStartTime.value
    const step: MacroStep = {
      type: 'mouseup',
      button: e.button,
      time
    }
    currentSteps.value.push(step)
    console.log('录制鼠标释放:', step)
  }

  /**
   * 处理键盘按下事件
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    const time = Date.now() - recordStartTime.value
    const step: MacroStep = {
      type: 'keydown',
      key: e.key,
      code: e.code,
      time
    }
    currentSteps.value.push(step)
    console.log('录制键盘按下:', step)
  }

  /**
   * 处理键盘释放事件
   */
  const handleKeyUp = (e: KeyboardEvent) => {
    const time = Date.now() - recordStartTime.value
    const step: MacroStep = {
      type: 'keyup',
      key: e.key,
      code: e.code,
      time
    }
    currentSteps.value.push(step)
    console.log('录制键盘释放:', step)
  }

  /**
   * 保存宏
   */
  const saveMacro = () => {
    if (currentSteps.value.length === 0) {
      appStore.showMessage('请先录制宏操作', 'error')
      return false
    }

    const selectedMacro = appStore.selectedMacro
    if (!selectedMacro) {
      appStore.showMessage('请选择要保存的宏', 'error')
      return false
    }

    appStore.updateMacro(selectedMacro.id, {
      steps: currentSteps.value
    })

    appStore.showMessage(`宏 "${selectedMacro.name}" 已保存`, 'success')
    return true
  }

  /**
   * 清空录制
   */
  const clearRecording = () => {
    currentSteps.value = []
    appStore.showMessage('录制已清空', 'info')
  }

  /**
   * 播放宏（模拟）
   */
  const playMacro = (steps: MacroStep[]) => {
    if (steps.length === 0) {
      appStore.showMessage('没有可播放的宏', 'error')
      return
    }

    appStore.showMessage('正在播放宏...', 'info')

    let lastTime = 0
    steps.forEach(step => {
      const delay = step.time - lastTime
      lastTime = step.time

      setTimeout(() => {
        console.log(`执行宏步骤:`, step)
      }, delay)
    })
  }

  // 组件卸载时清理
  onUnmounted(() => {
    if (isRecording.value) {
      stopRecording()
    }
  })

  return {
    // 状态
    isRecording,
    currentSteps,

    // 方法
    startRecording,
    stopRecording,
    saveMacro,
    clearRecording,
    playMacro
  }
}