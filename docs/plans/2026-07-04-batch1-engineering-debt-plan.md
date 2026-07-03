# 批次 1 工程清债实施细案

- 日期：2026-07-04
- 分支：`chore/v6-frontend-roadmap-batch1`
- 基线：`2d907b3 docs: 前端经验沉淀技能与演进规划报告 | v0.1.0 | 2026-07-04`
- 对应路线图：`docs\plans\2026-07-04-frontend-roadmap.md`
- 范围：只处理批次 1 工程清债，不进入结局 Postmortem、战报卡片、每日挑战或人生脚本。

## 一、第一性原理：当前阶段核心需求

下一阶段要做结局复盘、分享卡片、每日挑战和脚本玩法，都会继续压在前端体验层上。现在必须先清掉结构债，否则后续每个功能都会在大文件、lint 降级和死代码里放大回归面。

批次 1 的核心需求不是“看起来更好”，而是把前端工程恢复到可持续演进状态：

1. 低频弹窗从 `GameDialogs.tsx` 拆开，任何单个组件文件不超过 500 行。
2. `npm run lint` 达到 0 error / 0 warning，并把 `react-hooks/set-state-in-effect` 从 `warn` 升回 `error`。
3. 删除 6 个未引用旧组件，避免契约测试继续依赖死代码。
4. 命令面板具备真正的焦点圈闭，打开后键盘不会跑到背后页面。

当前审计事实：

- `src\components\GameDialogs.tsx` 589 行，超过 500 行阈值。
- `src\types\game.ts` 567 行，但本批次不触碰类型体系；先记录为后续专项债务，避免与弹窗拆分混做。
- `npm run lint` 当前 0 error / 4 warning：
  - `GameContainer.tsx:108`：gameOver effect 内同步 `setModal('ending')`。
  - `GameContainer.tsx:125`：`availableActions` 的 `useMemo` 依赖缺 `state`。
  - `GameContainer.tsx:196`：`actions` 的 `useMemo` 依赖缺 `state`。
  - `GameContainer.tsx:225`：visible action group effect 内同步 `setSelectedActionGroup`。
- 6 个死组件仍在：`WorldStatusBar.tsx`、`DebugPanel.tsx`、`StatPanel.tsx`、`ActionPanel.tsx`、`ShopModal.tsx`、`AchievementModal.tsx`。
- `CommandPalette.tsx` 目前打开后只聚焦输入框，未做 Tab/Shift+Tab 焦点圈闭。

## 二、行业验证与可复用方案

本批次不新增运行时依赖。采用 React 官方推荐的“不要用 effect 派生 state”思路：能从 props/state 计算的值在 render 阶段派生；只有同步外部系统的逻辑留在 effect。焦点圈闭采用常见 modal/dialog 模式：打开时记录焦点、聚焦首个可交互控件、Tab 在容器内循环、Escape 关闭、关闭后恢复原焦点。

仓库内可复用资产：

- `src\components\GameDialogs.tsx` 的 `ModalShell` 已具备 `role="dialog"`、`aria-modal`、命名 close 按钮和 Escape 关闭，是拆分后共享 shell 的基础。
- `src\tests\v1FrontendContract.test.ts` 已用 `?raw` 保护弹窗分包、反馈入口、可访问性语义；拆分时同步迁移断言，而不是删除。
- `.claude\skills\frontend-design-lessons\SKILL.md` 规定：超 500 行先拆再加、移动代码同提交迁移契约测试。
- `.claude\skills\frontend-review\SKILL.md` 规定：UI 改动合入前必须跑 lint、测试、build、响应式与用户可见层审计。

结论：

- **复用**：保留 `ModalShell` 行为，迁到 `src\components\dialogs\ModalShell.tsx`。
- **适配**：把现有对话框按职责拆到 `src\components\dialogs\`，入口 `GameDialogs.tsx` 只保留调度。
- **自研**：命令面板焦点圈闭用少量本地代码实现，不引入 focus-trap 依赖。

## 三、当前项目适配方式

### 拆分边界

`src\components\GameDialogs.tsx` 拆为：

- `src\components\dialogs\ModalShell.tsx`：共享弹窗外壳、Escape、初始聚焦。
- `src\components\dialogs\dialogUtils.tsx`：`ACTION_GROUP_MAP`、效果 chip 渲染、成就进度等纯工具。
- `src\components\dialogs\FeedbackDialog.tsx`
- `src\components\dialogs\AchievementDialog.tsx`
- `src\components\dialogs\ShopDialog.tsx`
- `src\components\dialogs\ActionDetailDialog.tsx`
- `src\components\dialogs\ActionManageDialog.tsx`
- `src\components\dialogs\EventChoiceDialog.tsx`
- `src\components\dialogs\EndingDialog.tsx`
- `src\components\dialogs\BookmarkDialog.tsx`

`GameDialogs.tsx` 保留默认导出和 props 接口，继续作为 lazy chunk 入口，避免改动 `GameContainer.tsx` 的低频分包策略。

### lint 修复策略

- `gameOver` 弹窗：不再用 effect 同步设置 modal。render 阶段派生 `effectiveModal = modal ?? (state.gameOver ? 'ending' : undefined)`，关闭结局弹窗时保留现有 `closeModal` 语义。
- `availableActions` 和 `actions`：先移除无收益的 `useMemo` 或改成完整 `[state]` 依赖；优先移除，因为 `getAvailableActions(state)` 已在每次渲染需要最新状态，当前细碎依赖反而产生假安全。
- 行动分类回退：不在 effect 里同步 `selectedActionGroup`。使用 `effectiveSelectedActionGroup = visibleActionGroupIds.includes(selectedActionGroup) ? selectedActionGroup : visibleActionGroupIds[0] ?? DEFAULT_ACTION_GROUP`，按钮点击时再更新真实 state。
- `eslint.config.js`：warning 清零后把 `react-hooks/set-state-in-effect` 升为 `error`，删除过期注释。

### 死代码清理策略

删除 6 个未引用旧组件文件，并修改 `v1FrontendContract.test.ts`：

- 不再读取 `WorldStatusBar.tsx`、`DebugPanel.tsx`。
- 旧 AI 替代指标断言迁移到当前真实 UI 源：`panels.tsx`、`GameContainer.tsx` 或相关系统源码。
- 保留“用户可见层不暴露 AI 重构 / legacy aiReplacement”的等价保护。

### 命令面板焦点圈闭

`CommandPalette.tsx` 增加：

- 打开前记录 `document.activeElement`。
- 打开时聚焦输入框。
- `Tab` / `Shift+Tab` 在 `.term-panel` 内可聚焦元素中循环。
- `Escape` 关闭并恢复原焦点。
- 测试覆盖打开、Tab 循环、Escape 关闭。

## 四、详细落地方案、风险和验证标准

### 任务 1：为批次 1 建立失败测试

新增或扩展测试：

- `src\tests\v1FrontendContract.test.ts`
  - 断言不再读取或依赖 6 个死组件文件。
  - 断言 `GameDialogs.tsx` 保持 lazy chunk 调度，具体对话框来自 `components\dialogs`。
  - 断言没有组件源文件超过 500 行（本批次先排除 `src\types\game.ts`，因为它不是组件文件）。
  - 断言 `eslint.config.js` 中 `react-hooks/set-state-in-effect` 为 `error`。
- `src\tests\commandPalette.test.tsx`
  - 打开人生终端后输入框获得焦点。
  - Tab 从最后一个可聚焦元素回到第一个，Shift+Tab 从第一个回到最后一个。
  - Escape 关闭后焦点回到打开按钮。

先运行目标测试，确认按预期失败，再改实现。

### 任务 2：拆分 `GameDialogs`

小步迁移：

1. 先迁 `ModalShell` 和纯工具。
2. 迁 `FeedbackDialog`、`AchievementDialog`、`ShopDialog`。
3. 迁 `ActionDetailDialog`、`ActionManageDialog`、`EventChoiceDialog`。
4. 迁 `EndingDialog`、`BookmarkDialog`。
5. `GameDialogs.tsx` 仅保留调度入口。

每一步后跑：

```bash
npm test -- src/tests/v1FrontendContract.test.ts --maxWorkers=2
```

### 任务 3：清 lint warning 并收紧规则

修改 `GameContainer.tsx` 和 `eslint.config.js`，每次改完跑：

```bash
npm run lint
npm test -- src/tests/monthlyPlanUi.test.tsx src/tests/undoPill.test.ts --maxWorkers=2
```

### 任务 4：删除死组件

删除：

- `src\components\WorldStatusBar.tsx`
- `src\components\DebugPanel.tsx`
- `src\components\StatPanel.tsx`
- `src\components\ActionPanel.tsx`
- `src\components\ShopModal.tsx`
- `src\components\AchievementModal.tsx`

同步更新契约测试，不删除等价行为断言。

### 任务 5：命令面板焦点圈闭

用 `commandPalette.test.tsx` 红绿推进，不改变命令语义，不新增命令。

### 任务 6：批次验收

批次完成前执行：

```bash
npm run lint
npm test -- --maxWorkers=2
npm run build
npm run simulate
git diff --check
```

本批次不改引擎和模拟策略，`simulate:batch` 不是强制门禁；若拆分或 lint 修复触及引擎入口、数据加载或行动执行语义，再补跑：

```bash
npm run simulate:batch
```

三档视口检查：

- 390px：打开命令面板、商店、反馈、行动详情，确认无横向溢出、触控目标不低于 44px。
- 768px：检查行动列表滚动、命令面板焦点圈闭。
- 1280px：检查主布局、低频弹窗、命令面板。

用户可见层审计：

- 无英文异常、堆栈、内部标签。
- 对话框标题、按钮、命令反馈均为中文产品化表达。
- fixed 悬浮入口不遮挡主行动区。

### 风险与回滚

| 风险 | 缓解 |
|---|---|
| 弹窗拆分时遗漏 props 或循环 import | 保留 `GameDialogs` 聚合入口；每迁一个弹窗跑契约测试和 TS build。 |
| 契约测试误删保护 | 只迁移断言来源，不删除用户可见行为断言。 |
| lint 修复改变行动分类选择时序 | 用派生 `effectiveSelectedActionGroup` 替代 effect，同步跑 UI 测试。 |
| 焦点圈闭在 jsdom 和浏览器行为不同 | 测试覆盖键盘事件；浏览器三档视口手工验证。 |

回滚方式：每个子项独立 commit，若某一项回归，只 revert 对应 commit，不影响其他清债结果。
