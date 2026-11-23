# 安装与环境选型

MayJS 3.0 采用「轻量主插件 + 可插拔引擎伴生插件」架构，一套脚本平台即可覆盖从 Minecraft 1.7.10（JDK 8）到 Minecraft 1.21+（JDK 21）的全部服务端。

## 1. 环境选型对照表

| 服务端环境 | 推荐安装文件 | 默认引擎 | 现代 ES2023+ | 死循环熔断 |
| --- | --- | --- | --- | --- |
| **Paper / Purpur 1.20.5 – 1.21+ (JDK 21+)** | `MayJS-3.0.0-obf.jar` + `MayJS-GraalJS-3.0.0.jar` | **GraalJS 24.2.2** | 原生支持（免 Babel） | 支持（语句数 + 超时） |
| **Spigot / Paper 1.16.5 – 1.20.4 (JDK 17)** | `MayJS-3.0.0-obf.jar` + `NashornJs-1.2.0-norelocate.jar` | **Nashorn** | 需 `//@es6` 或 CLI 预编译 | 不支持 |
| **Spigot / Paper / Mohist 1.7.10 – 1.16.5 (JDK 8 / 11)** | `MayJS-3.0.0-obf.jar` | **JDK 内置 Nashorn** | 需 `//@es6` 或 CLI 预编译 | 不支持 |

::: tip 伴生插件部署与 JVM 性能建议
- `MayJS-GraalJS.jar` 是一个独立的标准 Bukkit 插件，直接与 `MayJS.jar` 并列放入 `plugins/` 目录即可。MayJS 会在启动期通过 SPI 自动发现并激活它，**无需卸载或修改任何配置**。
- 普通 OpenJDK 21 可开箱运行 `MayJS-GraalJS`，但默认处于 Truffle 纯解释模式；若服务端承载高频/重计算脚本，**强烈建议使用 GraalVM for JDK 21 启动服务端**以零配置开启 Truffle JIT 编译优化（详见 [多引擎架构](./engines#4-graaljs-性能优化-graalvm-jdk-21-与-jit-状态诊断)）。
:::

## 2. 安装步骤

1. 下载并放入 `plugins/`：
   - 必需：`MayJS-3.0.0-obf.jar`
   - 引擎（按上表二选一）：`MayJS-GraalJS-3.0.0.jar`（JDK 21+ 推荐）或 `NashornJs-1.2.0-norelocate.jar`（JDK 15–20）
   - 可选生态插件：`PlaceholderAPI`、`ProtocolLib`
2. 启动服务器一次以生成默认目录与配置文件：
   ```text
   plugins/MayJS/
   ├── config.yml           # 主配置（引擎模式、熔断、沙箱、自动任务）
   ├── auto-run-list.yml    # 热更新自动运行脚本清单
   ├── data/storage.db      # SQLite 持久化数据库
   ├── bundles/             # 各脚本包独立数据目录与可编辑 config.yml
   └── scripts/             # 散脚本 (.js/.mjs)、目录脚本包与 .mjsb 归档包
   ```
3. 在 `plugins/MayJS/config.yml` 中确认 `bind.qq` 授权配置并重启服务器。
4. 在控制台执行 `/mayjs engine` 确认激活的引擎后端状态：
   ```text
   配置模式: auto  当前激活: graaljs
   熔断限制: 最大语句=500000  超时=5000ms
   已注册引擎后端 (2):
     [激活] graaljs (GraalJS 24.2.2 (ECMAScript 2023+), priority=200) ES6+:支持 熔断:支持
     [不可用] nashorn (Nashorn (ES5.1 / ES6-subset), priority=100) ES6+:需转译 熔断:无
   ```
