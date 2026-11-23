# API 总览

MayJS 3.0 为所有脚本与模块自动注入以下全局服务与运行期函数，无需手动 `import` 或 `Java.type` 查找。

## 1. 核心内置全局对象

| 全局变量 | 职责 | 详细文档 |
| --- | --- | --- |
| `server` | 玩家查询、全服广播、发消息、临时虚拟 OP 执行 (`runAsVirtualOp`) | 下文简述 / [快速开始](/guide/quick-start) |
| `events` | 注册 Bukkit / 第三方插件事件监听、派发自定义事件 | [events 事件](/api/events) |
| `commands` | 注册/注销动态命令（含 Tab 补全）、派发控制台或玩家命令 | [commands 命令](/api/commands) |
| `scheduler` | 主线程延迟/周期任务、`TaskChain` 同步异步链式编排 | [scheduler 调度](/api/scheduler) |
| `storage` | 内存 KV + 玩家维度存储 + SQLite 持久化存储 + 异步回域路由 | [storage 存储](/api/storage) |
| `papi` | PlaceholderAPI 变量解析与动态占位符扩展注册 | [papi 变量](/api/papi) |
| `reflect` | 跨插件类加载、高性能反射与 Java 接口动态代理 | [reflect 反射](/api/reflect) |
| `bundle` | **3.0 新增**（仅脚本包内注入）：独立配置、数据目录、命名空间存储与日志 | [bundle 上下文](/api/bundle) |

## 2. 引擎基础设施与动态上下文

| 标识符 | 签名 | 说明 |
| --- | --- | --- |
| `require(modulePath)` | `(path: string) => any` | 加载 CommonJS 模块（脚本包内支持 `./` 相对路径，散脚本加载 `scripts/libs/`） |
| `print(message)` | `(msg: any) => void` | 向控制台输出日志（自动转为字符串，带 `[MayJS-Script]` 前缀） |
| `onDispose(fn)` | `(action: () => void) => void` | **3.0 新增**：向当前脚本生命周期注册清理钩子，卸载/热重载时按 LIFO 顺序执行 |
| `sender` | `CommandSender \| null` | 当前执行脚本的命令发送者（每次调用动态更新并在结束时恢复） |
| `args` | `List<String>` | 当前命令传入的参数列表 |
| `Java.type(className)` | `(name: string) => any` | Nashorn / GraalJS 兼容类导入（受安全沙箱黑名单约束） |

## 3. `server` (`PlayerService`) 快捷方法

```javascript
server.broadcast("§a全服公告内容");
var player = server.getPlayer("Steve");
var all = server.getOnlinePlayers();
server.sendMessage("Steve", "§e私聊提醒");

// 临时虚拟 OP 身份执行（自动收口并支持 PAPI 与底层权限劫持）
server.runAsVirtualOp(player, function (opPlayer) {
    opPlayer.performCommand("spawn");
    return true;
});
```

## 4. 外部 Addon 注入对象

若服务器安装了基于 `mayjs-api` 开发的第三方插件，其通过 `MayJsApi.registerBinding(plugin, name, service)` 注册的对象也会自动出现在全局作用域中。可运行 `/mayjs list` 查看当前服务器所有外部 Addon 绑定及其归属插件。
