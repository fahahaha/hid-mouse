// HID设备相关类型
export interface HIDDeviceExtended {
  productName: string
  manufacturerName?: string
  vendorId: number
  productId: number
  collections: HIDCollectionInfo[]
  opened: boolean
  // 原生HID设备方法
  open(): Promise<void>
  close(): Promise<void>
  sendReport(reportId: number, data: Uint8Array): Promise<void>
  receiveFeatureReport(reportId: number, data: Uint8Array): Promise<Uint8Array>
  sendFeatureReport(reportId: number, data: Uint8Array): Promise<void>
  addEventListener(type: 'inputreport', listener: (event: HIDInputReportEvent) => void): void
  removeEventListener(type: 'inputreport', listener: (event: HIDInputReportEvent) => void): void
}

export interface HIDInputReportEvent {
  readonly device: HIDDevice
  readonly reportId: number
  readonly data: DataView
}

export interface HIDCollectionInfo {
  usagePage: number
  usage: number
  inputReports?: HIDReportInfo[]
  outputReports?: HIDReportInfo[]
  featureReports?: HIDReportInfo[]
  children?: HIDCollectionInfo[]
}

export interface HIDReportInfo {
  reportId: number
  items: HIDReportItem[]
}

export interface HIDReportItem {
  isRange: boolean
  isAbsolute: boolean
  hasNull: boolean
  reportSize: number
  reportCount: number
  unitExponent: number
  unit: number
  logicalMinimum?: number
  logicalMaximum?: number
  physicalMinimum?: number
  physicalMaximum?: number
  usageMinimum?: number
  usageMaximum?: number
  usages?: number[]
  dataMinimum?: number
  dataMaximum?: number
}

// 设备配置相关类型
export interface DeviceConfig {
  cpi: number
  pollingRate: number
  buttonMapping: ButtonMapping
  doubleClickSpeed: number
  scrollSpeed: number
  sensorSettings: SensorSettings
  lightingSettings: LightingSettings
}

export interface ButtonMapping {
  swapLeftRight: boolean
  invertScroll: boolean
}

export interface SensorSettings {
  angleSnapping: boolean
  acceleration: boolean
}

export interface LightingSettings {
  mode: LightingMode
  brightness: number
}

export type LightingMode = 'off' | 'static' | 'breathing' | 'rainbow' | 'reactive'

// 宏相关类型
export interface MacroStep {
  type: 'mousedown' | 'mouseup' | 'keydown' | 'keyup'
  button?: number
  key?: string
  code?: string
  time: number
}

export interface Macro {
  id: number
  name: string
  steps: MacroStep[]
  binding?: MacroBinding
  createdAt: Date
  updatedAt: Date
}

export interface MacroBinding {
  button: MouseButton
  macroId: number
}

export type MouseButton = 'button4' | 'button5' | 'doubleclick' | 'scrollup' | 'scrolldown'

// 应用状态类型
export interface AppState {
  device: HIDDeviceExtended | null
  isConnected: boolean
  isSupported: boolean
  deviceConfig: DeviceConfig
  macros: Macro[]
  selectedMacroId: number
  isRecording: boolean
  message: {
    text: string
    type: 'success' | 'error' | 'warning' | 'info'
    visible: boolean
  }
}

// 报告类型
export interface ReportCommand {
  reportId: number
  command: number
  data: number[]
}

// 设备诊断信息
export interface DeviceDiagnostic {
  vendorId: number
  productId: number
  productName: string
  manufacturerName?: string
  hasInputReports: boolean
  hasOutputReports: boolean
  hasFeatureReports: boolean
  supportedReportIds: number[]
  isConfigurable: boolean
}