# scheduler — 任务调度

## 主线程立即执行

```javascript
scheduler.run(function() {
    print("立即在主线程执行");
});
```

## 延迟执行

```javascript
// 延迟 20 tick（1 秒）后执行
scheduler.later(function() {
    sender.sendMessage("§a1秒后的消息");
}, 20);
```

## 重复执行

```javascript
// 每 20 tick（1 秒）执行一次
scheduler.repeat(function() {
    print("每秒执行");
}, 20);

// 指定首次延迟：40 tick 后开始，之后每 20 tick 执行
scheduler.repeat(function() {
    print("延迟2秒后开始，每秒执行");
}, 40, 20);
```

## 链式任务

适合需要按步骤顺序执行的场景：

```javascript
scheduler.chain()
    .sync(function() { sender.sendMessage("§e3..."); })
    .delay(20)
    .sync(function() { sender.sendMessage("§e2..."); })
    .delay(20)
    .sync(function() { sender.sendMessage("§e1..."); })
    .delay(20)
    .sync(function() { sender.sendMessage("§aGo!"); })
    .execute();
```

### 链式 API

| 方法 | 说明 |
|------|------|
| `.sync(fn)` | 在主线程执行函数 |
| `.delay(ticks)` | 等待指定 tick 数 |
| `.execute()` | 开始执行链 |

## tick 与时间对照

| tick | 时间 |
|------|------|
| 1 | 50ms |
| 20 | 1 秒 |
| 100 | 5 秒 |
| 1200 | 1 分钟 |
| 6000 | 5 分钟 |
| 72000 | 1 小时 |

## 自动清理

所有通过 `scheduler` 创建的任务都会自动追踪到当前脚本上下文。

脚本卸载/重载时，所有关联的定时任务**自动取消**，不会产生"幽灵任务"。

## 使用场景

### 倒计时

```javascript
function main() {
    var count = [5]; // 用数组包装实现闭包修改

    var task = scheduler.repeat(function() {
        if (count[0] <= 0) {
            sender.sendMessage("§a时间到！");
            return;
        }
        sender.sendMessage("§e倒计时: " + count[0]);
        count[0]--;
    }, 20);
}
```

### 延迟初始化

```javascript
//@service

function onLoad() {
    // 等其他插件加载完毕后再初始化
    scheduler.later(function() {
        print("[my-service] 延迟初始化完成");
    }, 100); // 5秒后
}
```

### 定期清理

```javascript
//@service

function onLoad() {
    scheduler.repeat(function() {
        // 每5分钟执行清理逻辑
        storage.clear();
        print("[cleanup] 内存缓存已清理");
    }, 6000);
}
```
