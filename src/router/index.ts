import { createRouter, createWebHistory } from 'vue-router'
import LayoutClassic from '@/layout/LayoutClassic.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/chat'
    },
    {
      path: '/home', // 单独的 Home 页面，不放在 children 里
      name: 'Home',
      meta: {
        title: '首页',
        icon: 'House'
      },
      component: () => import('@/views/home/index.vue') // 确保这个文件存在
    },
    {
      path: '/',
      component: LayoutClassic,
      children: [
        {
          path: '/chat',
          name: 'Chat',
          meta: {
            title: '聊天',
            icon: 'ChatDotRound',
            keepAlive: true
          },
          component: () => import('@/views/chat/index.vue')
        },
        {
          path: '/documents',
          name: 'Documents',
          meta: {
            title: '知识库',
            icon: 'FolderOpened'
          },
          component: () => import('@/views/documents/index.vue')
        },
        // {
        //   path:'/home',
        //   name:'Home',
        //   meta:{
        //     title:'首页',
        //     icon:'House'
        //   },
        //   component: () => import('@/views/home/index.vue')
        // }
        // {
        //   path: '/md-preview',
        //   name: 'MdPreview',
        //   meta: {
        //     title: 'md主题预览',
        //     icon: 'Tickets'
        //   },
        //   component: () => import('@/views/test/index.vue')
        // }
      ]
    }
  ]
})

export default router
