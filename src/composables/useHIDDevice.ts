import { ref, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  requestHIDDevice,
  getAuthorizedDevices,
  openDevice,
  closeDevice,
  sendParameterToDevice,
  sendReport
} from '@/utils/hid'
import type { HIDDeviceExtended, ReportCommand } from '@/types'

/**
 * HID设备管理组合式函数
 */
export function useHIDDevice() {
  const appStore = useAppStore()
  const isLoading = ref(false)

  /**
   * 连接设备
   */
  const connectDevice = async () => {
    if (!appStore.isSupported) {
      appStore.showMessage('浏览器不支持WebHID API', 'error')
      return
    }

    isLoading.value = true
    try {
      // 检查是否有已授权的设备
      const authorizedDevices = await getAuthorizedDevices()
      let device: HIDDeviceExtended

      if (authorizedDevices.length > 0) {
        device = authorizedDevices[0]
      } else {
        // 请求用户选择设备
        const devices = await requestHIDDevice()
        if (devices.length === 0) {
          appStore.showMessage('未选择设备', 'warning')
          return
        }
        device = devices[0]
      }

      // 打开设备
      await openDevice(device)

      // 设置设备事件监听器
      setupDeviceListeners(device)

      // 更新状态
      appStore.setDevice(device)
      appStore.showMessage('设备连接成功', 'success')
    } catch (error) {
      appStore.showMessage(`连接设备失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error')
      console.error('HID连接错误:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 断开设备
   */
  const disconnectDevice = async () => {
    const device = appStore.device
    if (!device) return

    isLoading.value = true
    try {
      await closeDevice(device)
      appStore.setDevice(null)
      appStore.showMessage('设备已断开连接', 'info')
    } catch (error) {
      appStore.showMessage(`断开设备失败: ${error instanceof Error ? error.message : '未知错误'}`, 'error')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 设置设备事件监听器
   */
  const setupDeviceListeners = (device: HIDDeviceExtended) => {
    console.log('设置设备事件监听器:', device.productName)
  }

  /**
   * 处理输入报告
   */
  const handleInputReport = (event: any) => {
    const { data, device: reportDevice, reportId } = event
    console.log(`从设备 ${reportDevice.productName} 接收报告 #${reportId}:`, data)
  }

  /**
   * 发送配置到设备
   */
  const sendConfig = async (command: ReportCommand): Promise<boolean> => {
    const device = appStore.device
    if (!device) {
      appStore.showMessage('请先连接设备', 'error')
      return false
    }

    const success = await sendParameterToDevice(device, command)
    if (success) {
      appStore.showMessage('配置已成功应用', 'success')
    } else {
      appStore.showMessage('配置应用失败', 'error')
    }
    return success
  }

  /**
   * 诊断设备
   */
  const diagnoseDevice = async () => {
    const device = appStore.device
    if (!device) {
      appStore.showMessage('请先连接设备', 'error')
      return
    }

    console.log('=== 设备诊断信息 ===')
    console.log('设备信息:', {
      vendorId: device.vendorId,
      productId: device.productId,
      productName: device.productName,
      manufacturerName: device.manufacturerName,
      collections: device.collections
    })

    appStore.showMessage(`设备VID: ${device.vendorId.toString(16)}, PID: ${device.productId.toString(16)}`, 'info')

    // 测试基本的报告发送
    const testReports = [
      { id: 0x00, data: [0x00] },
      { id: 0x01, data: [0x01] },
      { id: 0x02, data: [0x02] }
    ]

    let successCount = 0
    for (const report of testReports) {
      try {
        await sendReport(device, report.id, report.data)
        console.log(`成功发送报告 ID: ${report.id}`)
        successCount++
      } catch (e) {
        console.log(`发送报告 ID: ${report.id} 失败:`, e instanceof Error ? e.message : e)
      }
    }

    if (successCount === 0) {
      appStore.showMessage('警告：设备不支持写入操作，可能是标准只读HID设备', 'error')
      console.log('设备功能分析：这是一个标准的HID鼠标设备，不支持自定义配置')
    } else {
      appStore.showMessage(`设备支持 ${successCount} 个报告ID的写入操作`, 'success')
    }
  }

  // 组件挂载时初始化
  onMounted(() => {
    appStore.setSupported('hid' in navigator)
  })

  // 组件卸载时清理
  onUnmounted(() => {
    if (appStore.device) {
      // 清理设备监听器
      console.log('清理设备监听器')
    }
  })

  return {
    // 状态
    isLoading,

    // 方法
    connectDevice,
    disconnectDevice,
    sendConfig,
    diagnoseDevice
  }
}