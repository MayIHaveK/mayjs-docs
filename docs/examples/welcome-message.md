# 欢迎消息

监听玩家加入和退出事件，发送自定义提示。

## 脚本

`scripts/welcome.js`:

```javascript
//@service

function onLoad() {
    events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {
        var player = e.getPlayer();
        player.sendMessage("§a欢迎回来, §f" + player.getName() + "§a!");
        server.broadcast("§7[+] §f" + player.getName() + " §7加入了服务器");
    });

    events.listen("org.bukkit.event.player.PlayerQuitEvent", function(e) {
        server.broadcast("§7[-] §f" + e.getPlayer().getName() + " §7离开了服务器");
    });

    print("[welcome] 欢迎消息服务已启动");
}

function onUnload() {
    print("[welcome] 欢迎消息服务已停止");
}
```

## 要点

- `//@service` 声明为服务脚本，开服自动加载
- 两个监听器在 `onLoad()` 中注册，重载时自动清理
- `server.broadcast()` 向全服发送消息
- `e.getPlayer()` 获取事件关联的玩家对象

## 进阶：首次加入判断

```javascript
//@service

function onLoad() {
    events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {
        var player = e.getPlayer();

        if (!player.hasPlayedBefore()) {
            // 新玩家
            server.broadcast("§6[新人] §f" + player.getName() + " §6第一次来到服务器！");
            player.sendMessage("§a欢迎新玩家！输入 /help 查看帮助");
        } else {
            // 老玩家
            player.sendMessage("§a欢迎回来, §f" + player.getName());
        }
    });
}
```
