import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'MayJS 3.0',
  description: '面向 Minecraft 的多引擎 JavaScript 脚本平台文档',
  lang: 'zh-CN',
  base: '/mayjs-docs/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '/logo.png',

    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '脚本包 & CLI', link: '/guide/bundles' },
      { text: 'API', link: '/api/overview' },
      { text: '示例', link: '/examples/' },
      { text: 'v2 → v3', link: '/guide/migration-v2-to-v3' },
      { text: 'FAQ', link: '/faq' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门',
          items: [
            { text: '安装与选型', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: '配置文件与安全', link: '/guide/config' }
          ]
        },
        {
          text: '核心概念',
          items: [
            { text: '多引擎架构 (Nashorn / GraalJS)', link: '/guide/engines' },
            { text: '脚本类型与生命周期', link: '/guide/script-types' },
            { text: '热重载与资源追踪', link: '/guide/hot-reload' },
            { text: 'ES6+ 语法与转译', link: '/guide/transpile' }
          ]
        },
        {
          text: '脚本包与工程生态',
          items: [
            { text: '脚本包 (.mjsb) 与授权头', link: '/guide/bundles' },
            { text: 'CLI 工具链与 IDE 补全', link: '/guide/cli-and-ide' },
            { text: 'Java Addon SPI 扩展开发', link: '/guide/addon-spi' },
            { text: 'v2 → v3 迁移指南', link: '/guide/migration-v2-to-v3' }
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '总览与全局对象', link: '/api/overview' },
            { text: 'bundle 脚本包上下文', link: '/api/bundle' },
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
            { text: '现代 ES2023+ 脚本包', link: '/examples/bundle-daily-reward' },
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
      { icon: 'github', link: 'https://github.com/MayIHaveK/MayJS' }
    ],

    footer: {
      message: 'MayJS 3.0 · 面向 Minecraft 的多引擎 JavaScript 平台',
      copyright: 'Copyright © 2024-2026 MayIHaveK'
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
