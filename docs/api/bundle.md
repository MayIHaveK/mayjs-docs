# bundle 脚本包上下文

当代码运行在目录脚本包（含 `script.yml`）或 `.mjsb` 加密脚本包中时，MayJS 会自动将 `bundle` 对象注入入口脚本及包内所有 `require('./...')` 模块。

> 在散脚本中 `bundle` 为 `undefined`。

## 属性一览

| 属性 / Getter | 类型 | 说明 |
| --- | --- | --- |
| `bundle.id` / `getId()` | `string` | `script.yml` 中的唯一脚本包 ID |
| `bundle.name` / `getName()` | `string` | 脚本包展示名称 |
| `bundle.version` / `getVersion()` | `string` | 脚本包版本号 |
| `bundle.author` / `getAuthor()` | `string` | 作者名 |
| `bundle.dataFolder` / `getDataFolder()` | `java.io.File` | 独立数据目录 `plugins/MayJS/bundles/<id>/`（自动创建） |
| `bundle.config` / `getConfig()` | `YamlConfiguration` | 自动加载自 `plugins/MayJS/bundles/<id>/config.yml` |
| `bundle.storage` / `getStorage()` | `NamespacedStorageView` | 带 `bundle:<namespace>:` 自动前缀隔离的存储视图 |
| `bundle.logger` / `getLogger()` | `BundleLogger` | 带 `[Bundle:<id>]` 前缀的日志对象 |

## 配置读写

```javascript
var prefix = bundle.config.getString("prefix", "§b[签到] ");
var rewardCoins = bundle.config.getInt("reward.coins", 100);

// 修改并保存配置
bundle.config.set("last-run", Date.now());
bundle.saveConfig();

// 重新从磁盘读取 config.yml
bundle.reloadConfig();
```

## 命名空间隔离存储（`bundle.storage`）

用法与全局 `storage` 完全一致，但所有键名会自动附加 `bundle:<storage-namespace>:` 前缀，彻底避免与其他脚本包发生键冲突：

```javascript
// 包级内存 KV
bundle.storage.set("today_count", 10);
var count = bundle.storage.get("today_count", 0);

// 玩家维度内存 KV
bundle.storage.player(player).set("claimed", true, 86400);

// SQLite 持久化（需 sqlite-jdbc 可用）
if (bundle.storage.isPersistentAvailable()) {
    bundle.storage.persist.player(player).set("total_days", 7);
}
```

## 日志输出（`bundle.logger`）

```javascript
bundle.logger.info("签到模块已启动");
bundle.logger.warn("配置项 reward.coins 未设置，使用默认值 100");
bundle.logger.error("发放奖励失败");
```
