# 2026-07-04 批次 1 工程清债复盘

- 规划：`docs\plans\2026-07-04-batch1-engineering-debt-plan.md`
- 分支：`chore/v6-frontend-roadmap-batch1`
- 提交：
  - `4916e2c`：批次 1 工程清债实施细案
  - `095059b`：弹窗拆分、死组件删除、lint 规则收紧、命令面板焦点圈闭
  - `7d32d9d`：清理旧日志样式
  - `53a78b8`：补齐 build 与视口验收细节

## 做了什么

1. **低频弹窗拆分**：`GameDialogs.tsx` 从 589 行降到 333 行；`FeedbackDialog`、`AchievementDialog`、`ShopDialog` 和 `ModalShell` 迁到 `src\components\dialogs\`。`GameDialogs` 继续作为 lazy chunk 聚合入口，保留首屏分包策略。
2. **lint 清零并收紧护栏**：移除 `GameContainer` 中 effect 派生 state 的两处 warning；移除缺依赖 `useMemo`；`react-hooks/set-state-in-effect` 从 `warn` 升回 `error`。`npm run lint` 当前 0 error / 0 warning。
3. **删除死组件**：删除 `WorldStatusBar`、`DebugPanel`、`StatPanel`、`ActionPanel`、`ShopModal`、`AchievementModal` 六个未引用旧组件，并把契约测试迁移到当前真实 UI 源。
4. **命令面板焦点圈闭**：人生终端打开时记录来源焦点，Tab / Shift+Tab 在面板内循环，Escape / 遮罩 / 关闭按钮退出后恢复焦点。
5. **旧样式清理**：删除已被 commit-log 日志替代的 `.log-bubble`、`.log-msg`、`.log-day` 等旧 CSS。
6. **响应式触控补齐**：三档视口检查发现桌面和平板仍有低于 44px 的按钮，已把 header、行动分类、行动工具、终端输入/关闭、反馈入口等可见交互目标补齐到 44px。

## 验证

- `npm ci`：通过，0 vulnerability。
- `npm run lint`：通过，0 error / 0 warning。
- `npm test`：13 files / 185 tests passed。
- `npm run build`：通过；首屏 `index` chunk 约 209KB，弹窗池仍为独立数据 chunk，`GameDialogs` 单独分包。
- `npm run simulate`：通过；同 seed 仍在 12 月触发 `realworld_cashflow_trap`，未触引擎语义。
- `npm run simulate:batch`：通过；`releaseGate.passed=true`，36 scenarios，success/balanced/failure 结局均覆盖，deterministicReplayRate=1。
- `git diff --check`：通过。
- 三档视口 Playwright 检查：
  - 390x844、768x1024、1280x900 均无横向溢出。
  - 可见 `button/a/input/select` 无低于 44px 的触控目标。
  - 商店与反馈弹窗均完整落在视口内，具备滚动区和关闭/提交入口。

## 踩坑与经验

- 全量测试用 `--maxWorkers=2` 时，`batchSimulation` 的 280 月模拟测试会因资源竞争超过 30s；原始 `npm test` 路径通过，单独跑该测试约 18s。不要把这个误判成断言失败。
- 仓库自带 `src\tests\node-shims.d.ts` 只声明了 `readFileSync`。契约测试新增 fs API 时必须同步补 shim，否则 vitest 绿但 `tsc -b` 会失败。
- 视口检查必须基于最新 `npm run build` 后的 preview；源码 CSS 改完但未 rebuild 时，预览服务仍会返回旧 dist 资产。

## 遗留与下一批预告

- `src\types\game.ts` 仍超过 500 行，但它不是组件文件；本批次未触碰类型体系，后续如改玩法结构再单独拆类型。
- 下一批进入 **结局 Postmortem + 战报卡片**：把当前单薄结局弹窗升级为人生复盘报告，并提供可保存分享 PNG。
