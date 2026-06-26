# 快速开始

## 你的第一个脚本

在 `plugins/MayJS/scripts/` 下创建 `hello.js`：

```javascript
function main() {
    sender.sendMessage("§a你好，" + sender.getName() + "！");
    sender.sendMessage("§7参数: " + args);
    return "执行成功";
}
```

在游戏或控制台中输入：

```
/mayjs run hello
/mayjs run hello 参数1 参数2
```

::: tip 说明
- `sender` — 执行命令的玩家或控制台
- `args` — 参数列表（Java List）
- `main()` 的返回值会显示在控制台
- 脚本名不需要写 `.js` 后缀
:::

## 命令一览

| 命令 | 说明 |
|------|------|
| `/mayjs run <脚本名> [参数...]` | 执行脚本 |
| `/mayjs reload-script` | 重载全部脚本（服务脚本重新加载） |
| `/mayjs reload-script <脚本名>` | 重载指定脚本 |

脚本名支持子目录，如 `/mayjs run tools/backup`。

## 全局变量

脚本中可以直接使用以下变量，无需 import：

| 变量 | 说明 |
|------|------|
| `sender` | 命令发送者 |
| `args` | 参数列表 |
| `server` | 玩家/广播服务 |
| `events` | 事件监听 |
| `commands` | 动态命令注册 |
| `scheduler` | 任务调度 |
| `storage` | 数据存储 |
| `papi` | PlaceholderAPI |
| `reflect` | 反射工具 |
| `require` | 模块加载 |
| `print` | 控制台输出 |

完整 API 说明见 [API 参考](/api/overview)。

## 两种脚本类型

MayJS 有两种脚本类型，选择很简单：

- **普通脚本** — 一次性执行，用 `main()` 入口
- **服务脚本** — 长期驻留，用 `onLoad()`/`onUnload()` 管理生命周期

详细说明见 [脚本类型](./script-types)。

## 快速示例：服务脚本

创建 `plugins/MayJS/scripts/welcome.js`：

```javascript
//@service

function onLoad() {
    events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {
        e.getPlayer().sendMessage("§a欢迎回来！");
    });

    print("[welcome] 服务已启动");
}

function onUnload() {
    print("[welcome] 服务已停止");
}
```

这个脚本会：
1. 服务器启动 / 脚本重载时自动执行 `onLoad()`
2. 监听玩家加入事件，发送欢迎消息
3. 重载时自动清理旧监听器，再重新注册

## 下一步

- [配置文件](./config) — 了解完整配置项
- [脚本类型](./script-types) — 深入了解两种脚本模式
- [API 参考](/api/overview) — 查看所有可用接口
