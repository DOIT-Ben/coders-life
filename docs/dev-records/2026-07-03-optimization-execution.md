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

---

# 追加：终端化前端重设计执行记录（同日第二批次）

- 规划：`docs\plans\2026-07-03-terminal-frontend-redesign.md`
- 提交：`2303bcc`（主题）、`ce10bc4`（面板拆分+commit log）、`ac3ca42`（命令面板）、本次（P0 告警+微交互）

## 做了什么

1. **终端主题**：设计令牌整换为深夜终端系（墨蓝底 + 日志级别语义色），全站等宽字体，135 处硬编码浅色收敛为 token；标题卡改终端窗口 chrome。设计上刻意放弃了扫描线/闪烁特效（易显 AI 味且伤可读性），把风格重量放在 commit log 与命令面板两个"签名件"上。
2. **面板拆分**：GameContainer 559→约 430 行，PressureSummary/ProjectProgressPanel/StatCard 拆到 panels.tsx，LifeLog 重写为 commit log 风格（确定性 FNV-1a 短哈希）。
3. **人生终端**：Ctrl+K/反引号唤起，run/htop/log/whoami/open/save/undo + sudo 彩蛋，输出全中文。
4. **P0 告警 + 数值滚动**：危机激活时的 oncall 风格告警条；StatCard 数值 0.5s 缓动，prefers-reduced-motion 直接跳变。

## 验证

- 169 测试全绿、lint 0 error、build 通过；同 seed simulate 与基线一致（未触引擎）。
- 浏览器实测：终端面板全命令链路、run 精确执行推进月份、P0 告警条渲染、移动端 390px 无横向溢出。
- ErrorBoundary 在开发中被 jsdom 无 matchMedia 的崩溃实际触发过一次，产品化兜底页正常显示——护栏有效。

## 踩坑

- jsdom 不实现 `window.matchMedia`，浏览器 API 须加存在性判断，否则组件崩溃只会表现为 ErrorBoundary 兜底、测试报"文案找不到"。
- 契约测试断言 CSS 结构字符串：换肤必须"只换 token 值不动结构规则"；移动组件代码时逐条迁移源码断言。

## 遗留（下一轮）

- GameDialogs（589 行）拆分 + 结局 Postmortem 重设计。
- 死组件清理（WorldStatusBar/DebugPanel 等 6 个未引用文件，被契约测试引用需连测试一起动）。
- 人生脚本 DSL / 每日挑战 seed 玩法单独立项。
