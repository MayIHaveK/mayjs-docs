# commands — 动态命令

## 注册命令

最简写法：

```javascript
commands.register("hello", function(sender, command, label, args) {
    sender.sendMessage("§aHello, " + sender.getName() + "!");
    return true;
});
```

注册后即可在游戏中使用 `/hello`。

## 带 Tab 补全

```javascript
commands.register("greet",
    // 执行函数
    function(sender, command, label, args) {
        if (args.length == 0) {
            sender.sendMessage("§c用法: /greet <玩家名>");
            return true;
        }
        sender.sendMessage("§a你好, " + args[0] + "!");
        return true;
    },
    // Tab 补全函数
    function(sender, command, alias, args) {
        if (args.length == 1) {
            var names = [];
            var players = org.bukkit.Bukkit.getOnlinePlayers().iterator();
            while (players.hasNext()) {
                names.push(players.next().getName());
            }
            return names;
        }
        return [];
    }
);
```

## 卸载命令

```javascript
commands.unregister("hello");
```

::: tip
服务脚本中注册的命令在脚本重载时会**自动卸载**，通常不需要手动调用 `unregister()`。
:::

## 以控制台身份执行命令

```javascript
// 控制台身份
commands.dispatch("say 全服公告");

// 以指定玩家身份
commands.dispatch(sender, "spawn");
```

## 回调参数说明

| 参数 | 类型 | 说明 |
|------|------|------|
| `sender` | CommandSender | 命令执行者 |
| `command` | Command | Bukkit Command 对象 |
| `label` | String | 使用的命令别名 |
| `args` | String[] | 命令参数数组 |

::: warning 注意
动态注册的命令不会出现在 `/help` 列表中，但 Tab 补全正常工作。这是 Bukkit 动态命令的已知限制。
:::

## 完整示例

```javascript
//@service

function onLoad() {
    commands.register("tpa",
        function(sender, cmd, label, args) {
            var Player = Java.type("org.bukkit.entity.Player");
            if (!(sender instanceof Player)) {
                sender.sendMessage("§c仅玩家可用");
                return true;
            }
            if (args.length == 0) {
                sender.sendMessage("§c用法: /tpa <玩家名>");
                return true;
            }

            var target = org.bukkit.Bukkit.getPlayer(args[0]);
            if (target == null) {
                sender.sendMessage("§c玩家不在线");
                return true;
            }

            target.sendMessage("§e" + sender.getName() + " §a请求传送到你身边");
            sender.sendMessage("§a请求已发送给 §e" + target.getName());
            return true;
        },
        function(sender, cmd, alias, args) {
            if (args.length == 1) {
                var names = [];
                var it = org.bukkit.Bukkit.getOnlinePlayers().iterator();
                while (it.hasNext()) names.push(it.next().getName());
                return names;
            }
            return [];
        }
    );

    print("[tpa] 命令已注册");
}
```
