<script setup lang="ts">
import LayoutHeader from './components/base/LayoutHeader.vue'
import LayoutAside from './components/base/LayoutAside.vue'
import LayoutFooter from './components/base/LayoutFooter.vue'
</script>

<template>
  <el-container class="layout">
    <el-header>
      <LayoutHeader></LayoutHeader>
    </el-header>

    <!-- <div class="send-controls-extra">
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

    <el-container class="layout-body">
      <el-aside>
        <LayoutAside></LayoutAside>
      </el-aside>

      <el-main>
        <el-scrollbar class="layout-scrollbar">
          <div class="layout-main">
            <router-view v-slot="{ Component }">
              <keep-alive include="Chat">
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
          
          <LayoutFooter class="el-footer" />
        </el-scrollbar>
        <el-backtop target=".layout-scrollbar .el-scrollbar__wrap" :right="50" :bottom="60" />
      </el-main>
    </el-container>
  </el-container>
  
</template>

<style lang="scss" scoped>
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;

  .el-header {
    padding: 0 10px;
    background-color: var(--el-color-primary-light-5);
  }

  .layout-body {
    height: 0;

    .el-main {
      padding: 0;
      background-color: var(--el-bg-color-page);
    }

    .el-footer {
      background-color: var(--el-bg-color-page);
    }
  }

  .layout-main {
    min-height: calc(100vh - var(--el-header-height) - var(--el-footer-height));
    padding: 20px;
  }
}
</style>
