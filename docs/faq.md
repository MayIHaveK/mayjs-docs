# 常见问题 (FAQ)

## 引擎与环境

### Q: 应该选 Nashorn 还是 GraalJS？
- **Paper 1.20.5 / 1.21+（JDK 21+）**：强烈推荐同时安装 `MayJS.jar` 与伴生插件 `MayJS-GraalJS.jar`。原生支持 ECMAScript 2023+（无需 Node.js / Babel）、拥有更好的执行性能，并支持**语句配额与超时熔断保护**。
- **Minecraft 1.7.10 – 1.20.4（JDK 8 – 17）**：安装 `MayJS.jar`（JDK 15+ 需搭配 `NashornJs-1.2.0-norelocate.jar`），主插件零冗余体积且完全兼容。

### Q: 装了 `MayJS-GraalJS.jar` 后还需要装 `NashornJs` 吗？
**不需要**。在 `script-engine.engine: auto` 默认模式下，MayJS 启动期会自动通过 SPI 发现并激活 `graaljs` 引擎。仅当你需要为极少数旧脚本显式标注 `//@engine nashorn` 时才需要同时安装 `NashornJs`。

### Q: 怎么确认当前激活的是哪个引擎？
在控制台或游戏内执行 `/mayjs engine`，即可查看配置模式、当前激活引擎、熔断限制及所有已注册引擎后端的能力状态。

---

## 脚本包与加密

### Q: `.mjsb` 和旧版 `.mjs` 有什么区别？
- **`.mjs`** 适合单文件脚本加密。3.0 起默认升级为 **v2（AES-256-GCM 认证加密）**，同时 100% 向下兼容历史 v1（AES-256-CBC）文件。
- **`.mjsb`** 是多文件工程化脚本包加密归档（包含 `script.yml`、入口脚本、`lib/` 子模块和默认 `config.yml`），同样采用 AES-256-GCM，并额外对头部元数据和可选授权头（`boundQq` / `expireAt`）施加 **AAD 防篡改认证**。

### Q: `.mjsb` 运行时会把解密后的脚本解压到硬盘吗？
**绝对不会**。`.mjsb` 在运行期严格在内存中完成解密与 ZIP 解包，脚本代码永不落盘。只有默认 `config.yml` 会在 `plugins/MayJS/bundles/<id>/config.yml` 尚不存在时释放一次，供服主修改配置。

### Q: 为什么我的 `.mjsb` 提示 `Tag mismatch!`？
说明 `.mjsb` 文件内容或头部元数据（如 `boundQq` / `expireAt`）被篡改，或打包密钥不匹配。请使用 `java -jar mayjs-cli.jar inspect <file.mjsb> --verify` 校验原始包完整性。

---

## 安全与稳定性

### Q: 脚本里不小心写了 `while (true) {}` 会卡死服务器吗？
在 **GraalJS** 环境下，只需在 `config.yml` 中配置 `script-engine.execution-limit.max-statements`（建议 `500000`）和 `timeout-ms`（建议 `5000`），死循环会在数毫秒内被熔断中止并精确报出行号列号，同时 MayJS 会自动重建受损执行域并恢复同域上其他健康的 `@service` 与脚本包，不会拖垮 TPS。

### Q: 修改安全沙箱黑名单需要重启服务器吗？
不需要。修改 `config.yml` 中的 `security.sandbox` 后执行 `/mayjs reload`，新的黑名单会立即同步到类加载器、反射服务与所有活跃引擎会话。

---

## 升级与兼容

### Q: 2.x 写的老脚本在 3.0 能直接运行吗？
**完全兼容**。所有内置全局变量（`server` / `events` / `commands` / `scheduler` / `papi` / `reflect` / `storage` / `require` / `print`）、`//@service` 与历史 v1 `.mjs` 文件均保持兼容；仅对个别旧式辅助方法标注了 `@Deprecated` 建议迁移。详见 [v2 → v3 迁移指南](/guide/migration-v2-to-v3)。
