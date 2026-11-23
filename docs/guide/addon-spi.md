# Java Addon SPI 扩展开发

MayJS 3.0 将公开契约独立拆分为**无混淆、JDK 8 兼容**的 `mayjs-api` 模块，供第三方 Bukkit / Paper 插件深度集成。

## 1. 引入 `mayjs-api` 依赖

在第三方插件的 `pom.xml` 中以 `provided` 作用域依赖 `mayjs-api`（切勿 shade 进自己的插件 JAR）：

```xml
<dependency>
    <groupId>com.mayihavek</groupId>
    <artifactId>mayjs-api</artifactId>
    <version>3.0.0-SNAPSHOT</version>
    <scope>provided</scope>
</dependency>
```

并在 `plugin.yml` 中声明依赖关系：

```yaml
depend: [MayJS] # 或 softdepend: [MayJS]
```

## 2. 获取 `MayJsApi` 实例

支持两种等价方式获取核心门面：

```java
// 方式 1：静态入口
if (MayJs.isAvailable()) {
    MayJsApi api = MayJs.getApi();
}

// 方式 2：Bukkit 标准 ServicesManager
RegisteredServiceProvider<MayJsApi> rsp =
        Bukkit.getServicesManager().getRegistration(MayJsApi.class);
MayJsApi api = rsp != null ? rsp.getProvider() : null;
```

## 3. 向所有 JS 脚本注入自定义全局服务

```java
public class EconomyAddon extends JavaPlugin {
    @Override
    public void onEnable() {
        MayJsApi api = MayJs.getApi();
        api.registerBinding(this, "economy", new MyEconomyBridge());
    }
}
```

- 脚本中可直接使用 `economy.deposit(player, 100)`，无需 `Java.type(...)`。
- MayJS 内置保留变量名（如 `server`、`events`、`storage`、`bundle`、`onDispose` 等）受保护，外部插件不可覆写。
- **零泄漏保证**：当 `EconomyAddon` 被禁用或卸载时，MayJS 会自动监听 `PluginDisableEvent` 并注销该插件注册的全部绑定与生命周期监听器，防止旧 `PluginClassLoader` 泄漏。

## 4. 将自定义资源接入当前脚本的自动清理周期

当脚本调用你的 Addon 方法创建了需要释放的句柄（如全息字、GUI、BOSS 血条）时，调用 `api.trackDisposable(...)` 即可让该资源在脚本重载/卸载时按 LIFO 顺序自动清理：

```java
public HologramHandle createHologram(Location loc, String text) {
    HologramHandle handle = spawnHologram(loc, text);
    if (MayJs.isAvailable()) {
        MayJs.getApi().trackDisposable(handle::destroy);
    }
    return handle;
}
```

## 5. 监听脚本与脚本包生命周期

```java
MayJs.getApi().addLifecycleListener(this, new ScriptLifecycleListener() {
    @Override
    public void onScriptLoaded(ScriptDescriptor descriptor) {
        getLogger().info("脚本已加载: " + descriptor.getScriptId() + " [" + descriptor.getEngineId() + "]");
    }

    @Override
    public void onBundleLoaded(BundleDescriptor bundle) {
        getLogger().info("脚本包已加载: " + bundle.getBundleId() + " v" + bundle.getVersion());
    }
});
```

## 6. 扩展自定义 JS 引擎后端（Engine SPI）

如需接入自定义 JS 引擎后端（参考官方 `mayjs-engine-graaljs`）：
1. 实现 `com.mayihavek.mayjs.api.engine.JsEngineBackend` 与 `JsEngineSession`。
2. 在插件资源中声明 `META-INF/services/com.mayihavek.mayjs.api.engine.JsEngineBackend`，MayJS 启动期会自动发现并按 `getPriority()` 参与 `engine: auto` 选举。
3. 亦可在运行期调用 `api.registerEngineBackend(backend)` 与 `api.unregisterEngineBackend(engineId)` 动态管理。
