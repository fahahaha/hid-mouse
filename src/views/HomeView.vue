<template>
  <div>
    <!-- 设备连接区域 -->
    <DeviceConnection class="mb-8" />

    <!-- 配置面板 -->
    <ConfigurationPanel v-if="isConnected" />

    <!-- 不支持提示 -->
    <div v-if="!isSupported" class="device-card bg-amber-50 border border-amber-100">
      <div class="flex">
        <div class="flex-shrink-0">
          <el-icon class="text-amber-500 text-xl mt-0.5">
            <WarningFilled />
          </el-icon>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-amber-800">浏览器不支持WebHID API</h3>
          <div class="mt-2 text-sm text-amber-700">
            <p>请使用最新版本的Chrome、Edge或Opera浏览器以使用此功能。WebHID API目前不被Safari支持。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAppStore } from '@/stores/app'
import DeviceConnection from '@/components/DeviceConnection.vue'
import ConfigurationPanel from '@/components/ConfigurationPanel.vue'
import { WarningFilled } from '@element-plus/icons-vue'

const appStore = useAppStore()

// 计算属性
const isConnected = computed(() => appStore.isConnected)
const isSupported = computed(() => appStore.isSupported)

// 生命周期
onMounted(() => {
  appStore.init()
})
</script>