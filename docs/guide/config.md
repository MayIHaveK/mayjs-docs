# 配置文件

MayJS 的主配置文件位于 `plugins/MayJS/config.yml`。

修改配置后使用 `/mayjs reload-script` 重载生效。

## 完整配置

```yaml
# ========================
# MayJS 配置文件
# ========================

# 脚本引擎设置
script-engine:
  # 启动时预热编译缓存（加快首次执行速度）
  warmup-on-startup: true

  # 文件监听（开启后修改脚本文件自动重载）
  file-watcher: true

  # 防抖时间（毫秒），IDE 保存可能触发多次写入，防抖避免重复重载
  debounce-time-ms: 500

  # 调试日志（生产环境建议关闭）
  log-execution-result: false
  log-cache-operations: false
  log-cache-hit: false
  log-watcher-events: false

# 服务器启动后自动执行命令
auto-commands:
  enabled: false
  delay-ticks: 100          # 延迟多少 tick 后执行（20 tick = 1 秒）
  commands:
    - "say 服务器启动完成！"

# 服务器启动后自动执行脚本
auto-scripts:
  enabled: false
  scripts: []               # 脚本名列表（不含 .js 后缀）

# 安全沙箱
security:
  sandbox:
    enabled: false          # 是否启用类黑名单
    blacklist:              # 禁止脚本访问的 Java 类
      - "java.lang.Runtime"
      - "java.lang.ProcessBuilder"
      - "java.net.ServerSocket"

# 脚本加密
# 无需配置，使用 /mayjs encrypt <脚本> 命令加密即可
```

## 配置项说明

### script-engine

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `warmup-on-startup` | boolean | `true` | 启动时扫描 scripts 目录，预编译所有脚本 |
| `file-watcher` | boolean | `true` | 监听文件变更，修改后自动重载 |
| `debounce-time-ms` | long | `500` | 文件变更防抖窗口（毫秒） |
| `log-execution-result` | boolean | `false` | 打印脚本执行结果 |
| `log-cache-operations` | boolean | `false` | 打印缓存编译/失效操作 |
| `log-cache-hit` | boolean | `false` | 打印缓存命中日志 |
| `log-watcher-events` | boolean | `false` | 打印文件监听事件 |

### auto-commands

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | boolean | `false` | 是否启用自动命令 |
| `delay-ticks` | int | `100` | 服务器启动后延迟执行（tick） |
| `commands` | list | `[]` | 要执行的命令列表（以控制台身份） |

### auto-scripts

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | boolean | `false` | 是否启用自动脚本 |
| `scripts` | list | `[]` | 要执行的脚本名列表 |

::: tip auto-scripts vs @service
`auto-scripts` 适合一次性执行的初始化脚本。如果需要长期驻留（监听器、命令），用 `@service` 脚本 + `auto-run-list.yml` 更合适。
:::

### security.sandbox

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `enabled` | boolean | `false` | 是否启用安全沙箱 |
| `blacklist` | list | `[]` | 禁止 `Java.type()` 加载的类名列表 |

启用沙箱后，脚本中调用 `Java.type("java.lang.Runtime")` 等被禁类会抛出异常。

### encryption

MayJS 支持脚本加密保护。

::: tip 脚本加密
| 扩展名 | 说明 |
|--------|------|
| `.js` | 普通脚本 |
| `.mjs` | 加密脚本 |

加密命令：
```bash
/mayjs encrypt my_script
```

加密后原文件保留，确认无误后手动删除。加密脚本运行方式与普通脚本一致，无性能损耗。
:::

## auto-run-list.yml

除了 `config.yml`，还有一个 `auto-run-list.yml` 管理服务脚本的自动加载：

```yaml
# 服务器启动时自动加载的服务脚本
scripts:
  - "welcome"
  - "custom-commands"
  - "announcer"
```

列表中的脚本会在插件启用时自动执行 `onLoad()`。

## 生产环境建议

```yaml
script-engine:
  warmup-on-startup: true
  file-watcher: true
  debounce-time-ms: 500
  log-execution-result: false
  log-cache-operations: false
  log-cache-hit: false
  log-watcher-events: false

security:
  sandbox:
    enabled: true
    blacklist:
      - "java.lang.Runtime"
      - "java.lang.ProcessBuilder"
      - "java.net.ServerSocket"
      - "java.io.FileOutputStream"
      - "java.io.FileWriter"
```
