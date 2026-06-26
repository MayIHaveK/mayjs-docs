# API 总览

脚本中可直接使用以下全局变量，无需 import 或 require。

## 全局变量

| 变量 | 类型 | 说明 |
|------|------|------|
| [`server`](/api/overview#server) | PlayerService | 玩家查询、广播、消息 |
| [`events`](/api/events) | EventService | 事件监听、自定义事件 |
| [`commands`](/api/commands) | CommandService | 动态命令注册/卸载 |
| [`scheduler`](/api/scheduler) | SchedulerService | 定时任务、延迟任务 |
| [`storage`](/api/storage) | StorageService | 内存/持久化存储 |
| [`papi`](/api/papi) | PapiService | PlaceholderAPI 集成 |
| [`reflect`](/api/reflect) | ReflectionService | 反射、类导入、动态代理 |
| [`require`](/api/modules) | Function | CommonJS 模块加载 |
| `sender` | CommandSender | 当前命令发送者 |
| `args` | List&lt;String&gt; | 脚本参数列表 |
| `print` | Function | 控制台日志输出 |

## sender

执行脚本的命令发送者。可能是玩家（Player）或控制台（ConsoleCommandSender）。

```javascript
// 判断是否为玩家
var Player = Java.type("org.bukkit.entity.Player");
if (sender instanceof Player) {
    sender.sendMessage("§a你是玩家: " + sender.getName());
} else {
    print("从控制台执行");
}
```

## args

脚本参数列表。`/mayjs run test hello world` → `args[0]="hello"`, `args[1]="world"`。

```javascript
function main() {
    if (args.size() == 0) {
        sender.sendMessage("§c用法: /mayjs run test <参数>");
        return;
    }
    sender.sendMessage("§a第一个参数: " + args[0]);
    sender.sendMessage("§a参数数量: " + args.size());
}
```

## print

输出到服务器控制台（不是发给玩家）：

```javascript
print("调试信息");
print("在线人数: " + server.getOnlinePlayers().size());
```

## server {#server}

玩家查询和服务器操作：

```javascript
// 获取在线玩家
var player = server.getPlayer("玩家名");

// 获取所有在线玩家
var players = server.getOnlinePlayers();

// 全服广播
server.broadcast("§a全服公告");

// 给指定玩家发消息
server.sendMessage("玩家名", "§e你好");
server.sendMessage(player, "§e你好");

// 虚拟 OP（临时权限提升）
server.runAsVirtualOp(player, function(opProxy) {
    // opProxy 拥有 OP 权限
    return null;
});
```

## Java.type

Nashorn 原生的类导入方式，可直接使用：

```javascript
var HashMap = Java.type("java.util.HashMap");
var map = new HashMap();

var Material = Java.type("org.bukkit.Material");
var item = new (Java.type("org.bukkit.inventory.ItemStack"))(Material.DIAMOND, 1);
```

::: tip
`Java.type` 加载的是 Bukkit/Spigot API 和 Java 标准库中的类。跨插件类加载需要使用 `reflect.importClass()`。
:::
