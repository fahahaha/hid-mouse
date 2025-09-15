<template>
  <div class="device-card">
    <h2 class="text-xl font-semibold mb-6">鼠标参数配置</h2>

    <!-- 标签页导航 -->
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane label="基本设置" name="basic">
        <BasicSettings />
      </el-tab-pane>
      <el-tab-pane label="高级设置" name="advanced">
        <AdvancedSettings />
      </el-tab-pane>
      <el-tab-pane label="宏设置" name="macros">
        <MacroSettings />
      </el-tab-pane>
      <el-tab-pane label="通信测试" name="communication">
        <DeviceCommunicationTest />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasicSettings from './BasicSettings.vue'
import AdvancedSettings from './AdvancedSettings.vue'
import MacroSettings from './MacroSettings.vue'
import DeviceCommunicationTest from './DeviceCommunicationTest.vue'

const activeTab = ref('basic')
</script>