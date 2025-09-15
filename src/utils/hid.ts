import type { HIDDeviceExtended, ReportCommand } from '@/types'

// 扩展Window接口以包含WebHID API
declare global {
  interface Navigator {
    hid: {
      requestDevice: (options: any) => Promise<any[]>
      getDevices: () => Promise<any[]>
    }
  }
}

/**
 * 检查浏览器是否支持WebHID API
 */
export function isWebHIDSupported(): boolean {
  return 'hid' in navigator
}

/**
 * 请求HID设备访问权限
 */
export async function requestHIDDevice(): Promise<HIDDeviceExtended[]> {
  if (!isWebHIDSupported()) {
    throw new Error('浏览器不支持WebHID API')
  }

  const HID_MOUSE_USAGE_PAGE = 0x01
  const HID_MOUSE_USAGE = 0x02

  const devices = await navigator.hid.requestDevice({
    filters: [{
      usagePage: HID_MOUSE_USAGE_PAGE,
      usage: HID_MOUSE_USAGE
    }]
  })

  return devices.map((device: any) => ({
    productName: device.productName,
    manufacturerName: device.manufacturerName,
    vendorId: device.vendorId,
    productId: device.productId,
    collections: device.collections,
    opened: device.opened,
    // 原生HID设备方法
    open: device.open.bind(device),
    close: device.close.bind(device),
    sendReport: device.sendReport.bind(device),
    receiveFeatureReport: device.receiveFeatureReport?.bind(device),
    sendFeatureReport: device.sendFeatureReport?.bind(device),
    addEventListener: device.addEventListener.bind(device),
    removeEventListener: device.removeEventListener.bind(device)
  }))
}

/**
 * 获取已授权的HID设备
 */
export async function getAuthorizedDevices(): Promise<HIDDeviceExtended[]> {
  if (!isWebHIDSupported()) {
    return []
  }
  const devices = await navigator.hid.getDevices()
  return devices.map((device: any) => ({
    productName: device.productName,
    manufacturerName: device.manufacturerName,
    vendorId: device.vendorId,
    productId: device.productId,
    collections: device.collections,
    opened: device.opened,
    // 原生HID设备方法
    open: device.open.bind(device),
    close: device.close.bind(device),
    sendReport: device.sendReport.bind(device),
    receiveFeatureReport: device.receiveFeatureReport?.bind(device),
    sendFeatureReport: device.sendFeatureReport?.bind(device),
    addEventListener: device.addEventListener.bind(device),
    removeEventListener: device.removeEventListener.bind(device)
  }))
}

/**
 * 打开HID设备
 */
export async function openDevice(device: HIDDeviceExtended): Promise<void> {
  try {
    console.log('打开设备:', device.productName)
    await device.open()
  } catch (error) {
    throw new Error(`打开设备失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 关闭HID设备
 */
export async function closeDevice(device: HIDDeviceExtended): Promise<void> {
  try {
    console.log('关闭设备:', device.productName)
    await device.close()
  } catch (error) {
    throw new Error(`关闭设备失败: ${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 发送HID报告
 */
export async function sendReport(
  device: HIDDeviceExtended,
  reportId: number,
  data: number[]
): Promise<boolean> {
  try {
    console.log(`发送报告ID: ${reportId}, 数据:`, data)

    // 使用真正的设备sendReport方法
    await device.sendReport(reportId, new Uint8Array(data))
    return true
  } catch (error) {
    console.error('发送HID报告失败:', error)
    return false
  }
}

/**
 * 发送参数到设备
 */
export async function sendParameterToDevice(
  device: HIDDeviceExtended,
  command: ReportCommand
): Promise<boolean> {
  const { reportId, command: cmd, data } = command
  const fullData = [cmd, ...data]
  return await sendReport(device, reportId, fullData)
}

/**
 * 格式化设备ID
 */
export function formatDeviceId(vendorId: number, productId: number): string {
  return `VID:${vendorId.toString(16).padStart(4, '0').toUpperCase()} PID:${productId.toString(16).padStart(4, '0').toUpperCase()}`
}

/**
 * 延迟函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 安全的JSON解析
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json) as T
  } catch {
    return defaultValue
  }
}

/**
 * 生成唯一ID
 */
export function generateId(): number {
  return Date.now() + Math.floor(Math.random() * 1000)
}