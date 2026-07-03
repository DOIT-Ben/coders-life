# 项目优化规划：存档链路修复 + 数据分包 + 工程护栏

- 日期：2026-07-03
- 范围：程序员人生模拟器 V6（本仓库）
- 性质：缺陷修复 + 构建产物优化 + 工程质量补齐，不新增玩法功能
- 模式：严格模式（跨模块、预计改动 ≥ 5 个文件）

## 一、第一性原理：当前阶段核心需求

本项目已具备清晰分层（config 数据 → core 纯引擎 → systems 业务 → components UI → storage 存档）、166 个单测和 CI 门禁。当前阶段真正的需求不是加功能，而是让"已经写好的能力真正生效、让工程底座能支撑后续扩展"：

1. **玩家的进度必须能存住、续上**。存档是模拟经营类游戏的最低可信度要求。当前 `App.tsx` 读写 `'ms_game'`，而 `saveManager.ts` 实际写入 `'programmer_survival_v6_save'`（src\storage\saveManager.ts:20），导致：
   - 「继续上次生存」按钮永远不出现（App 永远读不到存档）；
   - 190 行存档迁移逻辑（`loadGame`/`withDefaults`）在 UI 链路中是死代码；
   - 「重开」清不掉真实存档，localStorage 残留。
   这是唯一用户可直接感知的功能性缺陷，优先级最高。
2. **加载性能不能随数据量线性劣化**。本游戏是数据驱动设计，事件池会持续膨胀（当前弹窗池 1575 条，编译进 JS 后独占 583KB chunk 的主体）。需要把"大数据"与"代码"解耦，否则每次扩充内容都直接加重 chunk 解析成本。
3. **工程护栏要在代码量突破 1 万行前就位**。当前无 ESLint、无 ErrorBoundary（引擎抛异常会白屏，违反本项目"用户可见错误必须产品化"的规则）、存档读入无健全性校验。这些是越晚补成本越高的债。
4. **源码目录只放运行时需要的东西**。`src/data/realworld/` 混放原始 CSV/JSONL、生成后的 JSON 和调研文档，运行时只 import 生成 JSON。原始资料应迁出 `src/`。

## 二、行业验证与可复用方案调研

| 需求 | 行业方案 | 来源 |
|---|---|---|
| 大 JSON 与代码解耦 | Vite 官方：静态 `import xx.json` 会转成 JS module 打进 chunk；动态 `import()` 自动 code-split 成独立 chunk 并懒加载；更彻底的方案是 `?url` / `public/` + `fetch` | vite.dev/guide/features（本次已查证） |
| ESLint 接入 | typescript-eslint 官方 flat config：`eslint` + `@eslint/js` + `typescript-eslint`（当前 v8.x），`eslint.config.js`（本项目 `"type": "module"` 可直接用 .js）+ `defineConfig` + `files` 限定范围 | typescript-eslint.io/getting-started（本次已查证） |
| React 运行时错误兜底 | React 官方模式：class 组件 ErrorBoundary（`getDerivedStateFromError`），函数组件无等价 API，属于标准自研范围（约 30 行） | React 官方文档既有共识 |
| 存档迁移 | 项目自身 `withDefaults` 模式已成熟（默认值合并 + 字段迁移），复用即可，无需引入 zod 等校验库——存档是自产自销数据，轻量健全性检查足够 | 项目既有模式 |

**限制说明**：本次联网仅查证了 Vite 与 typescript-eslint 两个决定技术路线的官方文档；React ErrorBoundary 为长期稳定 API，基于既有知识不再重复查证。

## 三、复用 / 适配 / 自研结论

| 事项 | 结论 | 理由 |
|---|---|---|
| 存档修复 | **复用**项目自身 `saveManager`（含迁移），只修接线 | 迁移逻辑已有测试覆盖，问题只在 App 层用错 key |
| 弹窗池分包 | **适配** Vite 动态 `import()`（不采用 `public/` + fetch） | 动态 import 在浏览器、vitest、tsx 脚本三种环境行为一致，一套代码路径；`public/` + fetch 需为 Node 环境写 readFile 分支，复杂度不划算。代价是数据仍以 JS module 形式存在，但已从游戏主 chunk 中拆出、并行加载 |
| ESLint | **复用**官方推荐 flat config + `eslint-plugin-react-hooks` | 官方标准，零自研 |
| ErrorBoundary | **自研**（约 30 行标准模式） | React 无内置组件，属于官方文档认可的标准自研 |
| 存档校验 | **复用**既有 `withDefaults` + 自研约 10 行健全性检查 | 无需引库 |

## 四、落地方案

### 关键设计约束（先于所有步骤）

**约束 A：index 首屏 chunk 不得引入 `config/events` 依赖链。**
当前 `saveManager → config/events → popupEvents → 583KB JSON`。实测 dist：弹窗数据只在懒加载的 `shop` chunk 中，首屏 index chunk（207KB）是干净的。若 P0 修复时在 `App.tsx` 静态 `import { loadGame } from saveManager`，会把 583KB 拖进首屏——**必须用动态 import**。App 已有 `preload()` 在挂载后预热懒 chunk，动态 import 复用该时机，无额外网络代价。

**约束 B：事件池异步化后，任何消费 `EVENTS` 的代码不得在数据就绪前执行。**
消费方：`eventSystem`（月度结算时）、`saveManager`（模块级 `KNOWN_EVENT_COOLDOWN_KEYS`，需改为调用时懒计算）、模拟脚本、测试。统一通过幂等的 `ensureGameDataLoaded(): Promise<void>` 收口。

**约束 C：大文件规则。**`GameContainer.tsx`（562 行）、`GameDialogs.tsx`（589 行）、`types/game.ts`（567 行）已超 500 行阈值。本轮对它们只做接线级小改（不堆叠新分支），**暂缓拆分**；原因：拆分属独立重构，与本轮目标（修复+分包+护栏）混做会放大回归面。拆分目标：GameContainer 按"状态管理 / 面板渲染 / 弹窗调度"三块拆；删除条件：下一轮功能开发触及这三个文件任一时，先拆再加。

### 步骤 1（P0）：修复存档链路

- `App.tsx`：删除 `checkSave`（错误 key `'ms_game'`）；挂载后动态 `import('./storage/saveManager')`，用 `loadGame()`（含迁移）填充 `savedState`；`resetToCareer` 改用 `clearSave()`；一次性清理历史遗留的 `'ms_game'` 键。
- 补接线回归测试（jsdom）：向真实 `SAVE_KEY` 写入存档 → 渲染 App → 断言「继续上次生存」出现且点击后进入游戏；「重开」后断言真实 key 被清除。
- 单独 commit。

### 步骤 2（P1a）：弹窗事件池异步分包

- 新增 `src/config/dataLoader.ts`：`ensureGameDataLoaded()` 幂等单例，内部 `await import('../data/popup_pool_game_ready_2026-06-18.json')`，完成后填充事件注册表。
- `popupEvents.ts`：`POPUP_EVENTS` 改为由 loader 填充的可变数组（初始为空）+ 现有映射逻辑保留。
- `events.ts`：`EVENTS` 从静态 concat 改为 loader 填充后重建（或改为 `getEvents()` 访问器，视改动面取小者）。
- `saveManager.ts`：`KNOWN_EVENT_COOLDOWN_KEYS` / `KNOWN_EVENT_CHOICE_MEMORY_KEYS` 从模块级常量改为首次调用时惰性计算。
- 就绪时机：`App` 的存档加载 effect 与 `GameContainer` 挂载各自 `await ensureGameDataLoaded()`（幂等，谁先到谁触发）；`scripts/simulate*.ts` 与测试 setup（vitest `setupFiles`）顶部 await。
- 降级策略：加载失败时事件池为空，游戏可继续（弹窗事件是风味内容），日志给产品化提示，不抛异常。
- 验收：`npm run build` 后原 583KB chunk 显著缩小，弹窗数据独立 chunk；全部测试通过；`simulate` 结果与改造前同种子一致（事件池内容不变，仅加载方式变化——需用同 seed 对比关键终局字段）。
- 单独 commit。

### 步骤 3（P1b）：原始数据迁出 src

- `git mv` 将 `src/data/realworld/` 下 CSV、JSONL、`*.md` 调研文档迁至 `tools\data\realworld\`；运行时 import 的 `realworld_*.json` 与 `popup_pool_*.json` 留在 `src/data/`。
- 迁移前 grep 确认无代码引用被移文件；`tools\data\realworld\README.md` 说明数据流向（原始 CSV → 生成 JSON 的对应关系）。
- 单独 commit。

### 步骤 4（P2）：工程护栏

- ESLint：`eslint` + `@eslint/js` + `typescript-eslint` + `eslint-plugin-react-hooks`，flat config；`npm run lint` 入 package.json 与 CI；首轮以 `recommended` 为基线，存量告警只修 error 级，不做风格化大扫除（外科原则）。
- ErrorBoundary：包裹 `GameContainer` 的 Suspense 外层；用户可见文案产品化（中文、无堆栈/英文异常/状态码），提供「重新加载」与「重开一局」出口；开发态在 console 保留原始错误。
- 配置归位：`App.tsx` 内联的 `VALUE_PROFILES`、`careerHighlights`、`cityOptions` 迁至 `src/config/`（并入 careers.ts 或新建 startProfiles.ts，取改动小者）。
- 存档健全性校验：`loadGame` 解析后检查关键字段类型（`month`/`stats`/`career` 存在且类型正确），不合格返回 `undefined` 走新开局。
- 单独 commit（可按 lint / 其余 拆两个）。

### 步骤 5（P3）：引擎小优化与收尾

- `gameEngine.getAvailableActions`：每个行动只调一次 `canExecuteAction`。
- `createInitialState` / `realworldDefaults`：审计浅拷贝默认值，含嵌套对象者统一 `structuredClone`，避免跨局共享引用。
- 全量验证 + 复盘落 `docs\dev-records\`，更新 `workbench\readme.md`。

## 五、风险与验证标准

### 风险

| 风险 | 等级 | 缓解 |
|---|---|---|
| P0 修复把 events 依赖链拖进首屏 chunk | 中 | 约束 A：动态 import；build 后核对 dist chunk 构成 |
| 事件池异步化后引擎在数据就绪前跑月结 | 中 | 约束 B：所有入口统一 `ensureGameDataLoaded`；测试断言未就绪时事件池为空但不崩溃 |
| 老玩家存档兼容 | 低 | key 与格式均不变，且修复后迁移逻辑首次真正生效；用测试中既有 legacy 形状存档回归 |
| 模拟结果漂移（调参基线失效） | 中 | 同 seed 前后对比 `simulate` 终局关键字段；`simulate:batch` 阈值门禁在 CI 已有 |
| lint 引发大面积改动 | 低 | 基线从 recommended 起步，只修 error，不自动 fix 全仓风格 |

### 验证标准（全部满足才算完成）

1. `npm test` 全绿（166 + 新增接线/异步化测试）。
2. `npm run build` 成功；首屏 index chunk 不含弹窗池数据；原 583KB chunk 拆出独立数据 chunk。
3. `npm run simulate`、`npm run simulate:batch` 通过，同 seed 终局关键字段与改造前一致。
4. 手工链路：dev 页面新开局 → 执行数月 → 刷新 → 「继续上次生存」出现 → 续档状态正确 → 「重开」后存档被清除。
5. `npm run lint` 0 error；CI 增加 lint 步骤且通过。
6. 用户可见层审计：无内部标签/英文异常/调试词泄漏到 UI 文案。
