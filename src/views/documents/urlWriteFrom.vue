<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import type { DocTableType } from '@/api/documents/types'
import { BaseDialog } from '@/components/Dialog'
import { reactive, ref } from 'vue'
import axios from 'axios' // 引入axios
import { ElMessage } from 'element-plus'

/** props */
interface Props {
  /** 当前行数据 */
  currentRow: DocTableType | null
  /** 弹窗显隐 */
  open: boolean
}

const { currentRow, open } = defineProps<Props>()

// 判断弹窗表单是新增，还是编辑
const isEdit = currentRow == null ? false : true
const title = isEdit ? '编辑URL文档' : '新增URL文档'

const emit = defineEmits(['ok', 'closed'])
const loading = ref(false)
const visible = ref(open)

// 表单Ref
const docFormRef = ref<FormInstance>()

// 初始化表单数据
const docForm = isEdit
  ? reactive<DocTableType>(currentRow!)
  : reactive<DocTableType>({
      id: '',
      name: '',
      file_name: '',
      file_path: '',
      suffix: '',
      vector: '',
      date: ''
    })

/**
 * 表单校验规则
 */
const rules = reactive<FormRules<DocTableType>>({
  name: [{ required: true, message: '请输入文档名称！', trigger: 'blur' }],
  file_path: [
    { required: true, message: '请输入文件URL！', trigger: 'blur' },
    {
      type: 'url',
      message: '请输入有效的URL地址',
      trigger: ['blur', 'change']
    }
  ]
})

/**
 * 提交表单api
 */
const submitApi = async () => {
  loading.value = true

  try {
    // 构造请求数据
    const requestData = {
      name: docForm.name,
      url: docForm.file_path
    }

    // 使用axios直接调用接口
    const response = await axios.post('/api/documents/url_to_text', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // 处理响应
    if (response.data.code === 200) {
      emit('ok', response.data.data) // 传递后端返回的数据
      ElMessage.success('文档添加成功！')
      visible.value = false
    } else {
      ElMessage.error(response.data.message || '添加文档失败')
    }
  } catch (error: any) {
    console.error('提交URL文档失败:', error)
    // 更详细的错误处理
    const errorMessage = error.response?.data?.message ||
                        error.message ||
                        '提交URL文档失败，请稍后重试'
    ElMessage.error(errorMessage)
  } finally {
    loading.value = false
  }
}

/**
 * 提交按钮事件
 */
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(valid => {
    if (valid) {
      submitApi()
    }
  })
}

/**
 * 关闭按钮事件
 */
const onClose = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  visible.value = false
}

/**
 * 关闭动画结束后，再传递closed给父组件来销毁弹窗组件
 */
const onClosed = () => {
  emit('closed', false)
}
</script>

<template>
  <BaseDialog :title="title" v-model="visible" @closed="onClosed()">
    <el-form ref="docFormRef" :model="docForm" :rules="rules" label-width="120px" status-icon>
      <el-form-item label="文档名称" prop="name">
        <el-input v-model="docForm.name" placeholder="请输入文档名称" />
      </el-form-item>
      <el-form-item label="文件URL" prop="file_path">
        <el-input
          v-model="docForm.file_path"
          placeholder="请输入文件URL地址"
          clearable
        >
          <template #append>
            <el-button @click="docForm.file_path = ''">清空</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="primary" :loading="loading" @click="onSubmit(docFormRef)">提交</el-button>
      <el-button @click="onClose(docFormRef)">关闭</el-button>
    </template>
  </BaseDialog>
</template>

<style lang="scss" scoped>
.el-form {
  margin-right: 80px;

  :deep(.el-input-group__append) {
    padding: 0 10px;
  }
}
</style>
