# 定时公告

每隔固定时间向全服广播消息，支持多条轮播。

## 脚本

`scripts/announcer.js`:

```javascript
//@service

var messages = [
    "§a欢迎来到服务器！输入 /help 查看帮助",
    "§b加入 QQ 群 123456789 获取最新资讯",
    "§e商城已开放，输入 /shop 浏览商品",
    "§d遇到问题？输入 /report 提交反馈"
];

var index = 0;

function onLoad() {
    // 每 5 分钟广播一次（6000 tick）
    scheduler.repeat(function() {
        server.broadcast("§6[公告] §r" + messages[index]);
        index = (index + 1) % messages.length;
    }, 6000);

    print("[announcer] 定时公告已启动，共 " + messages.length + " 条");
}
```

## 带标题的公告

使用 Title API 实现大字显示：

```javascript
//@service

function onLoad() {
    scheduler.repeat(function() {
        var players = server.getOnlinePlayers().iterator();
        while (players.hasNext()) {
            var player = players.next();
            player.sendTitle("§6服务器公告", "§e双倍经验活动进行中！", 10, 60, 10);
        }
    }, 12000); // 每 10 分钟

    print("[title-announce] Title 公告已启动");
}
```

## 从配置读取公告

结合持久化存储动态管理公告内容：

```javascript
//@service

var announcements = [];
var index = 0;

function onLoad() {
    // 从持久化存储加载公告列表
    var db = storage.getPersist();
    var saved = db.get("announcements");
    if (saved != null && saved.length > 0) {
        announcements = saved;
    } else {
        announcements = ["§a默认公告: 欢迎来到服务器！"];
    }

    scheduler.repeat(function() {
        if (announcements.length == 0) return;
        server.broadcast("§6[公告] §r" + announcements[index]);
        index = (index + 1) % announcements.length;
    }, 6000);

    // 注册管理命令
    commands.register("announce",
        function(sender, cmd, label, args) {
            if (args.length == 0) {
                sender.sendMessage("§c用法: /announce add <内容> | /announce list | /announce clear");
                return true;
            }

            if (args[0] == "add" && args.length > 1) {
                var msg = Java.type("java.util.Arrays").copyOfRange(args, 1, args.length);
                var text = Java.type("java.lang.String").join(" ", msg);
                announcements.push(text);
                db.set("announcements", announcements);
                sender.sendMessage("§a已添加公告: " + text);
            } else if (args[0] == "list") {
                sender.sendMessage("§e=== 公告列表 ===");
                for (var i = 0; i < announcements.length; i++) {
                    sender.sendMessage("§7" + (i + 1) + ". §r" + announcements[i]);
                }
            } else if (args[0] == "clear") {
                announcements = [];
                db.set("announcements", announcements);
                sender.sendMessage("§a已清空所有公告");
            }
            return true;
        },
        function(sender, cmd, alias, args) {
            if (args.length == 1) return ["add", "list", "clear"];
            return [];
        }
    );

    print("[announcer] 已加载 " + announcements.length + " 条公告");
}
```
