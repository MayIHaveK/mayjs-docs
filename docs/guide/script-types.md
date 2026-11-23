# 脚本类型与生命周期

MayJS 3.0 支持四大脚本形态：普通脚本、服务脚本、CommonJS 模块，以及工程化脚本包（Bundle）。

## 1. 普通脚本（`SCRIPT`）

- 适用场景：通过 `/mayjs run <脚本>` 或指令触发的一次性任务、工具脚本。
- 入口函数：`function main()`（必填）。
- 动态变量：每次调用都会注入并还原当前 `sender`（`CommandSender`）与 `args`（`List<String>`）。

```javascript
function main() {
    var count = args.size();
    sender.sendMessage("§a收到参数数量: " + count);
    return count;
}
```

## 2. 服务脚本（`SERVICE`）

在文件头部注释区声明 `//@service` 即成为常驻服务脚本：

```javascript
//@service
//@engine auto
function onLoad() {
    events.listen("org.bukkit.event.player.PlayerQuitEvent", function (e) {
        print(e.getPlayer().getName() + " 离开了服务器");
    });

    onDispose(function () {
        print("清理外部连接/状态完成");
    });
}

function onUnload() {
    print("服务脚本正在卸载...");
}
```

特点：
- 文件保存或重载时自动执行 `onLoad()`，卸载时依次调用 `onUnload()` -> 按 **LIFO 倒序** 释放所有追踪资源（监听器、命令、PAPI、任务与 `onDispose` 回调）。
- 若同时定义了 `main()`，也可手动 `/mayjs run <脚本>` 调用。
- 不带参数的 `/mayjs reload-script` 会自动记录并恢复所有运行中的 `@service` 脚本。

## 3. CommonJS 模块（`MODULE`）

放在 `plugins/MayJS/scripts/libs/` 目录下的模块文件（或脚本包内部的 `./lib/*.js`），通过 `require(...)` 加载，使用 `exports` 或 `module.exports` 导出：

```javascript
// scripts/libs/format.js
'use strict';

exports.color = function (text) {
    return String(text).replace(/&/g, '§');
};
```

MayJS 3.0 对模块采用 Node 风格的 IIFE 隔离包装，确保在 GraalJS 单 Context 下不同模块的顶层 `const`/`let`/`var` 互不冲突，且零行号偏移。

## 4. 脚本包（Script Bundle）

适合中大型独立功能模块或商业分发，使用 `script.yml` 声明元数据、依赖插件与目标引擎，支持目录开发和 `.mjsb` 加密归档。详见 [脚本包指南](/guide/bundles)。
