# v2 → v3 升级迁移指南

MayJS 3.0 是一次平台级架构升级，同时坚持**“旧脚本无缝运行、新能力渐进采用”**的原则。

## 1. 升级兼容承诺

| 2.x 资产 | 3.0 兼容状态 | 说明 |
| --- | --- | --- |
| 普通脚本 (`main()`) 与 `//@service` 服务脚本 | **100% 兼容** | 无需修改源码 |
| 内置全局变量 (`server`/`events`/`commands`/`scheduler`/`papi`/`reflect`/`storage`/`require`/`print`) | **100% 兼容** | 保留原有方法签名 |
| 历史 `.mjs` (v1 AES-CBC) 加密脚本 | **100% 兼容** | 自动识别 v1/v2；新加密默认输出更安全的 v2 AES-GCM |
| `scripts/libs/` CommonJS 模块 | **100% 兼容** | 3.0 内部采用 IIFE 隔离包装，消除单 Context 全局污染 |
| `config.yml` 与 `auto-run-list.yml` | **向后兼容** | 新增 `script-engine.engine` 与 `execution-limit` 配置项（缺省自动回落默认值） |

## 2. 标记为 `@Deprecated` 的旧接口（仍可用，建议逐步迁移）

| 旧接口（`@Deprecated`） | 3.0 推荐替代写法 | 迁移收益 |
| --- | --- | --- |
| `commands.getFactory().createAndRegisterCommand(...)` | `commands.register(name, executor, tabCompleter)` / `commands.unregister(name)` | 自动追踪命令生命周期，热重载零残留 |
| `events.createListener(name, eventClass, priority, fn)` | `events.listen(eventClass, fn)` 或 `events.listen(eventClass, priority, fn)` | 更简洁，自动命名并挂载到 `ScriptContext` |
| `server.getVirtualOpPlayer(player)` | `server.runAsVirtualOp(player, function(op) { ... })` | 作用域结束自动收口，支持 PAPI 与底层权限劫持 |
| `com.mayihavek.mayjs.script.runtime.cleanup.ScriptDisposable`（Java） | `com.mayihavek.mayjs.api.cleanup.ScriptDisposable` | 独立无混淆公开 API，不绑定内部包路径 |

## 3. 从 Nashorn 迁移到 GraalJS（JDK 21+）

1. 将 `MayJS-3.0.0-obf.jar` 与 `MayJS-GraalJS-3.0.0.jar` 一并放入 `plugins/`，可移除 `NashornJs` 与服务端 Node.js。
2. 在 `config.yml` 中保持 `script-engine.engine: auto`（并推荐设置 `max-statements: 500000`、`timeout-ms: 5000`）。
3. **注意事项**：
   - GraalJS 已开启 `js.nashorn-compat`，`Java.type(...)`、`Packages.*`、Java 集合互操作与原有脚本基本无缝兼容。
   - 若极少数历史脚本依赖 Nashorn 特有扩展语法（如 JavaImporter 或非标准 `for each`），可在该脚本首行添加 `//@engine nashorn`（需同时安装 `NashornJs`），单独指定回退 Nashorn，其余脚本仍享受 GraalJS！

## 4. 新增能力速览

- **全新运维命令**：`/mayjs reload`、`/mayjs list`、`/mayjs info <脚本>`、`/mayjs unload <脚本>`、`/mayjs engine`、`/mayjs bundle <list|info|load|reload|unload|pack>`。
- **改进 `/mayjs reload-script`**：无参数重载全部脚本时，会自动恢复重载前处于运行状态的 `@service` 服务脚本，不再需要手动逐个重启。
- **全局 `onDispose(fn)`**：无需手写 `onUnload()` 变量表，在任何位置声明清理闭包即可按 LIFO 顺序自动执行。
- **工程化脚本包**：建议将复杂业务迁移为含 `script.yml` 的目录脚本包，发布时用 `mayjs-cli pack` 打包为 `.mjsb`。
