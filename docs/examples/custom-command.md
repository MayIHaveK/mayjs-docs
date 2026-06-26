# 自定义命令

注册带 Tab 补全的自定义命令。

## 飞行切换命令

`scripts/fly-command.js`:

```javascript
//@service

function onLoad() {
    commands.register("fly", function(sender, cmd, label, args) {
        var Player = Java.type("org.bukkit.entity.Player");
        if (!(sender instanceof Player)) {
            sender.sendMessage("§c仅玩家可用");
            return true;
        }

        sender.setAllowFlight(!sender.getAllowFlight());
        sender.setFlying(sender.getAllowFlight());
        sender.sendMessage(sender.getAllowFlight() ? "§a飞行已开启" : "§c飞行已关闭");
        return true;
    });

    print("[fly] 飞行命令已注册");
}
```

## 带 Tab 补全的传送命令

`scripts/tp-command.js`:

```javascript
//@service

function onLoad() {
    commands.register("tpto",
        function(sender, cmd, label, args) {
            var Player = Java.type("org.bukkit.entity.Player");
            if (!(sender instanceof Player)) {
                sender.sendMessage("§c仅玩家可用");
                return true;
            }
            if (args.length == 0) {
                sender.sendMessage("§c用法: /tpto <玩家名>");
                return true;
            }

            var target = org.bukkit.Bukkit.getPlayer(args[0]);
            if (target == null || !target.isOnline()) {
                sender.sendMessage("§c玩家 " + args[0] + " 不在线");
                return true;
            }

            sender.teleport(target.getLocation());
            sender.sendMessage("§a已传送到 §f" + target.getName());
            return true;
        },
        function(sender, cmd, alias, args) {
            if (args.length == 1) {
                var names = [];
                var it = org.bukkit.Bukkit.getOnlinePlayers().iterator();
                while (it.hasNext()) {
                    var name = it.next().getName();
                    // 过滤：输入前缀匹配
                    if (name.toLowerCase().indexOf(args[0].toLowerCase()) == 0) {
                        names.push(name);
                    }
                }
                return names;
            }
            return [];
        }
    );

    print("[tpto] 传送命令已注册");
}
```

## 要点

- 命令执行回调返回 `true` 表示命令处理完毕
- Tab 补全回调返回一个字符串数组
- 建议在补全中做前缀过滤，提升用户体验
- `instanceof Player` 判断避免控制台执行报错
