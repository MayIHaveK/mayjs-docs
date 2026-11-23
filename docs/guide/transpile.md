# ES6+ 语法与转译

MayJS 3.0 根据当前引擎的能力自动采取最优方案：

## 1. GraalJS 环境（推荐，免转译）

当你安装了配套插件 `MayJS-GraalJS.jar`（JDK 21+）时：
- **原生支持 ECMAScript 2023+**：`const` / `let`、箭头函数、`class` 与私有字段、模板字符串、解构赋值、展开运算符、可选链 `?.`、空值合并 `??`、`Promise`、`Map`/`Set` 等开箱即用。
- **无需 Node.js、无需 Babel**：即使脚本头部保留了兼容旧版的 `//@es6` 或 `//@modern` 注释，MayJS 也会自动识别引擎支持现代语法并直接跳过转译。

## 2. Nashorn 环境（按需转译 / 预编译）

在仅运行 Nashorn（JDK 8–17）的服务器上，若脚本使用了现代 ES6+ 语法，有两种方式：

### 方式 A：服务端按需转译（`//@es6`）
在脚本顶部注释区添加 `//@es6`（或 `//@modern`）：

```javascript
//@es6
const greet = (name = 'Steve') => `Hello, ${name}!`;
function main() {
    print(greet(sender ? sender.getName() : 'Console'));
}
```

并在服务器本机安装 Node.js（或将便携版 Node 放入 `plugins/MayJS/runtime/`），确保 `config.yml` 中 `script-engine.transpile` 未设为 `off`。转译结果会随编译产物一起缓存，仅在文件修改后重新转译。

### 方式 B：本地预编译（`mayjs-cli compile` 或 `/mayjs compile`）
在开发机提前编译为纯 ES5 后再部署到生产服，生产服零 Node.js 依赖：

```bash
java -jar mayjs-cli-3.0.0-SNAPSHOT.jar compile ./src/shop.js -o ./dist/shop.js
```
