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

### 散装脚本（相对于 `scripts/`）

在普通脚本、服务脚本或模块脚本中，`require()` 的非相对路径默认相对于 `scripts/` 目录，支持省略 `.js` / `.mjs` 后缀：

```
plugins/MayJS/scripts/
├── libs/
│   ├── utils.js        ← require("libs/utils.js") 或 require("libs/utils")
│   └── database.js     ← require("libs/database.js")
├── modules/
│   └── shop.js         ← require("modules/shop.js")
└── main.js
```

### 脚本包内的相对路径（3.0 新增）

在 [脚本包（目录包或 `.mjsb` 加密归档）](../guide/bundles) 内部，`require("./...")` 与 `require("../...")` 会**按当前脚本所在包内路径解析**，自动补全 `.js` / `.mjs`：

```javascript
// bundles/daily-reward/index.js
const rewards = require("./rewards");         // 解析为包内 rewards.js / rewards.mjs
const helper = require("./utils/format");     // 解析为包内 utils/format.js

// bundles/daily-reward/utils/format.js
const config = require("../rewards");         // 向上回退至包内 rewards.js
```

- 包内模块与 `.mjsb` 纯内存字节源完全打通，无需落盘即可直接 `require` 加密归档中的子模块。
- 若路径不以 `./` 或 `../` 开头，仍会回退到全局 `scripts/` 共享库查找。
- 越界遍历（如试图 `../../` 逃出包根目录）会被强制拦截。

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
