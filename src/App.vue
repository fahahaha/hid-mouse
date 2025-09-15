<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 头部 -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6 max-w-6xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <el-icon class="text-primary mr-3 text-3xl">
              <Mouse />
            </el-icon>
            <div>
              <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-dark mb-2">
                增强版HID鼠标参数配置工具
              </h1>
              <p class="text-gray-600 max-w-2xl">高级鼠标参数配置，支持回报率、CPI设置和宏录制功能</p>
            </div>
          </div>

          <!-- 导航链接 -->
          <nav class="flex space-x-4">
            <router-link
              to="/"
              class="px-4 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
              active-class="text-primary bg-blue-50"
            >
              首页
            </router-link>
            <router-link
              to="/about"
              class="px-4 py-2 rounded-lg text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
              active-class="text-primary bg-blue-50"
            >
              关于
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- 路由视图 -->
      <router-view />
    </main>

    <!-- 消息提示 -->
    <el-alert
      v-if="message.visible"
      :title="message.text"
      :type="message.type"
      :closable="false"
      show-icon
      class="fixed top-4 right-4 z-50 max-w-md"
      @close="message.visible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { Mouse } from '@element-plus/icons-vue'

const appStore = useAppStore()

// 计算属性
const message = computed(() => appStore.message)
</script>