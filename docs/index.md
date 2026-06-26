---
layout: home

hero:
  name: MayJS
  text: Minecraft JavaScript 引擎
  tagline: 用 JavaScript 轻松扩展你的服务器功能。预编译缓存、热重载、模块系统，开箱即用。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: API 参考
      link: /api/overview

features:
  - icon: ⚡
    title: 极致性能
    details: 内置预编译缓存，重复执行性能提升 50-200 倍。脚本编译一次，后续调用几乎零开销。
  - icon: 🔄
    title: 智能热重载
    details: 文件保存后自动重载，服务脚本资源自动清理与恢复。开发体验丝滑流畅。
  - icon: 📦
    title: 模块系统
    details: 完整的 CommonJS 规范支持。require/exports 按需加载，模块隔离互不污染。
  - icon: 🎯
    title: 全版本兼容
    details: 支持 Minecraft 1.7.10 - 1.21，JDK 8 - 21。Spigot/Paper/Purpur/Mohist 均可运行。
  - icon: 🔗
    title: 无缝 Java 互操作
    details: 直接调用 Bukkit API，反射系统穿透私有成员，动态实现 Java 接口。
  - icon: 🛡️
    title: 安全沙箱
    details: 可选的类黑名单沙箱机制，阻止脚本访问危险 API，保障服务器安全。
---
