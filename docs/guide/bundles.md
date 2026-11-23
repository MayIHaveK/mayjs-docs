# 脚本包 (Script Bundle) 与 `.mjsb` 加密分发

MayJS 3.0 引入工程化的 **Script Bundle** 体系，让你像写独立插件一样组织多文件脚本项目，并支持一键打包为防篡改、带可选授权头的 `.mjsb` 加密归档。

## 1. 目录脚本包结构（开发期）

在 `plugins/MayJS/scripts/` 下新建文件夹并放置 `script.yml` 即成为一个脚本包：

```text
plugins/MayJS/scripts/daily-reward/
├── script.yml          # 脚本包清单（必填）
├── config.yml          # 默认配置模板（首次加载自动释放到 plugins/MayJS/bundles/daily-reward/config.yml）
├── index.js            # 入口脚本
└── lib/
    └── reward.js       # 包内私有模块（通过 require('./lib/reward') 加载）
```

### `script.yml` 清单字段

```yaml
id: daily-reward                # 唯一标识（仅允许字母、数字、._-）
name: 每日签到系统               # 展示名称
version: 1.0.0                  # 版本号
author: MayIHaveK               # 作者
main: index.js                  # 入口文件相对路径（默认 index.js）
mode: service                   # service（常驻服务，默认）或 script
engine: auto                    # auto | nashorn | graaljs
depend: []                      # 必需 Bukkit 插件（缺失则拒绝加载）
softdepend:
  - PlaceholderAPI
storage-namespace: daily_reward # bundle.storage 命名空间前缀（默认等于 id）
```

## 2. 脚本包运行期特性

- **自动注入 `bundle` 全局上下文**：包含 `bundle.id`、`bundle.name`、`bundle.version`、`bundle.dataFolder`、`bundle.config`、`bundle.storage`（自动带 `bundle:<namespace>:` 命名空间隔离）、`bundle.logger`，以及 `bundle.saveConfig()` / `bundle.reloadConfig()`。详情见 [bundle API 参考](/api/bundle)。
- **包内相对模块加载**：支持 `require('./lib/reward')` 与 `require('../shared')`，严格限定在当前脚本包内防止路径穿越；非相对路径（如 `require('libs/common')`）自动回退到全局 `scripts/libs/`。
- **词法作用域隔离**：在 GraalJS 单 Context 下，多个脚本包的 `bundle` 与 `require` 通过 IIFE 参数永久捕获，事件/命令/定时任务回调永不串包。
- **与散脚本目录隔离**：`ScriptPathIndex` 与预热扫描会自动跳过含 `script.yml` 的目录，避免普通命令误执行包内私有脚本。
- **热重载支持**：修改目录内任意 `.js` / `script.yml` / `config.yml`，或替换 `.mjsb` 文件，文件监听器会自动安全卸载旧版本并重新加载。

## 3. `.mjsb` 加密归档与 AAD 授权头

适合商业脚本或闭源模块分发，具备以下安全特性：

1. **AES-256-GCM 认证加密**：加密整个 ZIP 载荷。
2. **AAD 头部防篡改**：头部 `META_JSON`（包含 `id`、`version`、`boundQq`、`expireAt` 等）全部参与 GCM 认证。即使有人用十六进制编辑器修改了绑定 QQ 或过期时间，服务端加载时也会立即因 `Tag mismatch!` 拒绝。
3. **纯内存解包永不落盘**：运行期直接在内存中解密和读取入口脚本与 `./lib/*.js`，硬盘上永远不会出现明文脚本；只有默认 `config.yml` 会释放到 `plugins/MayJS/bundles/<id>/config.yml` 供服主编辑。
4. **同名优先级**：若 `scripts/` 中同时存在同 `id` 的 `.mjsb` 与目录包，优先加载 `.mjsb`。

### 打包方式 A：使用 `mayjs-cli`（推荐，本地开发机）

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar pack ./daily-reward \
  -o daily-reward.mjsb \
  --bind-qq 2534226689 \
  --expire 2027-12-31
```

### 打包方式 B：服内直接打包

```text
/mayjs bundle pack daily-reward --bind-qq 2534226689 --expire 2027-12-31
```

## 4. `/mayjs bundle` 运维子命令

```text
/mayjs bundle list                     # 列出全部已加载脚本包
/mayjs bundle info <bundleId>          # 查看脚本包元数据、授权头与追踪资源
/mayjs bundle load <目录或.mjsb>        # 手动加载脚本包
/mayjs bundle reload <bundleId>        # 热重载脚本包（自动释放旧资源）
/mayjs bundle unload <bundleId>        # 卸载脚本包
/mayjs bundle pack <目录> [选项...]     # 将目录脚本包打包加密为 .mjsb
```
