<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- 回报率设置 -->
    <div class="control-group">
      <label class="control-label">
        <el-icon class="text-primary mr-1">
          <Refresh />
        </el-icon>
        回报率 (Polling Rate)
      </label>
      <p class="text-xs text-gray-500 mb-3">设置鼠标向电脑发送数据的频率，越高响应越快</p>
      <div class="flex flex-wrap gap-2 mb-4">
        <el-button
          v-for="rate in pollingRates"
          :key="rate"
          size="small"
          :class="{ 'active-rate': pollingRate === rate }"
          @click="selectPollingRate(rate)"
        >
          {{ rate }} Hz
        </el-button>
      </div>
      <el-button
        type="primary"
        size="small"
        @click="applyPollingRate"
      >
        应用回报率设置
      </el-button>
    </div>

    <!-- 传感器设置 -->
    <div class="control-group">
      <label class="control-label">
        <el-icon class="text-primary mr-1">
          <Cpu />
        </el-icon>
        传感器设置
      </label>
      <div class="space-y-3">
        <el-checkbox v-model="sensorSettings.angleSnapping">
          启用角度捕捉
        </el-checkbox>
        <el-checkbox v-model="sensorSettings.acceleration">
          启用鼠标加速
        </el-checkbox>
      </div>
      <el-button
        type="primary"
        size="small"
        class="mt-3"
        @click="applySensorSettings"
      >
        应用传感器设置
      </el-button>
    </div>

    <!-- 灯光设置 -->
    <div class="control-group">
      <label class="control-label">
        <el-icon class="text-primary mr-1">
          <Sunny />
        </el-icon>
        灯光设置
      </label>
      <div class="space-y-3">
        <div>
          <label class="text-xs text-gray-500 block mb-1">灯光模式</label>
          <el-select v-model="lightingSettings.mode" class="w-full">
            <el-option label="关闭" value="off" />
            <el-option label="静态" value="static" />
            <el-option label="呼吸" value="breathing" />
            <el-option label="彩虹" value="rainbow" />
            <el-option label="反应式" value="reactive" />
          </el-select>
        </div>
        <div>
          <label class="text-xs text-gray-500 block mb-1">亮度</label>
          <el-slider
            v-model="lightingSettings.brightness"
            :min="0"
            :max="100"
            :step="10"
            :format-tooltip="formatBrightness"
          />
        </div>
      </div>
      <el-button
        type="primary"
        size="small"
        class="mt-3"
        @click="applyLightingSettings"
      >
        应用灯光设置
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useHIDDevice } from '@/composables/useHIDDevice'
import {
  Refresh,
  Cpu,
  Sunny
} from '@element-plus/icons-vue'

const appStore = useAppStore()
const { sendConfig } = useHIDDevice()

// 常量
const pollingRates = [125, 250, 500, 1000]

// 响应式数据
const pollingRate = computed({
  get: () => appStore.deviceConfig.pollingRate,
  set: (value) => appStore.updateConfig({ pollingRate: value })
})

const sensorSettings = computed({
  get: () => appStore.deviceConfig.sensorSettings,
  set: (value) => appStore.updateConfig({ sensorSettings: value })
})

const lightingSettings = computed({
  get: () => appStore.deviceConfig.lightingSettings,
  set: (value) => appStore.updateConfig({ lightingSettings: value })
})

// 方法
const formatBrightness = (value: number) => `${value}%`

const selectPollingRate = (rate: number) => {
  pollingRate.value = rate
}

const applyPollingRate = async () => {
  await sendConfig({
    reportId: 0x05,
    command: 0x06,
    data: [pollingRate.value & 0xFF]
  })
}

const applySensorSettings = async () => {
  await sendConfig({
    reportId: 0x06,
    command: 0x07,
    data: [
      sensorSettings.value.angleSnapping ? 1 : 0,
      sensorSettings.value.acceleration ? 1 : 0
    ]
  })
}

const applyLightingSettings = async () => {
  const modeMap: Record<string, number> = {
    'off': 0,
    'static': 1,
    'breathing': 2,
    'rainbow': 3,
    'reactive': 4
  }

  await sendConfig({
    reportId: 0x07,
    command: 0x08,
    data: [
      modeMap[lightingSettings.value.mode],
      lightingSettings.value.brightness
    ]
  })
}
</script>

<style scoped>
.active-rate {
  background-color: var(--el-color-primary) !important;
  color: white !important;
  border-color: var(--el-color-primary) !important;
}
</style>