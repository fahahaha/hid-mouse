<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- CPI设置 -->
    <div class="control-group">
      <label class="control-label">
        <el-icon class="text-primary mr-1">
          <Odometer />
        </el-icon>
        鼠标CPI (Counts Per Inch)
      </label>
      <div class="flex items-center gap-4">
        <el-slider
          v-model="cpi"
          :min="400"
          :max="16000"
          :step="100"
          :format-tooltip="formatCPI"
          class="flex-1"
        />
        <span class="min-w-[100px] text-center font-medium">{{ cpi }} CPI</span>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>400</span>
        <span>16000</span>
      </div>
      <el-button
        type="primary"
        size="small"
        class="mt-3"
        @click="applyCPI"
      >
        应用CPI设置
      </el-button>
    </div>

    <!-- 按键映射 -->
    <div class="control-group">
      <label class="control-label">
        <el-icon class="text-primary mr-1">
          <Switch />
        </el-icon>
        按键映射
      </label>
      <div class="space-y-3">
        <el-checkbox v-model="buttonMapping.swapLeftRight">
          互换左右鼠标键
        </el-checkbox>
        <el-checkbox v-model="buttonMapping.invertScroll">
          反转滚轮方向
        </el-checkbox>
      </div>
      <el-button
        type="primary"
        size="small"
        class="mt-3"
        @click="applyButtonMapping"
      >
        应用按键设置
      </el-button>
    </div>

    <!-- 双击速度 -->
    <div class="control-group">
      <label class="control-label">
        <el-icon class="text-primary mr-1">
          <Clock />
        </el-icon>
        双击速度
      </label>
      <div class="flex items-center gap-4">
        <el-slider
          v-model="doubleClickSpeed"
          :min="100"
          :max="1000"
          :step="50"
          :format-tooltip="formatSpeed"
          class="flex-1"
        />
        <span class="min-w-[100px] text-center font-medium">{{ doubleClickSpeed }} ms</span>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>快</span>
        <span>慢</span>
      </div>
      <el-button
        type="primary"
        size="small"
        class="mt-3"
        @click="applyDoubleClickSpeed"
      >
        应用双击设置
      </el-button>
    </div>

    <!-- 滚轮速度 -->
    <div class="control-group">
      <label class="control-label">
        <el-icon class="text-primary mr-1">
          <ArrowUp />
        </el-icon>
        滚轮速度
      </label>
      <div class="flex items-center gap-4">
        <el-slider
          v-model="scrollSpeed"
          :min="1"
          :max="10"
          :step="1"
          class="flex-1"
        />
        <span class="min-w-[100px] text-center font-medium">{{ scrollSpeed }}</span>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mt-1">
        <span>慢</span>
        <span>快</span>
      </div>
      <el-button
        type="primary"
        size="small"
        class="mt-3"
        @click="applyScrollSpeed"
      >
        应用滚轮设置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useHIDDevice } from '@/composables/useHIDDevice'
import {
  Odometer,
  Switch,
  Clock,
  ArrowUp
} from '@element-plus/icons-vue'

const appStore = useAppStore()
const { sendConfig } = useHIDDevice()

// 响应式数据
const cpi = computed({
  get: () => appStore.deviceConfig.cpi,
  set: (value) => appStore.updateConfig({ cpi: value })
})

const buttonMapping = computed({
  get: () => appStore.deviceConfig.buttonMapping,
  set: (value) => appStore.updateConfig({ buttonMapping: value })
})

const doubleClickSpeed = computed({
  get: () => appStore.deviceConfig.doubleClickSpeed,
  set: (value) => appStore.updateConfig({ doubleClickSpeed: value })
})

const scrollSpeed = computed({
  get: () => appStore.deviceConfig.scrollSpeed,
  set: (value) => appStore.updateConfig({ scrollSpeed: value })
})

// 方法
const formatCPI = (value: number) => `${value} CPI`
const formatSpeed = (value: number) => `${value} ms`

const applyCPI = async () => {
  await sendConfig({
    reportId: 0x01,
    command: 0x02,
    data: [(cpi.value >> 8) & 0xFF, cpi.value & 0xFF]
  })
}

const applyButtonMapping = async () => {
  await sendConfig({
    reportId: 0x02,
    command: 0x03,
    data: [
      buttonMapping.value.swapLeftRight ? 1 : 0,
      buttonMapping.value.invertScroll ? 1 : 0
    ]
  })
}

const applyDoubleClickSpeed = async () => {
  await sendConfig({
    reportId: 0x03,
    command: 0x04,
    data: [(doubleClickSpeed.value >> 8) & 0xFF, doubleClickSpeed.value & 0xFF]
  })
}

const applyScrollSpeed = async () => {
  await sendConfig({
    reportId: 0x04,
    command: 0x05,
    data: [scrollSpeed.value]
  })
}
</script>