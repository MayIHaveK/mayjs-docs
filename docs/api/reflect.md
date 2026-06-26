# reflect — 反射与 Java 互操作

## 导入类

### 跨插件导入

```javascript
// 从指定插件加载类
var SomeClass = reflect.importClass("PluginName", "com.example.SomeClass");
```

### 全域搜索

```javascript
// 不指定插件，从所有已加载的 ClassLoader 中搜索
var SomeClass = reflect.importClass(null, "com.example.SomeClass");
```

### Nashorn 原生方式

```javascript
// 标准库和 Bukkit API 可直接使用
var HashMap = Java.type("java.util.HashMap");
var Material = Java.type("org.bukkit.Material");
```

::: tip 何时用 reflect.importClass？
`Java.type()` 只能加载 MayJS 自身 ClassLoader 可见的类。访问其他插件的类需要用 `reflect.importClass("插件名", "类全名")`。
:::

## 创建实例

```javascript
var instance = reflect.newInstance(SomeClass, arg1, arg2);

// 也可以传类名字符串
var instance = reflect.newInstance("java.util.ArrayList");
```

参数类型会自动适配（JS 的 Number 自动转换为 int/long/double 等）。

## 包装对象（调试）

```javascript
var mirror = reflect.wrap(someObject);
```

`wrap()` 返回一个 `InstanceMirror`，你可以像操作 Map 一样访问对象的字段和方法，方便调试。

## 动态实现接口

### 单方法接口（SAM）

```javascript
var runnable = reflect.implement("java.lang.Runnable", function() {
    print("Running!");
});

// 用在需要 Runnable 的地方
scheduler.run(runnable);
```

### 多方法接口

```javascript
var listener = reflect.implement("org.bukkit.event.Listener", {
    // 如果接口有多个方法，用对象映射
    onEnable: function() { print("enabled"); },
    onDisable: function() { print("disabled"); }
});
```

### 多接口实现

```javascript
var obj = reflect.implement(
    ["java.lang.Runnable", "java.io.Serializable"],
    function() { print("run"); }
);
```

## FastReflection（底层反射）

通过 `reflect.getFastReflection()` 获取底层反射工具：

```javascript
var fr = reflect.getFastReflection();

// 读取字段（包括私有字段）
var value = fr.getValue(target, "fieldName");

// 设置字段
fr.setValue(target, "fieldName", newValue);

// 调用方法（包括私有方法）
var result = fr.invoke(target, "methodName", arg1, arg2);

// 创建实例
var instance = fr.createInstance(SomeClass, arg1, arg2);
```

FastReflection 特性：
- 自动处理 JS Number → Java int/long/double 类型转换
- 支持私有字段/方法访问
- 方法重载模糊匹配（参数数量和类型兼容即可）
- String → Enum 自动转换
- 高性能（内置缓存）

## 实际应用

### 访问 NMS（内部类）

```javascript
//@service

function onLoad() {
    events.listen("org.bukkit.event.player.PlayerJoinEvent", function(e) {
        var player = e.getPlayer();

        // 通过反射获取 CraftPlayer 的 handle
        var fr = reflect.getFastReflection();
        var handle = fr.invoke(player, "getHandle");

        // 获取 ping（1.16 及以下版本）
        var ping = fr.getValue(handle, "ping");
        player.sendMessage("§a你的延迟: " + ping + "ms");
    });
}
```

### 调用其他插件 API

```javascript
var EconomyClass = reflect.importClass("Vault", "net.milkbowl.vault.economy.Economy");

// 通过 Bukkit 服务获取实例
var rsp = org.bukkit.Bukkit.getServicesManager()
    .getRegistration(EconomyClass);

if (rsp != null) {
    var economy = rsp.getProvider();
    var balance = economy.getBalance(sender);
    sender.sendMessage("§a余额: " + balance);
}
```
