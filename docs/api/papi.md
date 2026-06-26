# papi — PlaceholderAPI

::: info 前置要求
需要安装 [PlaceholderAPI](https://www.spigotmc.org/resources/placeholderapi.6245/) 插件。
:::

## 解析变量

```javascript
// 带玩家上下文
var text = papi.parse(player, "%player_name% 等级 %player_level%");

// 无玩家上下文（服务器变量）
var text = papi.parse("%server_online%");
```

## 注册自定义变量

注册后可在任何支持 PAPI 的插件中使用 `%前缀_参数%` 格式。

```javascript
papi.register("myprefix", function(player, params) {
    if (params.equalsIgnoreCase("online")) {
        return String(server.getOnlinePlayers().size());
    }
    if (params.equalsIgnoreCase("time")) {
        return new java.text.SimpleDateFormat("HH:mm:ss").format(new java.util.Date());
    }
    if (params.equalsIgnoreCase("ping")) {
        if (player != null) {
            return String(player.getPing());
        }
        return "N/A";
    }
    return "";
});
```

注册后可用：
- `%myprefix_online%` → 在线人数
- `%myprefix_time%` → 当前时间
- `%myprefix_ping%` → 玩家延迟

## 回调参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `player` | OfflinePlayer | 请求变量的玩家（可能为 null） |
| `params` | String | 前缀后面的部分（如 `%myprefix_xxx%` 中的 `xxx`） |

返回值必须是 `String` 类型。返回空字符串表示无值。

## 最佳实践

建议在**服务脚本**的 `onLoad()` 中注册变量：

```javascript
//@service

function onLoad() {
    papi.register("mygame", function(player, params) {
        if (params.equalsIgnoreCase("kills")) {
            var kills = storage.getPersist().player(player).get("kills", 0);
            return String(kills);
        }
        if (params.equalsIgnoreCase("deaths")) {
            var deaths = storage.getPersist().player(player).get("deaths", 0);
            return String(deaths);
        }
        if (params.equalsIgnoreCase("kd")) {
            var kills = storage.getPersist().player(player).get("kills", 0);
            var deaths = storage.getPersist().player(player).get("deaths", 1);
            return String(Math.round(kills / deaths * 100) / 100);
        }
        return "";
    });

    print("[mygame] PAPI 变量已注册: kills, deaths, kd");
}
```

::: tip 自动清理
服务脚本重载时，已注册的 PAPI 变量会自动注销并重新注册。
:::
