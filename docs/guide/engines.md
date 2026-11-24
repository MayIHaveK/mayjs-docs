# 多引擎架构 (Nashorn / GraalJS)

MayJS 3.0 通过 `mayjs-api` 中的 `JsEngineBackend` / `JsEngineSession` SPI 实现了引擎后端解耦，使同一套业务脚本和脚本包能够平滑运行在 Nashorn 与 GraalJS 之上。

## 1. 引擎能力对比

| 特性 | Nashorn（内置后端） | GraalJS 24.2.2（`MayJS-GraalJS.jar`） |
| --- | --- | --- |
| 引擎 ID | `nashorn` | `graaljs` |
| `auto` 优先级 | `100` | `200`（更高，自动优先） |
| JDK 要求 | JDK 8 – 21（JDK 15+ 需 `NashornJs`） | JDK 21+ |
| 语言标准 | ES5.1 / ES6 子集 | **原生 ECMAScript 2023+** |
| `//@es6` 处理 | 依赖 Node.js + Babel 转译 | **自动跳过转译，原生零开销运行** |
| 动态安全沙箱 | `ClassFilter` + 统一类解析拦截 | `HostAccess` + `allowHostClassLookup` + 禁 IO/进程/线程 |
| 死循环熔断 | 不支持 | **支持语句数配额 + 超时看门狗 + 熔断后同域服务自动自愈** |
| Nashorn 语法兼容 | 原生 | 已开启 `js.nashorn-compat`，支持 `Java.type` / `Packages` |

::: tip 独立运行模式（可供 MayDungeon 等插件单独使用）
`MayJS-GraalJS.jar` 声明为 `softdepend: [MayJS]`，且将 MayJS 3.0 API 桥接做了类加载隔离：
- **同时安装 MayJS 3.0+**：自动接入 MayJS 多引擎平台，并同时可供 `MayDungeon` 等生态插件调用；
- **未安装 MayJS（或仍为旧版 MayJS 2.x）**：`MayJS-GraalJS` 会保持启用并以独立 GraalJS 24.2.2 运行时模式工作，只使用 `MayDungeon` 的服主无需安装 `MayJS`。
:::

## 2. 引擎路由优先级

MayJS 按以下顺序为每个脚本或脚本包选择执行引擎：

1. **脚本/脚本包显式声明**（最高优先级）：
   - 散脚本头部注释：`//@engine graaljs` 或 `//@engine nashorn`
   - 脚本包 `script.yml`：`engine: graaljs` / `nashorn` / `auto`
2. **全局配置**：`config.yml` 中的 `script-engine.engine`（`auto` / `nashorn` / `graaljs`）。
3. **自动回退**：若请求的引擎不可用（例如未安装 `MayJS-GraalJS` 或当前为 JDK 17），自动打印告警并回退到优先级最高的可用引擎。

```javascript
//@service
//@engine graaljs
function onLoad() {
    const version = 'ES2023+';
    print(`此脚本优先使用 GraalJS 运行：${version}`);
}
```

## 3. 死循环熔断与同域自愈（GraalJS）

在 `config.yml` 配置 `max-statements` 与 `timeout-ms` 后：
- 每次顶层脚本执行或函数回调开始前会自动重置语句配额计数器，正常业务不会累积触发误杀。
- 一旦某个脚本进入死循环（如 `while (true) {}`），GraalJS 会在数毫秒内中止执行并输出精确的红字错误（含文件名、行号与列号）。
- 随后 MayJS 会自动丢弃受损上下文，并将同一执行域上其他健康的 `@service` 脚本与脚本包**自动重建到全新的 GraalJS 会话上**，线上指令与监听器零中断。

## 4. GraalJS 性能优化：GraalVM JDK 21 与 JIT 状态诊断

GraalJS 基于 Truffle 语言框架，在不同 JDK 上的执行模式有明显差异：

| 服务端 JVM | GraalJS 运行模式 | 适用场景 |
| --- | --- | --- |
| **GraalVM for JDK 21**（Oracle GraalVM / GraalVM CE，推荐） | **Truffle JIT 编译优化**（热点 JS 经部分求值编译为本地机器码） | 生产服最佳选择，高频每 tick 运算、粒子数学计算与复杂脚本峰值性能远超 Nashorn |
| **普通 OpenJDK 21**（Temurin / Zulu / Corretto / Oracle JDK） | **纯解释模式**（Interpreter-Only Fallback） | 轻量事件回调与胶水脚本可开箱即用；但密集计算循环比 JIT 模式慢数倍至数十倍 |

MayJS 启动日志与 `/mayjs engine` 会自动探测底层 Polyglot 运行时并展示实时状态：
- 已启用 JIT：`Truffle JIT 已启用 (GraalVM ...)`
- 未启用 JIT：黄色提示 `Truffle JIT 未启用 (当前为纯解释模式: Interpreted，建议换用 GraalVM JDK 21 获取最佳性能)`

## 5. 跨插件与混合端（Mod）类加载

Nashorn 与 GraalJS 共用同一个 `CompositePluginClassLoader`（按「父加载器 → 所有已启用插件 ClassLoader → 服务端/混合端 Mod ClassLoader 与 TCCL 兜底」顺序检索，且自动去重防循环委托）：
- **跨插件**：`Java.type("com.otherplugin.SomeApi")` 在 Nashorn 与 GraalJS 下均直接可用，并受安全沙箱统一约束。
- **混合端（Arclight / Mohist / Banner / Youer / CatServer 等）**：`Java.type` 与 `reflect.importClass(null, ...)` 会自动兜底检索服务端与 Mod 类加载器；访问 Mod/NMS 非 public 字段或方法时仍建议配合 `reflect.getFastReflection()`。

## 6. 运维查看命令

随时运行 `/mayjs engine` 查看所有已注册后端的可用性、能力矩阵与 GraalJS 的 JIT 运行时状态。
