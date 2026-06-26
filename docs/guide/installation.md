# 安装

## 前置要求

- **服务端**: Spigot / Paper / Purpur / Mohist 等，Minecraft 1.7.10 - 1.21
- **Java**: JDK 8 或更高版本
- **内存**: 建议 2GB+

## 安装步骤

1. 将 `MayJS.jar` 放入服务器 `plugins/` 目录

2. （JDK 15+ 必须）同时放入 `NashornJs-1.1.3.jar`
   > JDK 15 移除了内置 Nashorn 引擎，需要通过此插件补回。JDK 8-14 可跳过。

3. （可选）放入 `PlaceholderAPI.jar` — 启用变量解析功能

4. 启动服务器

5. 输入 `/mayjs` 验证安装成功

## 生成的目录结构

首次启动后自动生成：

```
plugins/MayJS/
├── config.yml          # 主配置文件
├── auto-run-list.yml   # 自动运行脚本列表
└── scripts/            # 脚本存放目录
    └── libs/           # 模块库目录
```

## 可选依赖

| 插件 | 用途 | 必须？ |
|------|------|--------|
| NashornJs | JDK 15+ 环境提供 Nashorn 引擎 | JDK 15+ 必须 |
| PlaceholderAPI | 变量解析与自定义变量注册 | 可选 |
| ProtocolLib | 数据包操作（高级用法） | 可选 |

## 下一步

安装完成后，前往 [快速开始](./quick-start) 编写你的第一个脚本。
