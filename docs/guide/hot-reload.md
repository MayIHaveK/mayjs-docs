# 热重载与资源追踪

MayJS 的核心理念是**“保存即生效，卸载零残留”**。

## 1. 自动追踪的资源类型

在脚本 `onLoad()`、`main()`、事件回调或任务回调中注册的以下资源，都会自动挂载到当前脚本的 `ScriptContext`：

- `events.listen(...)` 注册的 Bukkit 事件监听器
- `commands.register(...)` 注册的动态命令（含命名空间前缀清理与防抖 `syncCommands`）
- `papi.register(...)` 注册的 PlaceholderAPI 扩展
- `scheduler.repeat(...)` / `scheduler.later(...)` / `scheduler.chain()` 调度的任务（一次性任务执行完毕后立即自动反注册，防止长期运行内存累积）
- `onDispose(fn)` 注册的自定义清理闭包，以及第三方 Addon 通过 `MayJsApi.trackDisposable(...)` 挂载的资源

卸载或重载时，所有追踪资源按**后进先出（LIFO）**顺序依次释放，避免依赖资源被反向误拆。

## 2. 使用 `onDispose` 清理自定义状态

如果脚本创建了外部连接、BOSS 血条、临时实体、全息字或自定义缓存，使用全局 `onDispose(fn)` 即可纳入自动清理生命周期：

```javascript
//@service
function onLoad() {
    var bossBar = org.bukkit.Bukkit.createBossBar("§e活动进行中",
        org.bukkit.boss.BarColor.YELLOW,
        org.bukkit.boss.BarStyle.SOLID);

    onDispose(function () {
        bossBar.removeAll();
    });
}
```

## 3. 文件监听热重载行为

启用 `script-engine.file-watcher: true` 后：

| 变更文件类型 | 自动行为 |
| --- | --- |
| `//@service` 散脚本 | 防抖后自动卸载旧单元并重新执行 `onLoad()` |
| `auto-run-list.yml` 中的普通脚本 | 防抖后自动重载并执行 `main()` |
| 普通散脚本 | 失效编译缓存与旧单元，下次执行时按需重编译 |
| `libs/` 模块 | 失效模块缓存，下次 `require` 时重新加载 |
| 目录脚本包内任意文件 / `.mjsb` 文件 | 自动触发整个脚本包的安全卸载与重载（释放旧资源并重建 `bundle` 上下文） |

## 4. 手动运维命令

```text
/mayjs reload                  # 热重载 config.yml、沙箱黑名单、引擎模式与熔断配置
/mayjs reload-script           # 清空全部缓存并自动恢复所有运行中的 @service 脚本
/mayjs reload-script <脚本名>  # 重载指定散脚本
/mayjs unload <脚本名>         # 彻底卸载指定散脚本并触发清理
/mayjs bundle reload <id>      # 热重载指定脚本包
/mayjs bundle unload <id>      # 卸载指定脚本包
```
