# 配置文件与安全

主配置文件位于 `plugins/MayJS/config.yml`，修改后无需重启服务器，直接执行 `/mayjs reload` 即可热生效（含安全沙箱黑名单、引擎模式与熔断参数）。

## 完整配置示例

```yaml
bind:
  qq: "2534226689"

script-engine:
  # 多引擎选择策略：
  #   auto    - 优先选择最高优先级可用引擎（装有 MayJS-GraalJS 时自动启用 GraalJS，否则回退 Nashorn）
  #   nashorn - 强制使用 Nashorn
  #   graaljs - 强制使用 GraalJS（不可用时自动告警并回退）
  engine: auto

  # 脚本执行熔断保护（仅支持熔断的引擎如 GraalJS 生效，0 表示不限制）
  execution-limit:
    # 单次求值最大语句数上限，防止 while(true) 死循环卡死主线程（生产建议 500000）
    max-statements: 500000
    # 单次求值超时毫秒数（生产建议 5000）
    timeout-ms: 5000

  warmup-on-startup: true
  file-watcher: true
  debounce-time-ms: 500
  log-execution-result: false
  log-cache-operations: false
  log-cache-hit: false
  log-watcher-events: false
  # 仅对不支持现代语法的引擎（Nashorn）生效：manual | off
  transpile: manual

auto-commands:
  enabled: false
  delay-ticks: 20
  commands:
    - "say 服务器启动完成！"

auto-scripts:
  enabled: false
  scripts:
    - "startup_service"

security:
  sandbox:
    enabled: true
    blacklist:
      - "java.lang.Runtime"
      - "java.lang.ProcessBuilder"
      - "java.io.File"
      - "java.nio.file."
      - "java.net."
      - "javax.script."
```

## 安全沙箱说明

开启 `security.sandbox.enabled: true` 后，MayJS 会同时在四个层面强制拦截黑名单类与包前缀（以 `.` 结尾表示拦截整个包）：

1. **跨插件类加载器**（`CompositePluginClassLoader`）
2. **脚本引擎原生拦截**（Nashorn 动态 `ClassFilter` / GraalJS 动态 `allowHostClassLookup`）
3. **反射工具防绕过**（`ClassResolver` / `ReflectionService` / `FastReflection`）
4. **GraalJS 额外硬隔离**：始终禁用原生 Polyglot 文件 I/O（`IOAccess.NONE`）、子进程创建（`allowCreateProcess(false)`）、JNI 本地访问（`allowNativeAccess(false)`）与脚本自建线程（`allowCreateThread(false)`）。

::: warning 注意
- 在 GraalJS 引擎下，修改 `security.sandbox` 后运行 `/mayjs reload` 对所有现有和新建会话即时生效。
- 在 Nashorn 引擎下，由于 Nashorn `ClassFilter` 在构造引擎时决定是否挂载，若启动时关闭了沙箱、运行中再首次开启，建议重启服务器以确保全部已有 Nashorn 会话挂入 `ClassFilter`。
:::
