# events — 事件监听

## 快速监听

最简写法，自动生成名称，NORMAL 优先级：

```javascript
events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {
    e.getPlayer().sendMessage("§a欢迎！");
});
```

## 指定优先级

```javascript
events.listen("org.bukkit.event.player.PlayerJoinEvent", "HIGH", function(e) {
    // HIGH 优先级，比 NORMAL 先执行
});
```

可用优先级：`LOWEST` → `LOW` → `NORMAL` → `HIGH` → `HIGHEST` → `MONITOR`

## 指定名称（旧版兼容）

::: warning 3.0 废弃提示
`events.createListener(...)` 在 MayJS 3.0 中已标记 `@Deprecated`。由于 `events.listen(...)` 已默认由脚本上下文自动追踪并在卸载/重载时注销，新脚本推荐直接使用 `events.listen(...)`；如有自定义外部资源需要释放，可配合全局 [`onDispose(fn)`](./overview#全局函数)。
:::

```javascript
events.createListener("my_join_listener", "org.bukkit.event.player.PlayerJoinEvent", "NORMAL", function(e) {
    e.getPlayer().sendMessage("§a欢迎！");
});
```

## 事件类名

必须使用**全限定类名**（包含完整包路径）：

```javascript
// ✅ 正确
events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {});

// ❌ 错误 — 不支持短名称
events.listen("PlayerJoinEvent", function(e) {});
```

常用事件类：

| 事件 | 全限定名 |
|------|---------|
| 玩家加入 | `org.bukkit.event.player.PlayerJoinEvent` |
| 玩家退出 | `org.bukkit.event.player.PlayerQuitEvent` |
| 玩家聊天 | `org.bukkit.event.player.AsyncPlayerChatEvent` |
| 方块破坏 | `org.bukkit.event.block.BlockBreakEvent` |
| 方块放置 | `org.bukkit.event.block.BlockPlaceEvent` |
| 玩家交互 | `org.bukkit.event.player.PlayerInteractEvent` |
| 实体伤害 | `org.bukkit.event.entity.EntityDamageByEntityEvent` |
| 玩家死亡 | `org.bukkit.event.entity.PlayerDeathEvent` |
| 物品丢弃 | `org.bukkit.event.player.PlayerDropItemEvent` |
| 玩家移动 | `org.bukkit.event.player.PlayerMoveEvent` |

## 自定义事件

MayJS 提供 `ScriptCustomEvent` 用于脚本间通信：

### 触发事件

```javascript
var event = events.callEvent("my.event.name", {
    player: sender.getName(),
    amount: 100,
    reason: "奖励"
});

if (event.isCancelled()) {
    sender.sendMessage("§c操作被拦截");
}
```

### 监听自定义事件

```javascript
events.listen("com.mayihavek.mayjs.bridge.event.ScriptCustomEvent", function(e) {
    if (e.getEventName() == "my.event.name") {
        var data = e.getData();
        print("收到事件: " + data.player + " 金额: " + data.amount);

        // 可以取消事件
        // e.setCancelled(true);
    }
});
```

### ScriptCustomEvent API

| 方法 | 返回类型 | 说明 |
|------|---------|------|
| `getEventName()` | String | 事件名称 |
| `getData()` | Object | 事件携带的数据对象 |
| `isCancelled()` | boolean | 是否已被取消 |
| `setCancelled(boolean)` | void | 设置取消状态 |

## 取消事件

对 Bukkit 可取消事件调用 `setCancelled(true)`：

```javascript
events.listen("org.bukkit.event.player.PlayerDropItemEvent", function(e) {
    e.setCancelled(true);
    e.getPlayer().sendMessage("§c禁止丢弃物品！");
});
```

## 资源清理

在服务脚本的 `onLoad()` 中注册的监听器，脚本重载时会**自动注销**。无需在 `onUnload()` 中手动清理。
