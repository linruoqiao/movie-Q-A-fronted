<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import type { Ref } from 'vue'
const router = useRouter()
const route = useRoute()

const menus = computed(() => {
  const menu = router.options.routes.filter(item => item.children)
  return menu[0].children
})

const appStore = useAppStore()
const collapse = computed(() => {
  return appStore.collapse
})

const chatSessionId = ref('')
const historyVisible = ref(true)

const selectedModel = ref('zhipu'); // 默认选择zhipu
const modelOptions = [
  { value: 'zhipu', label: 'DeepSeek-R1' },
  { value: 'qwen', label: 'Qwen3' },
  { value: 'deepseek', label: 'GLM-4-Flash' }
];

const handleModelChange = (value) => {
  console.log('切换模型:', value);
  // 这里可以添加切换模型的逻辑，比如调用API或更新store
};
</script>

<template>
  <!-- <div class="model-selector">
    <el-select 
      v-model="selectedModel" 
      placeholder="选择模型"
      size="small"
      @change="handleModelChange"
    >
      <el-option
        v-for="model in modelOptions"
        :key="model.value"
        :label="model.label"
        :value="model.value"
      />
    </el-select>
  </div> -->
  <el-scrollbar style="padding-top:10px">
    <el-menu :default-active="route.path" :collapse="collapse" router>
      <template v-for="subItem in menus" :key="subItem.path">
        <el-sub-menu v-if="subItem.children" :index="subItem.path">
          <template #title>
            <el-icon>
              <component :is="subItem.meta?.icon"></component>
            </el-icon>
            <span>{{ subItem.meta?.title }}</span>
          </template>
          <template v-for="item in subItem.children" :key="item.path">
            <el-menu-item :index="item.path">
              <el-icon>
                <component :is="item.meta?.icon"></component>
              </el-icon>
              <template #title>
                <span>{{ item.meta?.title }}</span>
              </template>
            </el-menu-item>
          </template>
        </el-sub-menu>

        <el-menu-item v-else :index="subItem.path">
          <el-icon>
            <component :is="subItem.meta?.icon"></component>
          </el-icon>
          <template #title>
            <span>{{ subItem.meta?.title }}</span>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
    <!-- <div class="model-selector">
      <el-select 
        v-model="selectedModel" 
        placeholder="选择模型"
        size="small"
        @change="handleModelChange"
      >
        <el-option
          v-for="model in modelOptions"
          :key="model.value"
          :label="model.label"
          :value="model.value"
        />
      </el-select>
    </div> -->
  </el-scrollbar>

</template>

<style lang="scss" scoped>
.el-menu {
  border-right: 0;
}

.el-menu-item {
  height: 40px;
  margin: 5px 8px;
  line-height: 40px;
  border-radius: 10px;
}

.el-menu-item.is-active {
  color: var(--el-menu-active-color);
  background-color: var(--el-color-primary-light-7);
}

.new-chat-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: white;
  border: 1px solid #e5e7eb;
  color: #111827;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}
.new-chat-button:hover {
  background-color: #f3f4f6;
}

.icon-style {
  font-size: 18px;
  margin-right: 8px;
}

.text-style {
  font-size: 14px;
}

.model-selector {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  font-size: 16px;
}

/* 下拉框主体 */
.el-select {
  width: 100%;
}

/* 输入框样式 */
.el-select :deep(.el-input__wrapper) {
  background: transparent;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.16);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.el-select :deep(.el-input__inner) {
  color: #e0e0e0;
  font-weight: 500;
}

/* 悬浮/聚焦状态 */
.el-select :deep(.el-input__wrapper:hover),
.el-select :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary) !important;
  background: rgba(255, 255, 255, 0.05);
}

/* 下拉面板样式 */
.el-select :deep(.el-select__dropdown) {
  background: #2c2c2e;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.24);
  border-radius: 8px;
  padding: 4px 0;
}

/* 选项样式 */
.el-select :deep(.el-select-dropdown__item) {
  color: #e0e0e0;
  padding: 8px 16px;
  transition: all 0.2s ease;
}

.el-select :deep(.el-select-dropdown__item.hover),
.el-select :deep(.el-select-dropdown__item:hover) {
  background: rgba(255, 255, 255, 0.08);
}

/* 选中状态 */
.el-select :deep(.el-select-dropdown__item.selected) {
  color: var(--el-color-primary);
  background: rgba(var(--el-color-primary-rgb), 0.1);
}

/* 下拉箭头图标 */
.el-select :deep(.el-icon.arrow-up) {
  color: rgba(255, 255, 255, 0.6);
}

/* 小尺寸优化 */
.el-select--small :deep(.el-input__inner) {
  font-size: 13px;
  height: 28px;
  line-height: 28px;
}
</style>

function ref(arg0: string) {
  throw new Error('Function not implemented.')
}
