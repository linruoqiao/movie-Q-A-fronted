<script setup lang="ts">
import type { Ref } from 'vue'
import type { ChatSessionResponseType } from '@/api/chatSession/types'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { chatApi, chatCancelRequest, chatHistoryApi } from '@/api/chat'
import { chatSessionsAddApi } from '@/api/chatSession'
import axios from 'axios';
import HumanChat from './components/HumanChat.vue'
import AssistantChat from './components/AssistantChat.vue'
import ChatHistory from './components/ChatHistory.vue'

/** 配置组件名，使 KeepAlive 能找到该组件 */
defineOptions({ name: 'Chat' })

type Chat = {
  role: string
  content: string
  think?: string
  isStream?: boolean
  error?: boolean | string
}

/** 对话id */
const chatSessionId = ref('')
const chatTitle = ref('')

/** 响应式对话，界面显示历史 */
const chatting: Ref<Chat[]> = ref([])
/** 用户输入消息 */
const humanInput = ref('')

const loading = ref(false)
const disabled = ref(false)
/** 历史会话列表框显隐 */
const historyVisible = ref(false)

/** 监听 assistant 是否正在流式输出文字 */
const isStream = ref(false)
/** 监听是否使用了鼠标滚轮 */
const isWheelMove = ref(false)

const chatMainRef = ref<HTMLDivElement>()

/**
 * 历史记录列表，item点击事件
 * @param chatSession 会话记录
 */
const onHistoryItemClick = async (chatSession: ChatSessionResponseType) => {
  const response = await chatHistoryApi(chatSession.id)
  chatting.value = response.data
  chatTitle.value = chatSession.title
  chatSessionId.value = chatSession.id
  scrollToButtom(chatMainRef.value!)
}

/**
 * 会话重命名标题后的回调
 */
const onHistoryItemRename = (title: string, id: string) => {
  // 如果重命名的会话记录和当前正在聊天的会话相同，则更新标题
  if (chatSessionId.value === id) {
    chatTitle.value = title
  }
}

const onHistoryItemDelete = (id: string) => {
  if (chatSessionId.value === id) {
    onRestartNewChat()
  }
}

/**
 * 输入框提交
 */
const onSubmit = async () => {
  if (humanInput.value === '') {
    ElMessage.warning('请输入对话内容。')
    return
  }
  if (!chatSessionId.value) {
    disabled.value = true
    loading.value = true

    try {
      const res = await chatSessionsAddApi({ title: humanInput.value })
      chatSessionId.value = res.data.id
      chatTitle.value = res.data.title
      startChatting()
    } catch {
      disabled.value = false
      loading.value = false
    }
  } else {
    startChatting()
  }
}

/**
 * 开始对话，流式响应
 */

function startChatting() {
  disabled.value = true
  loading.value = true
  isWheelMove.value = false
  scrollToButtom(chatMainRef.value!)
  
  const userChat = ref<Chat>({
    role: 'user',
    content: humanInput.value,
    error: false
  })
  const assistantChat = ref<Chat>({
    role: 'assistant',
    content: '',
    think: '',
    isStream: false,
    error: false
  })
  let enhancedPrompt = humanInput.value;
  
  if (imageAnalysisResults.length > 0) {
    const imageContext = imageAnalysisResults.map(img => {
      return `[相关图像分析结果：${img.analysis}]`;
    }).join('\n');
    
    enhancedPrompt = `${imageContext}\n${humanInput.value}`;
  }

  // 请求参数
  const data = {
    model: 'deepseek-r1:7b',
    messages: {
      role: userChat.value.role,
      content: enhancedPrompt
    },
    chat_session_id: chatSessionId.value,
    stream: true
  }
  let isThinking = false
  let buffer = ''
  // 请求后台 chat
  chatApi(
    data,
    () => {
      humanInput.value = ''
      chatting.value.push(userChat.value)
      chatting.value.push(assistantChat.value)
      assistantChat.value.isStream = true
      isStream.value = true
      loading.value = false
    },
    (_reader, chunk) => {
      const lines = chunk.split('\n').filter(line => line.trim())
      for (const line of lines) {
        if (line.trim() === '') {
          continue
        }
        const data = JSON.parse(line)
        const content = data.message.content as string

        // 截取 think 标签的内容
        if (content === '<think>') {
          isThinking = true
          continue
        }
        if (content === '</think>') {
          isThinking = false
          continue
        }

        if (isThinking) {
          assistantChat.value.think += content
        } else {
          assistantChat.value.content += content
        }

        if (content.indexOf('\n')) {
          buffer = ''
          scrollToButtom(chatMainRef.value!)
        }
        buffer += content

        if (!isWheelMove.value && buffer.length >= 50) {
          scrollToButtom(chatMainRef.value!)
        }

        if (buffer.length >= 50) {
          buffer = ''
        }
      }
    }
  )
    .catch(error => {
      userChat.value.error = error.message
      assistantChat.value.error = error.message
    })
    .finally(() => {
      disabled.value = false
      loading.value = false
      isStream.value = false
      assistantChat.value.isStream = false
    })
}

/**
 * 输入框键盘事件
 * @param event KeyboardEvent
 */
const inputKeyboard = (event: KeyboardEvent | Event) => {
  const e = event as KeyboardEvent
  // Shift + Enter 换行
  if (e.key == 'Enter' && e.shiftKey) {
    return
  }
  // Ctrl + Enter 换行
  if (e.key == 'Enter' && e.ctrlKey) {
    humanInput.value = humanInput.value + '\n'
  } else if (e.key == 'Enter') {
    // Enter 提交
    event.preventDefault()
    onSubmit()
  }
}

/**
 * 取消请求
 */
const onCancelRequest = () => {
  chatCancelRequest()
}

/**
 * 开启新对话
 */
const onRestartNewChat = () => {
  chatSessionId.value = ''
  chatTitle.value = ''
  humanInput.value = ''
  loading.value = false
  disabled.value = false
  chatting.value = []
  chatCancelRequest()
  ElMessage.success('开始新对话。')
}

/**
 * 判断容器是否滚动到底部
 * @param element 指定目标容器 Element
 * @param threshold 误差高度阈值
 */
const isMoveToBottom = (element: HTMLDivElement | undefined, threshold: number = 1): boolean => {
  if (!element) {
    return false
  }
  const { scrollTop, clientHeight, scrollHeight } = element
  return scrollTop + clientHeight >= scrollHeight - threshold
}

/**
 * 鼠标滚轮监听事件
 */
const handleWhell = () => {
  isWheelMove.value = true
}

/**
 * 滚动条监听事件
 */
const handleScroll = () => {
  if (isMoveToBottom(chatMainRef.value)) {
    isWheelMove.value = false
  }
}

onMounted(() => {
  document.addEventListener('wheel', handleWhell)
  document.addEventListener('scroll', handleScroll, true)
})

onUnmounted(() => {
  document.removeEventListener('wheel', handleWhell)
  document.removeEventListener('scroll', handleScroll)
})

function scrollToButtom(div: Element | null) {
  if (div === null) {
    return
  }

  nextTick(() => {
    div.scrollTop = div.scrollHeight
  })
}
const uploadedImages = ref([])
const clearAllImages = () => {
  uploadedImages.value = []
}

// 移除单张图片
const removeImage = (index) => {
  uploadedImages.value.splice(index, 1)
}
let imageAnalysisResults = [];
const handleImageUpload = async (file) => {
  // 1. 校验文件类型（只允许图片）
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.raw.type)) {
    const errorMsg = '仅支持 JPG/PNG/GIF/WEBP 格式的图片';
    console.error(errorMsg);
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }

  // 2. 校验文件大小（限制 5MB）
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    const errorMsg = '图片大小不能超过 5MB';
    console.error(errorMsg);
    alert(errorMsg);
    return { success: false, error: errorMsg };
  }

  // 3. 准备FormData（注意字段名与后端一致）
  const formData = new FormData();
  formData.append('files', file.raw); // 关键：字段名必须是'files'（后端接收List[UploadFile]）

  // 调试：打印FormData内容
  console.log('=== 请求数据 ===');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  // 4. 显示上传进度
  console.log('开始上传...');
  const progressText = document.createElement('div');
  progressText.textContent = '上传中... 0%';
  document.body.appendChild(progressText);

  try {
    // 5. 发送请求
    const response = await axios.post('http://localhost:8082/analysis_image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        progressText.textContent = `上传中... ${percent}%`;
      },
    });

    // 6. 处理成功响应
    console.log('=== 响应数据 ===', response.data);
    progressText.textContent = '上传成功！';
    setTimeout(() => progressText.remove(), 2000);

    // 7. 返回后端处理结果
    if (response.data.code === 200) {
      console.log('分析结果:', response.data.result);
      return { 
        success: true, 
        data: response.data.result,
        fullResponse: response.data 
      };
    } else {
      throw new Error(response.data.message || '未知错误');
    }

  } catch (error) {
    // 8. 处理错误
    let errorMsg = '上传失败';
    if (error.response) {
      // 服务器返回的错误
      console.error('服务器错误:', error.response.data);
      errorMsg = error.response.data.detail || error.response.data.message;
    } else if (error.request) {
      // 请求已发出但无响应
      console.error('无响应:', error.request);
      errorMsg = '服务器无响应';
    } else {
      // 其他错误
      console.error('请求错误:', error.message);
      errorMsg = error.message;
    }

    progressText.textContent = errorMsg;
    setTimeout(() => progressText.remove(), 3000);
    return { success: false, error: errorMsg };
  }
};

const selectedModel = ref('zhipu'); // 默认选择zhipu
const modelOptions = [
  { value: 'zhipu', label: 'DeepSeek-R1' },
  { value: 'qwen', label: 'Qwen3' },
  { value: 'deepseek', label: 'GLM-4-Flash' }
];

const handleModelChange = async (value) => {
  console.log('切换模型:', value);
  
  try {
    // 调用后端接口切换模型
    const response = await axios.post(
      'http://localhost:8082/changemodel',
      { model: value }, // POST请求数据体
      {
        headers: {
          'Content-Type': 'application/json' // 设置JSON请求头
        }
      }
    );

    // 处理成功响应
    if (response.status === 200) {
      console.log('模型切换成功:', response.data.message);
      // 这里可以添加成功切换后的逻辑，例如更新UI状态
    } else {
      console.warn('模型切换失败:', response.data.error);
    }
  } catch (error) {
    // 处理错误
    console.error('模型切换接口调用失败:', error);
  }
};
</script>

<template>
  <div class="chat-container">

    <div class="chat-header">
      <el-tooltip class="box-item" :content="chatTitle" placement="bottom">
        <span class="title">{{ chatTitle }}</span>
      </el-tooltip>
    </div>


    <div ref="chatMainRef" class="chat-main">
      <div class="chat-content">
        <div class="image-preview-area" v-if="uploadedImages.length > 0">
          <div class="image-preview-header">
            <span>已上传图片</span>
            <el-button 
              size="small" 
              type="danger" 
              plain 
              @click="clearAllImages"
            >
              清除所有
            </el-button>
          </div>
          <div class="image-preview-list">
            <div 
              v-for="(image, index) in uploadedImages" 
              :key="index" 
              class="image-preview-item"
            >
              <img :src="image.url" :alt="'上传图片-' + index">
              <div class="image-actions">
                <el-button 
                  circle 
                  size="small" 
                  @click="removeImage(index)"
                >
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
              <div class="image-analysis" v-if="image.analysis">
                {{ image.analysis }}
              </div>
            </div>
          </div>
        </div>
        <div class="chat">
          <AssistantChat key="system" :content="'您好！我是贴心的小助手，有什么可以帮助您的吗？'"></AssistantChat>
          <template v-for="(item, index) in chatting">
            <HumanChat :key="index" v-if="item.role === 'user'" :content="item.content" :error="item.error"></HumanChat>
            <AssistantChat
              :key="index"
              v-if="item.role === 'assistant'"
              :content="item.content"
              :think="item.think"
              :is-stream="item.isStream"
              :hasThinkCard="true"
              :error="item.error"
            ></AssistantChat>
          </template>
        </div>

        <div class="chat-input-container">
          <div class="chat-loading" v-if="loading">
            <ChatLoading></ChatLoading>
          </div>
          

          <div class="input-card">
            <el-input
              v-model="humanInput"
              class="chat-send-input"
              type="textarea"
              :autofocus="true"
              :autosize="{ minRows: 3, maxRows: 20 }"
              :readonly="disabled"
              maxlength="2000"
              show-word-limit
              @keydown.enter="inputKeyboard"
              placeholder="请输入对话内容……"
            >
            </el-input>
            <div class="bottom-send-image">
              <!-- 上传图片按钮 -->
              <el-upload
                action=""
                :show-file-list="false"
                :auto-upload="false"
                :on-change="handleImageUpload"
                class="upload-btn"
              >
                <el-button type="primary" plain round>
                  <img src="../../assets/camera.png" alt="上传图片" class="upload-icon" />
                </el-button>
              </el-upload>
            </div>
            <div class="bottom-send">
              <el-button v-if="isStream" type="primary" plain round @click="onCancelRequest">
                <StopIcon size="20px" />
              </el-button>
              <el-button v-else type="primary" plain round :loading="loading" :disabled="disabled" @click="onSubmit">
                <SendIcon size="20px" />
              </el-button>
            </div>

            <div class="chat-send-bottom-controls">
              <el-text type="info" size="small">内容由 AI 生成，请仔细甄别</el-text>
              <div class="send-controls-extra">
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
                <div class="model-selector">
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
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-container {
  // margin-top: 10px;
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom right, #f2f5f5, 60%, #f3f2f2);

  .chat-header {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    height: 60px;

    .title {
      max-width: 1000px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: bold;
      white-space: nowrap;
    }
  }

  .chat-main {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    width: 100%;
    min-height: calc(100% - 60px);
    overflow: auto;

    .chat-content {
      position: relative;
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      max-width: 1000px;
      height: 100%;

      .chat {
        box-sizing: border-box;
        flex: 1;
        width: 100%;
        padding: 0 20px 30px;
      }

      .chat-input-container {
        position: sticky;
        bottom: 0;
        z-index: 1;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: auto;

        .chat-loading {
          margin-bottom: 5px;
        }

        .input-card {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          padding: 20px;
          background-color: #e7e7e7;
          border-radius: 26px 26px 0 0;
          box-shadow: rgb(0 0 0 / 18%) 4px 14px 24px 14px;

          .chat-send-input {
            flex: 1;
            /* stylelint-disable-next-line selector-class-pattern */
            :deep(.el-textarea__inner) {
              padding: 10px 66px 20px 24px;
              resize: none;
              background-color: #f7f7f7;
              border: 0;
              border-radius: 26px;
              box-shadow: none;

              &:focus {
                outline: none;
                box-shadow: 0 0 0 1px var(--el-color-primary-light-5) inset;
              }

              &:read-only {
                box-shadow: none;
              }
              // /* 上传按钮样式 */
              // .upload-btn {
              //   margin-right: 10px;
              // }

              // .upload-icon {
              //   width: 16px;
              //   height: 16px;
              //   vertical-align: middle;
              // }

              // /* 底部按钮容器调整 */
              // .bottom-send-image {
              //   width: 24px;
              //   height: 24px;
              //   display: flex;
              //   align-items: center;
              //   margin-top: 10px;
              //   margin-right: 30px;
              // }
            }
            /* stylelint-disable-next-line selector-class-pattern */
            :deep(.el-input__count) {
              right: 16px;
            }
          }

          .bottom-send {
            position: absolute;
            right: 32px;
            bottom: 88px;
            display: flex;
            align-items: center;
            font-size: var(--el-font-size-small);
            color: var(--el-text-color-placeholder);

            .el-button {
              margin-left: 10px;
            }
          }
          .bottom-send-image {
            position: absolute;
            right: 100px;
            bottom: 88px;
            display: flex;
            align-items: center;
            font-size: var(--el-font-size-small);
            color: var(--el-text-color-placeholder);

            .el-button {
              margin-left: 10px;
            }
          }
          .chat-send-bottom-controls {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 35px;
            margin-top: 10px;

            .send-controls-extra {
              position: absolute;
              display: flex;
              top: 0;
              left: 0;
              width: 100%;
              .model-selector {
                margin-left: auto;
                width: 150px;
                height: 40px;
                padding: 12px 16px;
                margin-top: 0px;
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
            }
          }
        }
      }
    }
  }
}
.image-preview-area {
  margin: 16px;
  padding: 12px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.image-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.image-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--el-border-color);
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 4px;
  right: 4px;
}

.image-analysis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
