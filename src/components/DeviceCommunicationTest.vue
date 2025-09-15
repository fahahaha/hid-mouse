<template>
  <div class="device-card">
    <h3 class="text-lg font-semibold mb-4 flex items-center">
      <el-icon class="mr-2">
        <Tools />
      </el-icon>
      设备诊断/调试工具
    </h3>

    <div class="space-y-4">
      <!-- 设备基础信息 -->
      <div class="bg-gray-50 p-3 rounded-lg">
        <h4 class="font-medium mb-2">设备基础信息</h4>
        <div class="text-sm space-y-1">
          <p><strong>VID:</strong> {{ deviceInfo.vendorId?.toString(16).toUpperCase().padStart(4, '0') }}</p>
          <p><strong>PID:</strong> {{ deviceInfo.productId?.toString(16).toUpperCase().padStart(4, '0') }}</p>
          <p><strong>产品名称:</strong> {{ deviceInfo.productName }}</p>
          <p><strong>制造商:</strong> {{ deviceInfo.manufacturerName || '未知' }}</p>
        </div>
      </div>

      <!-- Collections详细信息 -->
      <div class="bg-blue-50 p-3 rounded-lg">
        <h4 class="font-medium mb-2">Collections 信息</h4>
        <div v-if="collectionsInfo.length > 0" class="text-sm space-y-2">
          <div v-for="(collection, index) in collectionsInfo" :key="index" class="bg-white p-2 rounded border">
            <p><strong>Collection {{ index + 1 }}:</strong></p>
            <p class="ml-4">Usage Page: {{ collection.usagePage?.toString(16) }}</p>
            <p class="ml-4">Usage: {{ collection.usage?.toString(16) }}</p>
            <div v-if="collection.reports && collection.reports.length > 0" class="ml-4">
              <p class="font-medium">Reports:</p>
              <div v-for="report in collection.reports" :key="report.reportId" class="ml-4 text-xs">
                <p>Report ID: {{ report.reportId }}</p>
                <p>Items: {{ report.items?.length || 0 }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-gray-500">
          暂无Collections信息
        </div>
      </div>

      <!-- Report ID枚举测试 -->
      <div class="bg-green-50 p-3 rounded-lg">
        <h4 class="font-medium mb-2">可写的Report ID枚举</h4>
        <div class="flex items-center gap-2 mb-2">
          <el-button size="small" @click="enumerateWritableReports" :loading="isEnumerating">
            开始枚举
          </el-button>
          <span class="text-sm text-gray-600">测试0-255所有Report ID</span>
        </div>

        <!-- 枚举结果 -->
        <div v-if="writableReports.length > 0" class="text-sm">
          <p class="font-medium mb-1">可写的Report ID:</p>
          <div class="flex flex-wrap gap-1">
            <el-tag
              v-for="reportId in writableReports"
              :key="reportId"
              size="small"
              type="success"
              class="text-xs"
            >
              0x{{ reportId.toString(16).toUpperCase() }}
            </el-tag>
          </div>
        </div>

        <!-- 设备类型分析结果 -->
        <div v-if="deviceAnalysis && !writableReports.length" class="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
          <h5 class="font-medium text-yellow-800 mb-2">🔍 设备类型分析</h5>
          <div class="text-sm space-y-2">
            <p>{{ deviceAnalysis.description }}</p>
            <div v-if="deviceAnalysis.recommendations.length > 0">
              <p class="font-medium">建议:</p>
              <ul class="ml-4 space-y-1">
                <li v-for="(recommendation, index) in deviceAnalysis.recommendations" :key="index" class="text-sm">
                  • {{ recommendation }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- 手动数据发送 -->
      <div class="bg-yellow-50 p-3 rounded-lg">
        <h4 class="font-medium mb-2">手动数据发送</h4>
        <div class="space-y-2">
          <div class="flex gap-2 items-center">
            <span class="text-sm font-medium w-16">Report ID:</span>
            <el-input-number
              v-model="manualReportId"
              :min="0"
              :max="255"
              size="small"
              style="width: 80px"
              placeholder="0-255"
            />
          </div>
          <div class="flex gap-2 items-center">
            <span class="text-sm font-medium w-16">数据:</span>
            <el-input
              v-model="manualData"
              size="small"
              placeholder="十六进制，空格分隔 (如: 10 64 06)"
              style="flex: 1"
            />
          </div>
          <div class="flex gap-2">
            <el-button size="small" @click="sendManualData" :loading="isSending">
              发送数据
            </el-button>
            <el-button size="small" @click="clearSendLog" type="info">
              清空日志
            </el-button>
          </div>
        </div>

        <!-- 发送结果日志 -->
        <div v-if="sendLog.length > 0" class="mt-3">
          <h5 class="text-sm font-medium mb-1">发送日志:</h5>
          <div class="max-h-40 overflow-y-auto space-y-1">
            <div
              v-for="(log, index) in sendLog"
              :key="index"
              class="text-xs p-2 rounded font-mono"
              :class="log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              [{{ log.timestamp }}] ID:{{ log.reportId }} Data:[{{ log.data }}] {{ log.success ? '✓' : '✗' }} {{ log.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- 设备响应监听 -->
      <div class="bg-purple-50 p-3 rounded-lg">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-medium">设备返回数据日志</h4>
          <div class="flex gap-2">
            <el-button size="small" @click="toggleDeviceListening" :type="isListening ? 'danger' : 'primary'">
              {{ isListening ? '停止监听' : '开始监听' }}
            </el-button>
            <el-button size="small" @click="clearResponseLog" type="info" :disabled="deviceResponses.length === 0">
              清空日志
            </el-button>
          </div>
        </div>

        <!-- 监听状态 -->
        <div v-if="isListening" class="text-sm text-green-600 mb-2">
          ✓ 正在监听设备响应... 已接收 {{ deviceResponses.length }} 条数据
        </div>

        <!-- 实时日志显示 -->
        <div class="space-y-2">
          <!-- 日志控制 -->
          <div class="flex items-center justify-between text-xs">
            <label class="flex items-center">
              <input type="checkbox" v-model="autoScroll" class="mr-1" />
              自动滚动
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="showTimestamp" class="mr-1" />
              显示时间戳
            </label>
            <span>最新数据: {{ deviceResponses.length > 0 ? deviceResponses[0].timestamp : '无' }}</span>
          </div>

          <!-- 日志内容 -->
          <div v-if="deviceResponses.length > 0" class="border rounded bg-black text-green-400 p-3" style="max-height: 300px; overflow-y: auto;">
            <div
              v-for="(response, index) in deviceResponses"
              :key="index"
              class="text-xs font-mono mb-1 leading-relaxed"
              :ref="index === 0 ? 'latestResponse' : null"
            >
              <!-- 时间戳 -->
              <span v-if="showTimestamp" class="text-gray-500">[{{ response.timestamp }}] </span>

              <!-- Report ID -->
              <span class="text-yellow-400">Report ID: {{ response.reportId.toString(16).padStart(2, '0').toUpperCase() }}</span>

              <!-- 数据长度 -->
              <span class="text-blue-400"> ({{ response.parsedData.length }} bytes)</span>

              <!-- 原始字节 -->
              <div class="text-gray-300 ml-4">
                HEX: {{ response.data }}
              </div>

              <!-- 十进制显示 -->
              <div class="text-gray-400 ml-4">
                DEC: [{{ response.parsedData.join(', ') }}]
              </div>

              <!-- ASCII显示（可读字符） -->
              <div class="text-cyan-400 ml-4">
                ASCII: {{ response.ascii }}
              </div>

              <!-- 分隔线 -->
              <div v-if="index < deviceResponses.length - 1" class="border-t border-gray-700 my-1"></div>
            </div>
          </div>

          <!-- 无数据提示 -->
          <div v-else class="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-300 rounded">
            {{ isListening ? '等待设备数据...' : '请开始监听以查看设备返回数据' }}
          </div>
        </div>
      </div>

      <!-- 控制台输出控制 -->
      <div class="bg-gray-100 p-3 rounded-lg">
        <h4 class="font-medium mb-2">调试控制</h4>
        <div class="space-y-2">
          <label class="flex items-center text-sm">
            <input type="checkbox" v-model="enableConsoleLog" class="mr-2" />
            在控制台打印原始字节
          </label>
          <label class="flex items-center text-sm">
            <input type="checkbox" v-model="enableDetailedLog" class="mr-2" />
            启用详细日志
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '@/stores/app'
import { sendReport } from '@/utils/hid'
import { Tools } from '@element-plus/icons-vue'

const appStore = useAppStore()

// 计算属性
const deviceInfo = computed(() => appStore.deviceInfo)
const collectionsInfo = computed(() => {
  if (!appStore.device?.collections) return []

  return appStore.device.collections.map(collection => ({
    usagePage: collection.usagePage,
    usage: collection.usage,
    reports: [
      ...(collection.inputReports || []),
      ...(collection.outputReports || []),
      ...(collection.featureReports || [])
    ]
  }))
})

// 状态变量
const isEnumerating = ref(false)
const isSending = ref(false)
const isListening = ref(false)
const enableConsoleLog = ref(true)
const enableDetailedLog = ref(false)
const autoScroll = ref(true)
const showTimestamp = ref(true)

// 测试数据
const manualReportId = ref(0)
const manualData = ref('')

// 结果存储
const writableReports = ref<number[]>([])
const deviceAnalysis = ref<{
  isStandardMouse: boolean
  supportsConfiguration: boolean
  description: string
  recommendations: string[]
} | null>(null)
const sendLog = ref<Array<{
  reportId: number
  data: string
  success: boolean
  message: string
  timestamp: string
}>>([])

const deviceResponses = ref<Array<{
  reportId: number
  data: string
  parsedData: number[]
  ascii: string
  timestamp: string
}>>([])

// 枚举可写的Report ID
const enumerateWritableReports = async () => {
  if (!appStore.device) return

  isEnumerating.value = true
  writableReports.value = []

  try {
    for (let reportId = 0; reportId <= 255; reportId++) {
      try {
        // 发送测试数据
        const success = await sendReport(appStore.device, reportId, [0x00])

        if (success) {
          writableReports.value.push(reportId)

          if (enableDetailedLog.value) {
            console.log(`[设备诊断] 发现可写Report ID: 0x${reportId.toString(16).toUpperCase()}`)
          }
        }else{
            console.log(`[设备诊断] Report ID 0x${reportId.toString(16).toUpperCase()} 不可写`)
        }

        // 短暂延迟，避免设备过载
        await new Promise(resolve => setTimeout(resolve, 10))
      } catch (error) {
        // 忽略错误，继续测试下一个
        if (enableDetailedLog.value) {
          console.log(`[设备诊断] Report ID 0x${reportId.toString(16).toUpperCase()} 不可写`)
        }
      }
    }

    console.log(`[设备诊断] 枚举完成，发现 ${writableReports.value.length} 个可写的Report ID:`, writableReports.value)

    // 如果没有发现可写的Report ID，分析设备类型
    if (writableReports.value.length === 0) {
      analyzeAndShowDeviceType()
    }
  } catch (error) {
    console.error('[设备诊断] 枚举过程中发生错误:', error)
  } finally {
    isEnumerating.value = false
  }
}

// 分析并显示设备类型
const analyzeAndShowDeviceType = () => {
  if (!appStore.device?.collections) return

  const analysis = {
    isStandardMouse: false,
    supportsConfiguration: false,
    description: '',
    recommendations: [] as string[]
  }

  // 分析collections信息
  for (const collection of appStore.device.collections) {
    if (collection.usagePage === 0x01 && collection.usage === 0x02) {
      analysis.isStandardMouse = true
      analysis.description += '标准HID鼠标设备，遵循通用鼠标协议。'

      // 检查是否有feature reports（通常用于配置）
      const hasFeatureReports = collection.featureReports && collection.featureReports.length > 0
      const hasOutputReports = collection.outputReports && collection.outputReports.length > 0

      if (!hasFeatureReports && !hasOutputReports) {
        analysis.supportsConfiguration = false
        analysis.description += ' 没有发现feature或output reports，表明这是一个只读设备。'
        analysis.recommendations.push(
          '这是一个标准的只读HID鼠标',
          'DPI设置通常是硬件固定的',
          '无法通过软件配置参数',
          '建议使用厂商专用软件（如果有）'
        )
      } else {
        analysis.supportsConfiguration = true
        analysis.description += ' 设备支持配置功能，但可能需要特定的协议。'
        analysis.recommendations.push(
          '设备支持配置功能',
          '需要找到正确的通信协议',
          '建议尝试不同的Report ID和数据格式'
        )
      }

      break
    }
  }

  // 保存分析结果到状态变量
  deviceAnalysis.value = analysis

  // 显示弹窗提示
  const message = analysis.isStandardMouse ?
    `🖱️ 标准HID鼠标分析结果:\n\n${analysis.description}\n\n建议:\n${analysis.recommendations.map(r => `• ${r}`).join('\n')}` :
    '未知设备类型，请参考设备文档'

  // 在界面上显示分析结果
  alert(message)

  // 同时在控制台输出详细信息
  console.group('🔍 设备类型分析')
  console.log('分析结果:', analysis)
  console.log('设备Collections:', appStore.device.collections)
  console.groupEnd()
}

// 手动发送数据
const sendManualData = async () => {
  if (!appStore.device) return

  isSending.value = true
  try {
    const reportId = manualReportId.value
    const dataString = manualData.value.trim()

    if (!dataString) {
      addSendLog(reportId, '', false, '请输入数据')
      return
    }

    // 解析十六进制数据
    const data = dataString.split(' ')
      .map(byte => parseInt(byte.trim(), 16))
      .filter(byte => !isNaN(byte) && byte >= 0 && byte <= 255)

    if (data.length === 0) {
      addSendLog(reportId, dataString, false, '数据格式错误')
      return
    }

    // 发送数据
    const success = await sendReport(appStore.device, reportId, data)

    if (success) {
      addSendLog(reportId, dataString, true, '发送成功')

      if (enableConsoleLog.value) {
        console.log(`[设备诊断] 发送数据 - Report ID: 0x${reportId.toString(16).toUpperCase()}, 数据: [${data.join(', ')}]`)
      }
    } else {
      addSendLog(reportId, dataString, false, '发送失败')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    addSendLog(manualReportId.value, manualData.value, false, `错误: ${errorMessage}`)
  } finally {
    isSending.value = false
  }
}

// 添加发送日志
const addSendLog = (reportId: number, data: string, success: boolean, message: string) => {
  sendLog.value.unshift({
    reportId,
    data,
    success,
    message,
    timestamp: new Date().toLocaleTimeString()
  })

  // 保持最多50条记录
  if (sendLog.value.length > 50) {
    sendLog.value = sendLog.value.slice(0, 50)
  }
}

// 清空发送日志
const clearSendLog = () => {
  sendLog.value = []
}

// 清空响应日志
const clearResponseLog = () => {
  deviceResponses.value = []
}

// 设备响应监听器
let inputReportHandler: ((event: any) => void) | null = null

// 处理输入报告
const handleInputReport = (event: any) => {
  const { reportId, data } = event
  const dataArray = Array.from(new Uint8Array(data.buffer))

  // 生成ASCII显示
  const ascii = dataArray.map(byte =>
    byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : '.'
  ).join('')

  const response = {
    reportId,
    data: `[${dataArray.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}]`,
    parsedData: dataArray,
    ascii,
    timestamp: new Date().toLocaleTimeString()
  }

  deviceResponses.value.unshift(response)

  // 保持最多100条记录
  if (deviceResponses.value.length > 100) {
    deviceResponses.value = deviceResponses.value.slice(0, 100)
  }

  // 控制台输出
  if (enableConsoleLog.value) {
    console.log(`[设备响应] Report ID: ${reportId}, 原始字节: [${dataArray.join(', ')}], ASCII: ${ascii}`)
  }

  // 详细日志
  if (enableDetailedLog.value) {
    console.log(`[设备响应] 详细信息:`, {
      reportId,
      dataView: data,
      uint8Array: dataArray,
      ascii,
      timestamp: response.timestamp
    })
  }

  // 自动滚动到最新数据
  if (autoScroll.value) {
    setTimeout(() => {
      const container = document.querySelector('.bg-black.text-green-400')
      if (container) {
        container.scrollTop = 0
      }
    }, 10)
  }
}

// 切换设备监听
const toggleDeviceListening = () => {
  if (!appStore.device) return

  if (isListening.value) {
    // 停止监听
    if (inputReportHandler) {
      appStore.device.removeEventListener('inputreport', inputReportHandler)
      inputReportHandler = null
    }
    isListening.value = false
    console.log('[设备诊断] 已停止监听设备响应')
  } else {
    // 开始监听
    inputReportHandler = handleInputReport
    appStore.device.addEventListener('inputreport', inputReportHandler)
    isListening.value = true
    console.log('[设备诊断] 已开始监听设备响应')
  }
}

// 组件挂载时初始化
onMounted(() => {
  if (appStore.device) {
    console.log('[设备诊断] 组件挂载，设备已连接:', deviceInfo.value)
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (isListening.value && appStore.device && inputReportHandler) {
    appStore.device.removeEventListener('inputreport', inputReportHandler)
    console.log('[设备诊断] 组件卸载，已清理监听器')
  }
})
</script>