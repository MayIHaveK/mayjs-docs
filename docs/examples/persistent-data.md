# 持久化数据

使用 SQLite 持久化存储，数据在服务器重启后保留。

## 登录次数统计

`scripts/login-counter.js`:

```javascript
function main() {
    var db = storage.getPersist();

    var count = db.player(sender).get("login_count", 0);
    count = count + 1;
    db.player(sender).set("login_count", count);

    sender.sendMessage("§a你是第 §f" + count + " §a次使用此命令");
}
```

## 服务脚本：自动记录登录

`scripts/login-tracker.js`:

```javascript
//@service

function onLoad() {
    var db = storage.getPersist();

    events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {
        var player = e.getPlayer();
        var count = db.player(player).get("logins", 0);
        count = count + 1;
        db.player(player).set("logins", count);

        // 记录最后登录时间
        db.player(player).set("last_login", java.lang.System.currentTimeMillis());

        player.sendMessage("§7这是你第 §f" + count + " §7次登录");
    });

    print("[login-tracker] 登录追踪已启动");
}
```

## 简易经济系统

`scripts/economy.js`:

```javascript
//@service

function onLoad() {
    var db = storage.getPersist();

    commands.register("money",
        function(sender, cmd, label, args) {
            var Player = Java.type("org.bukkit.entity.Player");
            if (!(sender instanceof Player)) {
                sender.sendMessage("§c仅玩家可用");
                return true;
            }

            if (args.length == 0 || args[0] == "check") {
                var balance = db.player(sender).get("balance", 0);
                sender.sendMessage("§e余额: §f" + balance + " §6金币");
                return true;
            }

            if (args[0] == "pay" && args.length >= 3) {
                var target = org.bukkit.Bukkit.getPlayer(args[1]);
                var amount = parseInt(args[2]);

                if (target == null) {
                    sender.sendMessage("§c玩家不在线");
                    return true;
                }
                if (isNaN(amount) || amount <= 0) {
                    sender.sendMessage("§c金额无效");
                    return true;
                }

                var balance = db.player(sender).get("balance", 0);
                if (balance < amount) {
                    sender.sendMessage("§c余额不足");
                    return true;
                }

                // 转账
                db.player(sender).set("balance", balance - amount);
                var targetBalance = db.player(target).get("balance", 0);
                db.player(target).set("balance", targetBalance + amount);

                sender.sendMessage("§a已转账 §f" + amount + " §a金币给 §f" + target.getName());
                target.sendMessage("§a收到 §f" + sender.getName() + " §a转来的 §f" + amount + " §a金币");
                return true;
            }

            sender.sendMessage("§c用法: /money [check] | /money pay <玩家> <金额>");
            return true;
        },
        function(sender, cmd, alias, args) {
            if (args.length == 1) return ["check", "pay"];
            if (args.length == 2 && args[0] == "pay") {
                var names = [];
                var it = org.bukkit.Bukkit.getOnlinePlayers().iterator();
                while (it.hasNext()) names.push(it.next().getName());
                return names;
            }
            return [];
        }
    );

    print("[economy] 简易经济系统已注册 /money 命令");
}
```

## 带过期时间

```javascript
var db = storage.getPersist();

// 1小时后自动删除
db.set("temp_event", { name: "双倍经验", multiplier: 2 }, 3600);

// 检查是否仍然有效
var event = db.get("temp_event");
if (event != null) {
    print("活动进行中: " + event.name);
} else {
    print("活动已结束");
}
```

## 要点

- `storage.getPersist()` 获取持久化存储实例
- 数据以 JSON 格式存储在 SQLite 中
- 支持对象、数组等复杂数据类型
- `.player(sender)` 或 `.player("玩家名")` 切换到玩家维度
- 可选 TTL 参数（秒），到期后 `get()` 返回 null
