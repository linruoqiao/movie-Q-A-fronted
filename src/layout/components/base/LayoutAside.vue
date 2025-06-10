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


</script>

<template>
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
    <!-- <text>你好</text> -->
    <!-- <div class="send-controls-extra" style="margin-top:40px">
      <el-button-group>
        <el-popover
          :popper-style="{ borderRadius: '26px' }"
          :visible="historyVisible"
          placement="top-end"
          :width="350"
          trigger="click"
          :persistent="false"
        >
          <template #reference>
            <el-button round @click="historyVisible = !historyVisible">历史对话</el-button>
          </template>
          <ChatHistory
            v-model:visible="historyVisible"
            v-model:active-id="chatSessionId"
            @item-click="onHistoryItemClick"
            @rename="onHistoryItemRename"
            @delete="onHistoryItemDelete"
          />
        </el-popover>

        <el-button round type="primary" @click="onRestartNewChat">新对话</el-button>
      </el-button-group>
    </div> -->
    <!-- <div class="sidebar-controls p-4">
      <el-button
        class="new-chat-button"
        @click="onRestartNewChat"
        plain
      >
        <el-icon class="icon-style"><Plus /></el-icon>
        <span class="text-style">新对话</span>
      </el-button>
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
</style>

function ref(arg0: string) {
  throw new Error('Function not implemented.')
}
