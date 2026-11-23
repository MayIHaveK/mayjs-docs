# CLI 工具链与 IDE 智能补全

MayJS 3.0 提供独立可执行命令行工具 **`mayjs-cli`**（JDK 8+ 通用，零 Bukkit 依赖）以及官方 TypeScript 类型声明 **`types/mayjs.d.ts`**，打通「初始化脚手架 → VS Code 智能提示 → 静态检查 → 加密打包 → 交付验包」全流程。

## 1. `mayjs-cli` 命令大全

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar <command> [options]
```

### `init` — 初始化标准脚本包脚手架

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar init ./daily-reward \
  --id daily-reward \
  --name "每日签到" \
  --author MayIHaveK \
  --engine auto
```

自动生成以下完整工程结构（已离线内置 `types/mayjs.d.ts`）：

```text
daily-reward/
├── script.yml          # 标准脚本包清单
├── config.yml          # 默认配置模板
├── index.js            # 入口脚本模板（含 onLoad / onUnload / onDispose / commands）
├── lib/helper.js       # 内部模块示例
├── jsconfig.json       # VS Code 类型检查配置
└── types/mayjs.d.ts    # 官方 MayJS 3.0 类型声明（打包时自动忽略）
```

### `check` — 静态校验清单与语法平衡

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar check ./daily-reward
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar check ./single_script.js
```

校验 `script.yml` 必填项（`id`、`main`、`mode`）、入口文件存在性以及全部 `.js` 文件的括号/引号/注释闭合情况。

### `encrypt` — 单文件加密（`.mjs` v2 / v1）

```bash
# 默认生成 v2 (AES-256-GCM 认证加密)
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar encrypt ./hello.js -o ./hello.mjs

# 如需兼容 MayJS 2.x 旧服务端，可加 --legacy-v1 生成 v1 (AES-256-CBC)
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar encrypt ./hello.js -o ./hello.mjs --legacy-v1
```

### `pack` — 打包加密脚本包（`.mjsb`）

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar pack ./daily-reward \
  -o ./dist/daily-reward.mjsb \
  --bind-qq 2534226689 \
  --expire 2027-12-31
```

- 自动过滤 `.git/`、`node_modules/`、`types/`、`jsconfig.json`、`tsconfig.json`、`*.d.ts`、`*.mjsb` 等开发期文件。
- `--bind-qq` 与 `--expire`（支持 `yyyy-MM-dd` 或 UTC 毫秒时间戳）均为可选参数；省略表示不限制 QQ / 永久有效。

### `inspect` — 检视 `.mjsb` 元数据与完整性

```bash
# 仅查看头部元数据（不解密主体）
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar inspect ./dist/daily-reward.mjsb

# 同时校验 AES-256-GCM + AAD 签名并列出内部全部文件
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar inspect ./dist/daily-reward.mjsb --verify
```

### `compile` — 预编译 ES6+ 为 Nashorn ES5

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar compile ./src/modern.js -o ./dist/modern.es5.js
```

> 若目标服务端运行 `MayJS-GraalJS`，可跳过 `compile` 直接发布 ES2023+ 源码或 `.mjsb`。

---

## 2. VS Code 智能补全配置

如果你不是用 `mayjs-cli init` 创建的项目，只需从仓库复制 [`types/mayjs.d.ts`](https://github.com/MayIHaveK/MayJS/blob/master/types/mayjs.d.ts) 到项目目录，并放置 `jsconfig.json`：

```json
{
  "compilerOptions": {
    "checkJs": true,
    "target": "ES2022"
  },
  "include": ["**/*.js", "types/mayjs.d.ts"]
}
```

用 VS Code 打开目录后，输入 `server.`、`events.`、`commands.`、`scheduler.`、`storage.`、`bundle.`、`onDispose(` 即可获得完整类型提示与参数文档。
