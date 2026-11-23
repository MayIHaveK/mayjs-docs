---
layout: home

hero:
  name: MayJS 3.0
  text: Minecraft 多引擎 JavaScript 平台
  tagline: 可插拔 Nashorn / GraalJS 双引擎、开放 Addon SPI、加密脚本包 (.mjsb) 与完整 CLI 开发者工具链，从 1.7.10 到 1.21+ 一站式覆盖。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/installation
    - theme: alt
      text: 脚本包 & CLI
      link: /guide/bundles
    - theme: alt
      text: API 参考
      link: /api/overview

features:
  - icon: ⚙️
    title: 多引擎 SPI（Nashorn + GraalJS）
    details: 内置 Nashorn 全版本兜底；JDK 21+ 放入配套插件 MayJS-GraalJS 即可自动激活 GraalJS 24.2，原生畅写 ES2023+ 无需 Babel。
  - icon: 🛡️
    title: 沙箱防护 + 死循环熔断自愈
    details: 统一四层类黑名单沙箱支持热重载；GraalJS 支持语句数与超时双熔断，恶意死循环即时中止且自动自愈重建同域健康服务。
  - icon: 📦
    title: Script Bundle 与 .mjsb 加密分发
    details: 支持 script.yml 目录包与 AES-256-GCM + AAD 认证加密归档 .mjsb；纯内存解包永不落盘，支持可选 QQ 绑定与过期时间授权头。
  - icon: 🧩
    title: 开放 Addon SPI (mayjs-api)
    details: 无混淆公开 API 模块。第三方插件可注入全局对象、挂接 onDispose 自动清理钩子、监听脚本生命周期或扩展自定义引擎。
  - icon: 🔄
    title: 零泄漏热重载与运维命令
    details: 事件、命令、PAPI、任务与 onDispose 按 LIFO 倒序彻底释放；新增 reload / list / info / unload / engine / bundle 全套运维子命令。
  - icon: 🛠️
    title: mayjs-cli 与 TypeScript 补全
    details: 提供独立可执行 CLI（init / check / encrypt / pack / inspect / compile）与官方 types/mayjs.d.ts，VS Code 智能补全开箱即用。
---
