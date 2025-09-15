import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AppState, DeviceConfig, Macro, DeviceDiagnostic, HIDDeviceExtended } from '@/types'

export const useAppStore = defineStore('app', () => {
  // 状态
  const device = ref<HIDDeviceExtended | null>(null)
  const isConnected = ref(false)
  const isSupported = ref(false)
  const deviceConfig = ref<DeviceConfig>({
    cpi: 1600,
    pollingRate: 1000,
    buttonMapping: {
      swapLeftRight: false,
      invertScroll: false
    },
    doubleClickSpeed: 500,
    scrollSpeed: 3,
    sensorSettings: {
      angleSnapping: false,
      acceleration: false
    },
    lightingSettings: {
      mode: 'static',
      brightness: 70
    }
  })
  const macros = ref<Macro[]>([])
  const selectedMacroId = ref(1)
  const isRecording = ref(false)
  const message = ref({
    text: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    visible: false
  })
  const deviceDiagnostic = ref<DeviceDiagnostic | null>(null)

  // 计算属性
  const selectedMacro = computed(() =>
    macros.value.find(macro => macro.id === selectedMacroId.value)
  )

  const deviceInfo = computed(() => {
    if (!device.value) return null
    return {
      vendorId: device.value.vendorId,
      productId: device.value.productId,
      productName: device.value.productName,
      manufacturerName: device.value.manufacturerName
    }
  })

  // 操作方法
  function setDevice(newDevice: HIDDeviceExtended | null) {
    device.value = newDevice
    isConnected.value = !!newDevice
  }

  function setSupported(supported: boolean) {
    isSupported.value = supported
  }

  function updateConfig(newConfig: Partial<DeviceConfig>) {
    deviceConfig.value = { ...deviceConfig.value, ...newConfig }
  }

  function addMacro(macro: Macro) {
    macros.value.push(macro)
    saveMacrosToStorage()
  }

  function updateMacro(macroId: number, updates: Partial<Macro>) {
    const index = macros.value.findIndex(m => m.id === macroId)
    if (index !== -1) {
      macros.value[index] = {
        ...macros.value[index],
        ...updates,
        updatedAt: new Date()
      }
      saveMacrosToStorage()
    }
  }

  function deleteMacro(macroId: number) {
    macros.value = macros.value.filter(m => m.id !== macroId)
    saveMacrosToStorage()
  }

  function setSelectedMacroId(id: number) {
    selectedMacroId.value = id
  }

  function setRecording(recording: boolean) {
    isRecording.value = recording
  }

  function showMessage(text: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    message.value = { text, type, visible: true }
    setTimeout(() => {
      message.value.visible = false
    }, 3000)
  }

  function setDeviceDiagnostic(diagnostic: DeviceDiagnostic) {
    deviceDiagnostic.value = diagnostic
  }

  // 持久化方法
  function saveMacrosToStorage() {
    try {
      localStorage.setItem('hid-mouse-macros', JSON.stringify(macros.value))
    } catch (error) {
      console.error('保存宏数据失败:', error)
    }
  }

  function loadMacrosFromStorage() {
    try {
      const stored = localStorage.getItem('hid-mouse-macros')
      if (stored) {
        macros.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('加载宏数据失败:', error)
    }
  }

  // 初始化
  function init() {
    // 检查WebHID支持
    isSupported.value = 'hid' in navigator
    // 加载保存的宏
    loadMacrosFromStorage()

    // 初始化默认宏
    if (macros.value.length === 0) {
      const defaultMacros: Macro[] = [
        {
          id: 1,
          name: '宏 1',
          steps: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: '宏 2',
          steps: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          name: '宏 3',
          steps: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          name: '宏 4',
          steps: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      macros.value = defaultMacros
      saveMacrosToStorage()
    }
  }

  return {
    // 状态
    device,
    isConnected,
    isSupported,
    deviceConfig,
    macros,
    selectedMacroId,
    isRecording,
    message,
    deviceDiagnostic,

    // 计算属性
    selectedMacro,
    deviceInfo,

    // 操作方法
    setDevice,
    setSupported,
    updateConfig,
    addMacro,
    updateMacro,
    deleteMacro,
    setSelectedMacroId,
    setRecording,
    showMessage,
    setDeviceDiagnostic,
    init
  }
})