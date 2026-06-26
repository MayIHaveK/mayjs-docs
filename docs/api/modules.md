# require — 模块系统

MayJS 实现了 CommonJS 模块规范，支持 `require` / `exports` / `module.exports`。

## 创建模块

在 `plugins/MayJS/scripts/libs/` 目录下创建模块文件：

```javascript
// libs/utils.js

exports.formatMoney = function(amount) {
    return "§e" + amount + " §6金币";
};

exports.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

exports.isPlayer = function(obj) {
    var Player = Java.type("org.bukkit.entity.Player");
    return obj instanceof Player;
};
```

## 使用模块

```javascript
function main() {
    var utils = require("libs/utils.js");

    sender.sendMessage(utils.formatMoney(1000));
    sender.sendMessage("§a随机数: " + utils.randomInt(1, 100));
}
```

## module.exports

导出单个对象或类：

```javascript
// libs/Logger.js

function Logger(prefix) {
    this.prefix = prefix;
}

Logger.prototype.info = function(msg) {
    print("[" + this.prefix + "] " + msg);
};

Logger.prototype.warn = function(msg) {
    print("[" + this.prefix + " WARN] " + msg);
};

module.exports = Logger;
```

使用：
```javascript
var Logger = require("libs/Logger.js");
var log = new Logger("MyScript");
log.info("启动成功");
```

## 路径解析

`require()` 的路径相对于 `scripts/` 目录：

```
plugins/MayJS/scripts/
├── libs/
│   ├── utils.js        ← require("libs/utils.js")
│   └── database.js     ← require("libs/database.js")
├── modules/
│   └── shop.js         ← require("modules/shop.js")
└── main.js
```

## 模块缓存

- 模块在首次 `require()` 时执行一次，结果被缓存
- 多次 `require()` 同一文件返回**相同的 exports 对象**（单例语义）
- 文件修改后缓存自动失效，下次 `require()` 重新执行

## 模块间隔离

每个模块运行在独立的作用域中，模块内的变量不会污染全局：

```javascript
// libs/a.js
var count = 0;  // 只在 a.js 内可见
exports.increment = function() { return ++count; };
```

```javascript
// libs/b.js
var count = 100;  // 和 a.js 的 count 互不影响
exports.getCount = function() { return count; };
```

## 最佳实践

- 模块文件放在 `libs/` 目录下
- 一个模块只做一件事
- 导出多个工具函数用 `exports.xxx = ...`
- 导出一个类/构造函数用 `module.exports = ...`
- 避免模块内产生副作用（不要在顶层注册监听器）
- 如果模块需要初始化，导出一个 `init()` 方法让调用方决定何时执行

::: warning 注意
`require()` 是同步操作。不要在模块顶层执行耗时操作（如网络请求），否则会阻塞脚本加载。
:::
