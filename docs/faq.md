# 常见问题

## 安装问题

### 启动报错 `NoClassDefFoundError: javax/script/ScriptEngine`

你的 JDK 版本 ≥ 15，需要安装 `NashornJs` 插件。将 `NashornJs-1.1.3.jar` 放入 `plugins/` 目录即可。

### 启动后 `/mayjs` 命令无响应

检查控制台是否有报错。常见原因：
- 插件未成功启用（查看启动日志）
- 权限不足：需要 `mayjs.use` 权限或 OP 身份

### 与 Mohist/Catserver 的兼容性

MayJS 兼容 Forge+Bukkit 混合端。如果遇到类加载问题，尝试在 `config.yml` 中启用跨插件 ClassLoader：

```yaml
js-engine:
  classloader:
    allow-cross-plugin: true
```

## 脚本编写

### `Java.type` 找不到类

```javascript
// ❌ 找不到其他插件的类
var SomeClass = Java.type("com.otherplugin.SomeClass");

// ✅ 使用 reflect.importClass 跨插件加载
var SomeClass = reflect.importClass("OtherPlugin", "com.otherplugin.SomeClass");
```

`Java.type()` 只能加载标准库和 Bukkit API。其他插件的类需要通过 `reflect.importClass()` 加载。

### 监听器注册了但不触发

1. 确认事件类名是**全限定名**（包含包路径）
2. 确认拼写正确（大小写敏感）
3. 确认事件确实被触发了（某些事件需要特定条件）
4. 检查控制台有无报错

```javascript
// ❌ 错误
events.listen("PlayerJoinEvent", function(e) {});

// ✅ 正确
events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {});
```

### `sender` 为 null

`sender` 只在通过 `/mayjs run` 执行时注入。在服务脚本的 `onLoad()` 中 `sender` 不可用。

如果需要在 `onLoad()` 中操作玩家，使用事件监听获取玩家对象。

### require 路径报错

`require()` 路径相对于 `plugins/MayJS/scripts/` 目录：

```javascript
// 文件位置: plugins/MayJS/scripts/libs/utils.js
var utils = require("libs/utils.js");  // ✅

// ❌ 不要用绝对路径
var utils = require("plugins/MayJS/scripts/libs/utils.js");
```

### 中文乱码

确保脚本文件以 **UTF-8** 编码保存。Windows 记事本默认可能是 GBK，建议用 VS Code 或其他现代编辑器。

## 性能问题

### 脚本执行变慢

- 检查是否有死循环或过于频繁的定时任务
- 开启调试日志确认缓存是否命中：
  ```yaml
  script-engine:
    log-cache-hit: true
  ```
- 避免在 `PlayerMoveEvent` 等高频事件中执行复杂逻辑

### 内存占用过高

- 检查是否有大量数据存在内存存储中而未设置 TTL
- 服务脚本中避免在全局变量中累积数据
- 确认热重载后旧资源确实被清理（查看控制台日志）

## 热重载

### 修改文件后没有自动重载

1. 确认 `config.yml` 中 `file-watcher: true`
2. 确认文件在 `scripts/` 目录下（子目录也会监听）
3. 某些编辑器（如 vim）使用"写入临时文件再重命名"的方式保存，可能不触发标准 WatchService 事件。尝试用其他编辑器或手动 `/mayjs reload-script`

### 重载后命令/监听器重复

正常情况下不会发生。如果出现：
1. 确认脚本是 `//@service` 模式
2. 确认资源是在 `onLoad()` 中注册的
3. 尝试 `/mayjs reload-script` 手动重载

## 沙箱

### 如何阻止脚本执行系统命令？

在 `config.yml` 中启用沙箱并将危险类加入黑名单：

```yaml
security:
  sandbox:
    enabled: true
    blacklist:
      - "java.lang.Runtime"
      - "java.lang.ProcessBuilder"
      - "java.io.File"
      - "java.net.ServerSocket"
```

### 沙箱会影响性能吗？

几乎不会。沙箱检查只在 `Java.type()` 调用时触发一次字符串匹配，不影响后续方法调用。

## 加密

### 如何加密脚本？

`/mayjs encrypt 脚本名`，生成 `.mjs` 文件，原文件保留。

### 加密会影响性能吗？

不会。

### 同时存在 .js 和 .mjs 会怎样？

`.mjs` 优先加载。
