# ES6+ 转译

MayJS 支持使用现代 JavaScript 语法编写脚本。

## 使用方法

在脚本头部添加 `//@es6` 注解：

```javascript
//@service
//@es6

const REWARDS = ['§a100 金币', '§b经验药水', '§d钻石'];

function onLoad() {
    events.listen("org.bukkit.event.player.PlayerJoinEvent", (e) => {
        const player = e.getPlayer();
        const reward = REWARDS[Math.floor(Math.random() * REWARDS.length)];
        player.sendMessage(`§6[奖励] §f${player.getName()} 获得了 ${reward}`);
    });
}

function main() {}
```

## 支持的语法

| 语法 | 示例 |
|------|------|
| 箭头函数 | `(x) => x * 2` |
| const / let | `const a = 1; let b = 2;` |
| 模板字符串 | `` `hello ${name}` `` |
| 解构赋值 | `const [a, b] = arr;` |
| 默认参数 | `function f(x = 1) {}` |
| class | `class Foo extends Bar {}` |
| 对象简写 | `{ name, age }` |
| 展开运算符 | `{...obj}` |
| for-of | `for (const item of list) {}` |
| 计算属性 | `{ [key]: value }` |
| 幂运算符 | `x ** 3` |

::: warning 不支持
- `async` / `await` / `Promise`
- `import` / `export`（使用 `require` 代替）
- Generator（`function*`）
- `Symbol`、`Map`、`Set`（使用 Java 集合代替）
:::

## 配置

```yaml
script-engine:
  transpile: auto   # auto / manual / off
```

- `auto`：有 `//@es6` 注解的脚本自动转译运行
- `manual`：同 auto，有注解也会转译，但语义上表示"偶尔使用"
- `off`：禁用，含 `//@es6` 的脚本会报错提示

## 命令

```bash
/mayjs compile <脚本名>              # 转译并覆盖原文件
/mayjs compile <脚本名> -o <输出名>   # 转译到指定文件
```

## 配置

```yaml
script-engine:
  # auto: 有 //@es6 注解的脚本自动转译
  # manual: 仅通过命令手动转译（默认，不影响启动速度）
  # off: 禁用
  transpile: manual
```

## 命令

```bash
/mayjs compile <脚本名>              # 转译并覆盖原文件
/mayjs compile <脚本名> -o <输出名>   # 转译到指定文件
```

## 两种工作流

### 自动模式

设置 `transpile: auto`，脚本带 `//@es6` 注解即自动转译运行：

```
scripts/my-service.js （ES6+ 源码，带 //@es6）
        ↓ 自动转译
      Nashorn 执行
```

### 手动模式

保持默认 `transpile: manual`，开发时手动编译：

```
scripts/src/my-service.js （ES6+ 源码）
        ↓ /mayjs compile src/my-service -o my-service
scripts/my-service.js （ES5 输出，MayJS 加载）
```

::: tip 选择建议
- 脚本数量少、开发频繁 → `auto` 更方便
- 正式环境、追求启动速度 → `manual` 预先编译好
:::
