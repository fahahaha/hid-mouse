<template>
  <div class="device-card">
    <div class="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold mb-1">设备连接</h2>
        <p class="text-gray-500 text-sm">连接并授权访问你的HID鼠标设备</p>
      </div>
      <div class="mt-4 md:mt-0 flex gap-2">
        <el-button
          type="primary"
          :loading="isLoading"
          @click="handleConnect"
        >
          <el-icon class="mr-2">
            <Connection v-if="!isConnected" />
            <Switch v-else />
          </el-icon>
          {{ isConnected ? '断开连接' : '连接鼠标设备' }}
        </el-button>
        <el-button
          v-if="isConnected"
          @click="diagnoseDevice"
        >
          <el-icon class="mr-2">
            <Tools />
          </el-icon>
          诊断设备
        </el-button>
      </div>
    </div>

    <!-- 设备状态 -->
    <div class="mt-4 flex items-center text-gray-500">
      <span
        class="status-indicator"
        :class="{
          'bg-gray-300': !isConnected,
          'bg-secondary': isConnected
        }"
      ></span>
      <span>{{ isConnected ? '已连接设备' : '未连接设备' }}</span>
    </div>

    <!-- 设备信息 -->
    <div v-if="deviceInfo" class="mt-4">
      <div class="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <h3 class="font-medium mb-2">设备信息</h3>
        <el-descriptions :column="1" size="small">
          <el-descriptions-item label="厂商">
            {{ deviceInfo.manufacturerName || '未知' }}
          </el-descriptions-item>
          <el-descriptions-item label="产品">
            {{ deviceInfo.productName }}
          </el-descriptions-item>
          <el-descriptions-item label="产品ID">
            <code class="font-mono">{{ formatDeviceId(deviceInfo.vendorId, deviceInfo.productId) }}</code>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useHIDDevice } from '@/composables/useHIDDevice'
import { formatDeviceId } from '@/utils/hid'
import {
  Connection,
  Switch,
  Tools
} from '@element-plus/icons-vue'

const appStore = useAppStore()
const { isLoading, connectDevice, disconnectDevice, diagnoseDevice } = useHIDDevice()

// 计算属性
const isConnected = computed(() => appStore.isConnected)
const deviceInfo = computed(() => appStore.deviceInfo)

// 方法
const handleConnect = async () => {
  if (isConnected.value) {
    await disconnectDevice()
  } else {
    await connectDevice()
  }
}
</script>