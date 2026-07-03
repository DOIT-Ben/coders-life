# 2026-07-03 项目优化执行复盘（存档修复 + 数据分包 + 工程护栏）

- 规划：`docs\plans\2026-07-03-project-optimization-plan.md`
- 提交：`142273f`（P0 存档）、`10f7795`（P1a 分包）、`3ebd66c`（P1b 数据迁移）、`e186b69`（P2 护栏）、本次（P3 引擎修正）

## 做了什么

1. **P0 存档链路修复**：`App.tsx` 原来读写 `'ms_game'`，而 `saveManager` 实际写 `'programmer_survival_v6_save'`，导致「继续上次生存」永不出现、迁移逻辑成死代码。改为 App 动态 import `saveManager.loadGame()`（保持首屏 chunk 不被 events 依赖链污染），重开走 `clearSave()`，一次性清理遗留 `ms_game` 键。新增 `saveWiring.test.tsx` 接线回归。
2. **P1a 弹窗池分包**：1325 条弹窗事件 JSON 从 583KB 混合 chunk 拆为独立数据 chunk（426KB / gzip 48KB），新增 `config/dataLoader.ensureGameDataLoaded()` 幂等收口；`EVENTS` 改为 loader 注册追加，`saveManager` 冷却键改调用时计算。App/模拟脚本/vitest setup 统一先加载后跑引擎。同 seed 单局与批量模拟结果与改造前一致。
3. **P1b 数据迁移**：原始 CSV/JSONL/调研文档 `git mv` 至 `tools\data\realworld\`，`src\data` 只留运行时 JSON，README 标注对应关系。
4. **P2 工程护栏**：ESLint flat config（0 error 基线，lint 入 CI）；ErrorBoundary 产品化兜底；App 内联配置归位 `config/startProfiles.ts`；`loadGame` 健全性校验。
5. **P3 引擎修正**：`getAvailableActions` 每行动只调一次 `canExecuteAction`；`withDefaults` 中 `DEFAULT_CAREER_PROFILE` 共享引用 + 覆盖 track 专属默认值的问题（legacy 存档会被错置为 frontend 档案）与 `DEFAULT_MONTHLY_PLAN` 嵌套对象共享引用，均已修复。

## 验证

- 169 单测全绿；lint 0 error（4 warning 为 GameContainer 既有 set-state-in-effect / exhaustive-deps，重构排期见规划约束 C）。
- build 成功：首屏 index chunk 无弹窗数据；单局 simulate 同 seed 终局一致；simulate:batch releaseGate 通过（确定性回放 1.0）。
- 手工链路（dev + 浏览器）：新开局 → 执行行动 → 存档写入真实 key → 刷新 → 「继续上次生存」出现 → 续档回到第 30 天 ✓。

## 踩坑与经验

- `v1FrontendContract.test.ts` 会以 `?raw` 方式 grep `App.tsx` 源码；把内联配置移到 config 时必须同步更新契约测试的源文件引用。
- Vite 静态 JSON import 会编译进 JS chunk；`saveManager → config/events → popup JSON` 这条链意味着**任何在首屏静态 import saveManager 的改动都会拖 583KB 进首屏**，务必用动态 import。
- Windows 下 git bash 的 `/tmp` 与 node 解析路径不一致，临时产物用项目内 `.codex-run\`。
