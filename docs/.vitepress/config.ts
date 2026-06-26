import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MayJS',
  description: '高性能 Minecraft JavaScript 引擎插件文档',
  lang: 'zh-CN',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: 'API', link: '/api/overview' },
      { text: '示例', link: '/examples/' },
      { text: 'FAQ', link: '/faq' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '配置文件', link: '/guide/config' }
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '脚本类型', link: '/guide/script-types' },
            { text: '热重载', link: '/guide/hot-reload' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '总览', link: '/api/overview' },
            { text: 'events 事件', link: '/api/events' },
            { text: 'commands 命令', link: '/api/commands' },
            { text: 'scheduler 调度', link: '/api/scheduler' },
            { text: 'storage 存储', link: '/api/storage' },
            { text: 'papi 变量', link: '/api/papi' },
            { text: 'reflect 反射', link: '/api/reflect' },
            { text: 'require 模块', link: '/api/modules' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '示例索引', link: '/examples/' },
            { text: '欢迎消息', link: '/examples/welcome-message' },
            { text: '自定义命令', link: '/examples/custom-command' },
            { text: '定时公告', link: '/examples/scheduled-broadcast' },
            { text: '自定义事件', link: '/examples/custom-events' },
            { text: 'PAPI 变量', link: '/examples/papi-variables' },
            { text: '持久化数据', link: '/examples/persistent-data' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/MayIHaveK/mayjs-docs' }
    ],

    footer: {
      message: 'MayJS - 让 JavaScript 在 Minecraft 中绽放',
      copyright: 'Copyright © 2024 MayIHaveK'
    },

    search: {
      provider: 'local'
    },

    outline: {
      label: '目录',
      level: [2, 3]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新'
    }
  }
})
