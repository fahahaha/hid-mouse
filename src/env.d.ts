/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'webhid' {
  interface HIDDevice {
    vendorId: number
    productId: number
    productName: string
    manufacturerName?: string
    collections: HIDCollectionInfo[]
    opened: boolean

    open(): Promise<void>
    close(): Promise<void>
    sendReport(reportId: number, data: Uint8Array): Promise<void>
    receiveFeatureReport(reportId: number, data: Uint8Array): Promise<Uint8Array>
    sendFeatureReport(reportId: number, data: Uint8Array): Promise<void>
    addEventListener(type: 'inputreport', listener: (event: HIDInputReportEvent) => void): void
    removeEventListener(type: 'inputreport', listener: (event: HIDInputReportEvent) => void): void
  }

  interface HIDCollectionInfo {
    usagePage: number
    usage: number
    inputReports?: HIDReportInfo[]
    outputReports?: HIDReportInfo[]
    featureReports?: HIDReportInfo[]
    children?: HIDCollectionInfo[]
  }

  interface HIDReportInfo {
    reportId: number
    items: HIDReportItem[]
  }

  interface HIDReportItem {
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

  interface HIDInputReportEvent {
    readonly device: HIDDevice
    readonly reportId: number
    readonly data: DataView
  }

  interface HIDDeviceRequestOptions {
    filters: HIDDeviceFilter[]
  }

  interface HIDDeviceFilter {
    vendorId?: number
    productId?: number
    usagePage?: number
    usage?: number
  }

  interface HID {
    requestDevice(options: HIDDeviceRequestOptions): Promise<HIDDevice[]>
    getDevices(): Promise<HIDDevice[]>
    addEventListener(type: 'connect', listener: (event: HIDConnectionEvent) => void): void
    addEventListener(type: 'disconnect', listener: (event: HIDConnectionEvent) => void): void
    removeEventListener(type: 'connect', listener: (event: HIDConnectionEvent) => void): void
    removeEventListener(type: 'disconnect', listener: (event: HIDConnectionEvent) => void): void
  }

  interface HIDConnectionEvent {
    readonly device: HIDDevice
  }

  interface Navigator {
    hid: HID
  }
}