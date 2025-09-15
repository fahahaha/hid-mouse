<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- 宏列表 -->
    <div class="lg:col-span-1">
      <label class="control-label">宏列表</label>
      <div class="border rounded-lg p-2 mb-3 max-h-60 overflow-y-auto">
        <div
          v-for="macro in macros"
          :key="macro.id"
          class="macro-item p-2 mb-1 rounded hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{ 'bg-primary/10 font-medium': selectedMacroId === macro.id }"
          @click="selectMacro(macro.id)"
        >
          {{ macro.name }}
        </div>
      </div>
      <div class="flex gap-2">
        <el-button type="primary" size="small" class="flex-1" @click="createNewMacro">
          新建宏
        </el-button>
        <el-button type="danger" size="small" @click="deleteMacro">
          删除
        </el-button>
      </div>

      <!-- 宏绑定按键 -->
      <div class="mt-6">
        <label class="control-label">宏绑定按键</label>
        <el-select v-model="selectedButton" class="w-full mb-3">
          <el-option label="未绑定" value="none" />
          <el-option label="侧键 1" value="button4" />
          <el-option label="侧键 2" value="button5" />
          <el-option label="双击" value="doubleclick" />
          <el-option label="滚轮上" value="scrollup" />
          <el-option label="滚轮下" value="scrolldown" />
        </el-select>
        <el-button
          type="primary"
          size="small"
          class="w-full"
          @click="bindMacroToButton"
        >
          绑定到按键
        </el-button>
      </div>
    </div>

    <!-- 宏录制区域 -->
    <div class="lg:col-span-2">
      <div class="flex justify-between items-center mb-4">
        <label class="control-label">宏编辑</label>
        <div class="flex gap-2">
          <el-button
            type="primary"
            size="small"
            :disabled="isRecording"
            @click="startRecording"
          >
            <el-icon class="mr-1">
              <VideoPlay />
            </el-icon>
            开始录制
          </el-button>
          <el-button
            type="danger"
            size="small"
            :disabled="!isRecording"
            @click="stopRecording"
          >
            <el-icon class="mr-1">
              <VideoPause />
            </el-icon>
            停止录制
          </el-button>
          <el-button size="small" @click="playMacro">
            <el-icon class="mr-1">
              <CaretRight />
            </el-icon>
            播放
          </el-button>
        </div>
      </div>

      <!-- 录制指示器 -->
      <div
        v-if="isRecording"
        class="bg-amber-50 text-amber-800 p-3 rounded-lg mb-4 recording-indicator"
      >
        <el-icon class="mr-2">
          <Loading />
        </el-icon>
        正在录制宏... 移动鼠标、点击或按键
      </div>

      <!-- 宏步骤显示 -->
      <div class="border rounded-lg p-3 h-60 overflow-y-auto bg-gray-50">
        <div v-if="currentSteps.length === 0" class="text-gray-500 text-center py-10">
          宏命令将显示在这里<br>点击"开始录制"创建宏
        </div>
        <div v-else>
          <div
            v-for="(step, index) in currentSteps"
            :key="index"
            class="macro-step"
          >
            <div class="text-xs text-gray-500 mb-1">{{ step.time }}ms</div>
            <div>{{ formatStep(step) }}</div>
          </div>
        </div>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <el-button size="small" @click="clearRecording">
          清空
        </el-button>
        <el-button type="primary" size="small" @click="saveMacro">
          保存宏设置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useMacroRecorder } from '@/composables/useMacroRecorder'
import { useHIDDevice } from '@/composables/useHIDDevice'
import {
  VideoPlay,
  VideoPause,
  CaretRight,
  Loading
} from '@element-plus/icons-vue'

const appStore = useAppStore()
const { isRecording, currentSteps, startRecording, stopRecording, clearRecording, playMacro: playMacroSteps } = useMacroRecorder()
const { sendConfig } = useHIDDevice()

// 响应式数据
const macros = computed(() => appStore.macros)
const selectedMacroId = computed(() => appStore.selectedMacroId)
const selectedButton = ref('none')

// 监听选中的宏变化
watch(selectedMacroId, (newId) => {
  const selectedMacro = macros.value.find(m => m.id === newId)
  if (selectedMacro) {
    currentSteps.value = [...selectedMacro.steps]
  } else {
    currentSteps.value = []
  }
}, { immediate: true })

// 方法
const selectMacro = (id: number) => {
  appStore.setSelectedMacroId(id)
}

const createNewMacro = () => {
  currentSteps.value = []
  appStore.showMessage('已创建新宏，请开始录制', 'info')
}

const deleteMacro = () => {
  const selectedMacro = macros.value.find(m => m.id === selectedMacroId.value)
  if (!selectedMacro) return

  if (confirm(`确定要删除宏 "${selectedMacro.name}" 吗？`)) {
    appStore.deleteMacro(selectedMacroId.value)
    currentSteps.value = []
    appStore.showMessage('宏已删除', 'info')
  }
}

const bindMacroToButton = async () => {
  if (selectedButton.value === 'none') {
    appStore.showMessage('请选择要绑定的按键', 'error')
    return
  }

  const buttonCodeMap: Record<string, number> = {
    'button4': 4,
    'button5': 5,
    'doubleclick': 6,
    'scrollup': 7,
    'scrolldown': 8
  }

  const success = await sendConfig({
    reportId: 0x09,
    command: 0x0A,
    data: [buttonCodeMap[selectedButton.value], selectedMacroId.value]
  })

  if (success) {
    appStore.showMessage(`宏已成功绑定到按键`, 'success')
  }
}

const formatStep = (step: any) => {
  switch (step.type) {
    case 'mousedown':
      return `鼠标按下 (按键 ${step.button})`
    case 'mouseup':
      return `鼠标释放 (按键 ${step.button})`
    case 'keydown':
      return `按键按下: ${step.key}`
    case 'keyup':
      return `按键释放: ${step.key}`
    default:
      return '未知操作'
  }
}

const saveMacro = () => {
  if (currentSteps.value.length === 0) {
    appStore.showMessage('请先录制宏操作', 'error')
    return
  }

  const selectedMacro = macros.value.find(m => m.id === selectedMacroId.value)
  if (!selectedMacro) return

  appStore.updateMacro(selectedMacroId.value, {
    steps: currentSteps.value
  })

  // 发送到设备
  sendConfig({
    reportId: 0x08,
    command: 0x09,
    data: [selectedMacroId.value, currentSteps.value.length]
  })

  appStore.showMessage(`宏 "${selectedMacro.name}" 已保存`, 'success')
}

const playMacro = () => {
  const selectedMacro = macros.value.find(m => m.id === selectedMacroId.value)
  if (!selectedMacro || selectedMacro.steps.length === 0) {
    appStore.showMessage('没有可播放的宏', 'error')
    return
  }

  playMacroSteps(selectedMacro.steps)
}
</script>