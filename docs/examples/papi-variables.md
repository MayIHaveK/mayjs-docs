# PAPI 变量

注册自定义 PlaceholderAPI 变量，可在记分板、Tab 列表、聊天格式等处使用。

## 基础注册

`scripts/my-placeholders.js`:

```javascript
//@service

function onLoad() {
    papi.register("myserver", function(player, params) {
        switch (params.toLowerCase()) {
            case "online":
                return String(server.getOnlinePlayers().size());

            case "time":
                return new java.text.SimpleDateFormat("HH:mm:ss")
                    .format(new java.util.Date());

            case "date":
                return new java.text.SimpleDateFormat("yyyy-MM-dd")
                    .format(new java.util.Date());

            case "tps":
                try {
                    var tps = org.bukkit.Bukkit.getServer().getClass()
                        .getMethod("getTPS").invoke(org.bukkit.Bukkit.getServer());
                    return String(Math.round(tps[0] * 100) / 100);
                } catch (e) {
                    return "N/A";
                }

            default:
                return "";
        }
    });

    print("[papi] 已注册: %myserver_online%, %myserver_time%, %myserver_date%, %myserver_tps%");
}
```

注册后可用：
- `%myserver_online%` → `12`
- `%myserver_time%` → `14:30:05`
- `%myserver_date%` → `2024-01-15`
- `%myserver_tps%` → `19.98`

## 玩家统计变量

```javascript
//@service

function onLoad() {
    papi.register("stats", function(player, params) {
        if (player == null) return "";

        var db = storage.getPersist();

        switch (params.toLowerCase()) {
            case "kills":
                return String(db.player(player).get("kills", 0));

            case "deaths":
                return String(db.player(player).get("deaths", 0));

            case "kd":
                var kills = db.player(player).get("kills", 0);
                var deaths = db.player(player).get("deaths", 1);
                return String(Math.round(kills / deaths * 100) / 100);

            case "playtime":
                var ticks = player.getStatistic(
                    Java.type("org.bukkit.Statistic").PLAY_ONE_MINUTE
                );
                var hours = Math.floor(ticks / 72000);
                return hours + "h";

            default:
                return "";
        }
    });

    print("[stats-papi] 已注册统计变量");
}
```

可用变量：
- `%stats_kills%` → `42`
- `%stats_deaths%` → `7`
- `%stats_kd%` → `6`
- `%stats_playtime%` → `128h`

## 配合击杀统计

完整示例：同时记录数据 + 注册变量：

```javascript
//@service

function onLoad() {
    var db = storage.getPersist();

    // 监听击杀事件
    events.listen("org.bukkit.event.entity.PlayerDeathEvent", function(e) {
        var victim = e.getEntity();
        var killer = victim.getKiller();

        // 记录死亡
        var deaths = db.player(victim).get("deaths", 0);
        db.player(victim).set("deaths", deaths + 1);

        // 记录击杀
        if (killer != null) {
            var kills = db.player(killer).get("kills", 0);
            db.player(killer).set("kills", kills + 1);
        }
    });

    // 注册 PAPI 变量
    papi.register("kd", function(player, params) {
        if (player == null) return "";
        if (params == "kills") return String(db.player(player).get("kills", 0));
        if (params == "deaths") return String(db.player(player).get("deaths", 0));
        return "";
    });

    print("[kd-tracker] 击杀统计 + PAPI 已启动");
}
```
