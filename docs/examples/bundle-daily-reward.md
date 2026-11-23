# 现代 ES2023+ 脚本包示例（每日签到）

本示例展示如何结合 **GraalJS 原生 ES2023+ 语法**、**目录脚本包（`script.yml`）**、**包内相对 `require`**、**`bundle.config` / `bundle.storage`** 与 **`onDispose`** 构建一个结构清晰、可一键打包为 `.mjsb` 分发的完整功能包。

## 目录结构

```text
daily-reward/
├── script.yml
├── config.yml
├── index.js
└── lib/
    └── date-util.js
```

## 1. `script.yml`

```yaml
id: daily-reward
name: 每日签到系统
version: 1.0.0
author: MayIHaveK
main: index.js
mode: service
engine: auto
depend: []
softdepend:
  - PlaceholderAPI
storage-namespace: daily_reward
```

## 2. `config.yml`

```yaml
prefix: "&b[每日签到] &r"
reward-command: "give %player% diamond 1"
success-message: "&a签到成功！你已累计签到 &e%days% &a天。"
already-message: "&c你今天已经签到过了，明天再来吧！"
```

## 3. `lib/date-util.js`

```javascript
const LocalDate = Java.type("java.time.LocalDate");

exports.todayKey = () => LocalDate.now().toString();
exports.colorize = (text) => String(text ?? "").replace(/&/g, "§");
```

## 4. `index.js`

```javascript
const { todayKey, colorize } = require("./lib/date-util");

function onLoad() {
    const prefix = () => colorize(bundle.config.getString("prefix", "&b[签到] "));

    commands.register("signin", (sender) => {
        if (!sender || typeof sender.getUniqueId !== "function") {
            sender.sendMessage("仅玩家可执行签到命令。");
            return true;
        }

        const today = todayKey();
        const playerStore = bundle.storage.player(sender);
        if (playerStore.get("last_date") === today) {
            sender.sendMessage(prefix() + colorize(bundle.config.getString("already-message")));
            return true;
        }

        const totalDays = (playerStore.get("total_days", 0) ?? 0) + 1;
        playerStore.set("last_date", today);
        playerStore.set("total_days", totalDays);

        const rewardCmd = bundle.config.getString("reward-command", "")
            .replace("%player%", sender.getName());
        if (rewardCmd) {
            commands.dispatch(rewardCmd);
        }

        const okMsg = bundle.config.getString("success-message", "&a签到成功！")
            .replace("%days%", String(totalDays));
        sender.sendMessage(prefix() + colorize(okMsg));
        return true;
    });

    if (papi.isAvailable()) {
        papi.register("dailyreward", (player, params) => {
            if (!player) return "0";
            if (params === "days") {
                return String(bundle.storage.player(player).get("total_days", 0));
            }
            return null;
        });
    }

    onDispose(() => {
        bundle.logger.info("每日签到脚本包资源已全部清理");
    });

    bundle.logger.info(`已启动 ${bundle.name} v${bundle.version}`);
}
```

## 5. 本地检查与打包发布

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar check ./daily-reward
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar pack ./daily-reward -o daily-reward.mjsb
```

将生成的 `daily-reward.mjsb` 放入目标服务器的 `plugins/MayJS/scripts/` 即可自动加载运行！
