# 脚本类型

MayJS 支持三种脚本模式，通过文件头部注释声明。

## 普通脚本（Script）

不声明任何模式注释，以 `main()` 为入口，适合一次性执行的逻辑。

```javascript
function main() {
    sender.sendMessage("§a执行完毕");
    return "ok";
}
```

**特点：**
- 通过 `/mayjs run <脚本名>` 手动触发
- 每次执行创建新的上下文
- 热重载时只更新编译缓存，不会自动执行

## 服务脚本（Service）

在文件**前 20 行**内声明 `//@service`，使用生命周期函数管理。

```javascript
//@service

function onLoad() {
    // 注册监听器、命令、定时任务等
    events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {
        e.getPlayer().sendMessage("§a欢迎！");
    });

    print("[my-service] 已启动");
}

function onUnload() {
    // 可选：退出日志、状态保存等收尾操作
    print("[my-service] 已停止");
}

function main() {
    // 可选：手动执行入口
    return "服务脚本正在运行";
}
```

**特点：**
- 加载时自动执行 `onLoad()`
- 文件变更时自动重载：先卸载旧实例，再加载新实例
- `onLoad()` 中注册的所有资源自动追踪，卸载时自动清理
- 可通过 `auto-run-list.yml` 配置开服自动加载

## 模块（Module）

在 `scripts/libs/` 目录下的文件，通过 `require()` 加载。

```javascript
// libs/utils.js
exports.formatMoney = function(amount) {
    return "§e" + amount + "§6 金币";
};

exports.isPlayer = function(sender) {
    var Player = Java.type("org.bukkit.entity.Player");
    return sender instanceof Player;
};
```

使用：
```javascript
function main() {
    var utils = require("libs/utils.js");
    sender.sendMessage(utils.formatMoney(1000));
}
```

**特点：**
- CommonJS 规范（`exports` / `module.exports`）
- 模块缓存：多次 `require` 同一文件不重复执行
- 模块间独立，不共享变量

## 生命周期函数

| 函数 | 调用时机 | 适用脚本类型 |
|------|---------|-------------|
| `main()` | `/mayjs run` 手动执行 | 普通脚本、服务脚本 |
| `onLoad()` | 脚本加载/重载时自动调用 | 服务脚本 |
| `onUnload()` | 脚本卸载/重载前自动调用 | 服务脚本 |

## 资源自动清理

在 `onLoad()` 中注册的资源，脚本卸载或重载时**自动注销**，无需手动管理：

- `events.listen()` — 事件监听器
- `commands.register()` — 动态命令
- `scheduler.repeat()` / `scheduler.later()` — 定时任务
- `papi.register()` — PAPI 变量

::: warning 注意
嵌套注册也能正确归属和清理（如事件回调里再注册监听器）。
:::

## 热重载行为

| 脚本类型 | 文件变更后的行为 |
|---------|----------------|
| 普通脚本 | 更新编译缓存，下次 `/mayjs run` 执行新版本 |
| 服务脚本 | 调用 `onUnload()` → 清理资源 → 重新加载 → 调用 `onLoad()` |
| 模块 | 清除模块缓存，下次 `require()` 加载新版本 |

## 最佳实践

- 长期驻留逻辑（监听器、命令、定时任务）→ 服务脚本
- 一次性工具逻辑 → 普通脚本
- 可复用的工具函数 → 模块（放在 `libs/` 下）
- **不要**在普通脚本的 `main()` 里注册长期资源，重载后不会自动恢复
- `onUnload()` 只做补充性收尾，主要资源清理由框架完成
