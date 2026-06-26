# 自定义事件

使用 `ScriptCustomEvent` 实现脚本间松耦合通信。

## 概念

- **脚本 A** 触发一个命名事件，附带数据
- **脚本 B** 监听该事件，执行响应逻辑
- 事件可以被取消（类似 Bukkit Cancellable）

两个脚本不需要互相知道对方的存在。

## 触发事件

`scripts/reward-giver.js`:

```javascript
function main() {
    var event = events.callEvent("player.reward", {
        player: sender.getName(),
        amount: 100,
        reason: "每日签到"
    });

    if (event.isCancelled()) {
        sender.sendMessage("§c奖励被拦截（可能已签到过）");
    } else {
        sender.sendMessage("§a获得 100 金币！");
    }
}
```

## 监听事件

`scripts/reward-listener.js`:

```javascript
//@service

function onLoad() {
    events.listen("com.mayihavek.mayjs.bridge.event.ScriptCustomEvent", function(e) {
        if (e.getEventName() == "player.reward") {
            var data = e.getData();
            print("[奖励系统] " + data.player + " 获得 " + data.amount + " 金币，原因: " + data.reason);

            // 可以修改数据
            // data.amount = data.amount * 2;

            // 可以取消事件
            // e.setCancelled(true);
        }
    });

    print("[reward-listener] 奖励监听已注册");
}
```

## 防重复领取

```javascript
//@service

function onLoad() {
    events.listen("com.mayihavek.mayjs.bridge.event.ScriptCustomEvent", function(e) {
        if (e.getEventName() == "player.reward") {
            var data = e.getData();
            var key = "last_reward_" + data.player;
            var lastTime = storage.get(key, 0);
            var now = java.lang.System.currentTimeMillis();

            // 24小时内不能重复领取
            if (now - lastTime < 86400000) {
                e.setCancelled(true);
                print("[anti-dup] " + data.player + " 重复领取被拦截");
                return;
            }

            storage.set(key, now);
        }
    });
}
```

## ScriptCustomEvent API

| 方法 | 返回类型 | 说明 |
|------|---------|------|
| `getEventName()` | String | 事件名称 |
| `getData()` | Object | 事件数据（JS 对象） |
| `isCancelled()` | boolean | 是否已被取消 |
| `setCancelled(boolean)` | void | 设置取消状态 |

## 使用场景

- **经济系统**: 金币变动事件，让其他脚本做日志/限制
- **权限检查**: 操作前触发事件，让权限脚本决定是否放行
- **跨脚本数据传递**: A 脚本计算结果 → 触发事件 → B 脚本消费
- **插件式架构**: 核心脚本触发扩展点事件，其他脚本作为插件监听
