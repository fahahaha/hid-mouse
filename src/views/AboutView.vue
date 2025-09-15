<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-6">关于</h1>

    <div class="device-card mb-6">
      <h2 class="text-xl font-semibold mb-4">项目信息</h2>
      <div class="space-y-3">
        <p><strong>项目名称：</strong>增强版HID鼠标参数配置工具</p>
        <p><strong>版本：</strong>1.0.0</p>
        <p><strong>技术栈：</strong>Vue3 + TypeScript + Vite + Pinia + Element Plus + TailwindCSS</p>
        <p><strong>主要功能：</strong>HID鼠标设备配置、宏录制、参数调节</p>
      </div>
    </div>

    <div class="device-card mb-6">
      <h2 class="text-xl font-semibold mb-4">功能特性</h2>
      <ul class="space-y-2">
        <li>✅ 支持WebHID API的鼠标设备连接</li>
        <li>✅ 实时设备状态监控</li>
        <li>✅ CPI（DPI）设置</li>
        <li>✅ 按键映射配置</li>
        <li>✅ 回报率调节</li>
        <li>✅ 宏录制和编辑</li>
        <li>✅ 设备诊断功能</li>
        <li>✅ 本地配置存储</li>
      </ul>
    </div>

    <div class="device-card mb-6">
      <h2 class="text-xl font-semibold mb-4">浏览器兼容性</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="font-medium text-green-800 mb-2">支持</h3>
          <ul class="text-sm text-green-700">
            <li>• Chrome 89+</li>
            <li>• Edge 89+</li>
            <li>• Opera 75+</li>
          </ul>
        </div>
        <div class="bg-red-50 p-4 rounded-lg">
          <h3 class="font-medium text-red-800 mb-2">不支持</h3>
          <ul class="text-sm text-red-700">
            <li>• Safari</li>
            <li>• Firefox</li>
            <li>• Internet Explorer</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="device-card">
      <h2 class="text-xl font-semibold mb-4">开发信息</h2>
      <div class="space-y-3">
        <p><strong>开发时间：</strong>2024</p>
        <p><strong>开发环境：</strong>Vite + TypeScript</p>
        <p><strong>状态管理：</strong>Pinia</p>
        <p><strong>UI框架：</strong>Element Plus + TailwindCSS</p>
        <p><strong>构建工具：</strong>Vite</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 关于页面组件
</script>