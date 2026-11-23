# storage — 数据存储

MayJS 提供两套存储：**内存存储**（重启清空）和**持久化存储**（SQLite，跨重启）。

::: tip 3.0 脚本包命名空间隔离
在 [脚本包（Bundle）](../guide/bundles) 中开发时，优先使用 [`bundle.storage`](./bundle#bundle-storage)，它会自动为所有键加上 `bundle:<id>:` 前缀，彻底避免与其他脚本或脚本包键名冲突。
:::

## 内存存储

### 全局存储

```javascript
// 设置值
storage.set("key", "value");

// 设置值 + TTL（秒）
storage.set("key", "value", 60);  // 60秒后过期

// 获取值
var val = storage.get("key");

// 获取值（带默认值）
var val = storage.get("key", "默认值");

// 检查是否存在
storage.has("key");  // true / false

// 删除
storage.remove("key");

// 清空全局存储
storage.clear();
```

### 玩家维度存储

每个玩家独立的存储空间：

```javascript
// 通过 CommandSender/Player 对象
storage.player(sender).set("score", 100);
storage.player(sender).get("score");
storage.player(sender).get("score", 0);  // 带默认值
storage.player(sender).has("score");
storage.player(sender).remove("score");
storage.player(sender).clear();

// 通过玩家名
storage.player("Steve").set("key", "value");
storage.player("Steve").get("key");
```

### TTL 过期

```javascript
// 全局：30秒后自动删除
storage.set("temp_data", "some value", 30);

// 玩家维度：5分钟后过期
storage.player(sender).set("buff", "active", 300);
```

过期后 `get()` 返回 null（或默认值），`has()` 返回 false。

## 持久化存储

数据保存在 SQLite 数据库中，服务器重启后依然存在。SQLite JDBC 是可选运行时模块；
若服务端环境没有提供 `org.sqlite.JDBC`，MayJS 会保留全部内存存储功能并跳过持久化模块，
不会因此阻止插件启动。

```javascript
if (storage.isPersistentAvailable()) {
    var db = storage.getPersist();
}
```

SQLite 不可用时直接调用 `getPersist()` 会抛出带安装提示的异常。

### 全局持久化

```javascript
db.set("key", "value");
db.set("key", "value", 3600);  // 1小时后过期
var val = db.get("key");
var val = db.get("key", "默认值");
db.has("key");
db.remove("key");
```

### 玩家维度持久化

```javascript
db.player(sender).set("coins", 500);
db.player(sender).get("coins");
db.player(sender).get("coins", 0);
db.player(sender).has("coins");
db.player(sender).remove("coins");
```

### 异步持久化

持久化存储提供与同步 API 对应的异步方法，数据库操作会在 MayJS 专用的单线程执行器中有序执行：

```javascript
db.setAsync("key", "value");
db.setAsync("key", "value", 3600);
var valueFuture = db.getAsync("key");
db.hasAsync("key");
db.removeAsync("key");
db.clearAsync();

var playerDb = db.player(sender);
var coinsFuture = playerDb.getAsync("coins", 0);

storage.whenCompleteInScript(coinsFuture, function (coins, error) {
    if (error != null) {
        print("读取失败: " + error.getMessage());
        return;
    }
    print("coins=" + coins);
});
```

这些方法返回 `CompletableFuture`。脚本侧不要通过 `then*` 直接执行 JS，应使用
`storage.whenCompleteInScript(future, callback)` 回到所属脚本执行域。回调仍可能位于数据库
工作线程；需要操作世界、实体或玩家状态时，还应通过调度器切回 Bukkit 主线程。

## 存储什么数据类型？

支持存储以下类型（底层 JSON 序列化）：

- 字符串: `"hello"`
- 数字: `42`, `3.14`
- 布尔: `true`, `false`
- 对象: `{ key: "value" }`
- 数组: `[1, 2, 3]`
- null

```javascript
storage.set("config", { level: 5, name: "test" });
var obj = storage.get("config");
print(obj.level);  // 5
```

## 使用建议

| 场景 | 推荐方案 |
|------|---------|
| 临时计数、冷却检测 | 内存存储 + TTL |
| 会话数据、在线状态 | 内存存储（玩家维度） |
| 金币、积分、永久属性 | 持久化存储（玩家维度） |
| 全局配置缓存 | 持久化存储（全局） |
| 大量数据、复杂查询 | 考虑直接用 JDBC 连接外部数据库 |
