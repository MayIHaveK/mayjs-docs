# 快速开始

本节带你用 3 分钟分别体验 MayJS 3.0 的**单文件脚本**与**工程化脚本包**。

## 1. 第一个单文件脚本

在 `plugins/MayJS/scripts/` 下新建 `hello.js`：

```javascript
function main() {
    var who = sender ? sender.getName() : "Console";
    var extra = args.size() > 0 ? args.get(0) : "MayJS 3.0";
    print("Hello " + who + ", welcome to " + extra + "!");
    if (sender) {
        sender.sendMessage("§a你好 " + who + "，当前运行在 MayJS 3.0！");
    }
}
```

在控制台或游戏内执行：

```text
/mayjs run hello World
```

## 2. 第一个常驻服务脚本（含自动清理）

在 `plugins/MayJS/scripts/` 下新建 `welcome.js`：

```javascript
//@service
function onLoad() {
    events.listen("org.bukkit.event.player.PlayerJoinEvent", function (event) {
        var player = event.getPlayer();
        player.sendMessage("§b欢迎来到服务器，" + player.getName() + "！");
    });

    commands.register("hello", function (sender) {
        sender.sendMessage("§a来自 welcome.js 服务脚本的问候！");
        return true;
    });

    // 自定义清理钩子：热重载或 /mayjs unload 时自动触发
    onDispose(function () {
        print("welcome.js 已完成自定义资源清理");
    });
}
```

保存文件后，文件监听器会自动加载 `welcome.js` 并执行 `onLoad()`。你可以随时使用以下运维命令管理它：

```text
/mayjs list                  # 查看所有已加载脚本与脚本包
/mayjs info welcome          # 查看监听器、命令、PAPI 与任务追踪计数
/mayjs reload-script welcome # 热重载（自动注销旧监听器/命令并触发 onDispose）
/mayjs unload welcome        # 彻底卸载并释放资源
```

## 3. 使用 GraalJS 原生编写 ES2023+

若服务器已安装 `MayJS-GraalJS.jar`（JDK 21+），无需任何转译配置即可直接编写现代 JavaScript：

```javascript
//@service
class WelcomeCounter {
    #count = 0;
    next(name) {
        this.#count++;
        return `§a第 ${this.#count} 位到访玩家：${name ?? '匿名访客'}`;
    }
}

const counter = new WelcomeCounter();

function onLoad() {
    events.listen("org.bukkit.event.player.PlayerJoinEvent", (e) => {
        server.broadcast(counter.next(e.getPlayer()?.getName()));
    });
}
```

## 4. 下一步

- 多文件项目与商业分发？阅读 [脚本包 (.mjsb) 与授权头](/guide/bundles)
- 想要 VS Code 自动补全？阅读 [CLI 工具链与 IDE 补全](/guide/cli-and-ide)
- 查看所有内置能力？阅读 [API 总览](/api/overview)
