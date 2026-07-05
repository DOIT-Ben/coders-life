# 2026-07-04 批次 4 人生脚本 DSL 复盘

- 规划：`docs\plans\2026-07-04-batch4-life-script-dsl-plan.md`
- 分支：`feat/v6-life-script-dsl`
- 基线：`plan/v6-life-script-dsl` / `cee65246d9914ceb76d94ea806d8a83675abc429`

## 做了什么

1. **受限 DSL parser**：新增 `lifeScriptDsl`，支持 `当 条件 则 行动`、`否则 行动`、`并且`、`或者`、多行动列表；条件和行动均白名单解析，不使用 `eval` / `Function`。
2. **真实月度计划执行器**：新增 `lifeScriptExecutor`，脚本只产出 action id，仍通过 `canExecuteAction`、`buildMonthlyPlan` 和真实预算/槽位筛选。
3. **跑局系统**：新增 `lifeScriptRunner`，逐月处理 pending event choice，再调用 `planMonth`；非法脚本返回中文错误，连续不推进会停止。
4. **游戏内入口**：头部新增“脚本”，弹窗可编辑脚本、查看解析结果、跑 12 个月或最多 280 个月，并展示最近回放摘要。
5. **批量模拟矩阵**：新增 4 个脚本预设，CLI 默认 `simulate:batch` 同时跑 auto strategies 和 life script strategies；releaseGate 记录脚本矩阵成功/平衡/失败覆盖。
6. **结局优先级修正**：关系达标时 `connected_survivor` 优先于技术路结局，避免关系路线被 AI 技术路抢先吞掉。

## 已完成验证

- 基线 `npm test`：18 files / 207 tests passed。
- `npm test -- src/tests/lifeScriptRunner.test.ts src/tests/lifeScriptExecutor.test.ts src/tests/lifeScriptDsl.test.ts`：3 files / 13 tests passed。
- `npm test -- src/tests/lifeScriptUi.test.ts src/tests/lifeScriptRunner.test.ts src/tests/lifeScriptExecutor.test.ts src/tests/lifeScriptDsl.test.ts src/tests/monthlyPlanUi.test.tsx src/tests/v1FrontendContract.test.ts`：6 files / 48 tests passed。
- `npm test -- src/tests/realworldEventsEndings.test.ts src/tests/batchSimulation.test.ts`：2 files / 40 tests passed。
- `npm run lint`：通过；0 error / 0 warning。
- `npm test`：22 files / 226 tests passed。
- `npm run build`：通过；首屏 `index` chunk 约 211KB，`saveManager`、`events` 和弹窗池数据仍独立分包。
- `npm run simulate`：通过；同 seed 12 月触发 `realworld_cashflow_trap`。
- `STRATEGIES=none LIFE_SCRIPT_STRATEGIES=cashflow_first,health_first,ai_transition,relationship_first CAREERS=frontend,backend,ai_product CITIES=tier1,tier2,tier3 npm run simulate:batch`：通过；36 scenarios，脚本矩阵覆盖 `ai_architect`、`connected_survivor`、`burnout`，`releaseGate.passed=true`。
- `npm run simulate:batch`：通过；72 scenarios，`releaseGate.passed=true`，lifeScriptStrategies 覆盖 success / balanced / failure，`none=0`。
- `git diff --check`：通过。
- 三档视口 Chromium/CDP 检查：
  - 390x844、768x1024、1280x900 均无横向溢出。
  - 可见 `button/a/input/select/textarea` 无低于 44px 的触控目标。
  - “人生脚本”弹窗、关闭按钮和“跑 12 个月”按钮均完整位于视口内。

## 用户可见层审计

- 脚本错误全部为中文产品化提示，不暴露 JS 异常、堆栈或内部状态。
- “脚本”属于游戏功能，放在游戏头部；反馈入口仍保持独立悬浮，不混入游戏功能按钮。
- 弹窗主体使用 `modal-scroll` 和 `dvh` 高度约束，按钮留在固定 actions 区域。
- DSL 示例只展示真实行动名；行动效果仍由实际月度循环决定。

## 风险与后续

- 默认 `simulate:batch` 增加到 72 条轨迹，耗时明显变长；如后续 CI 超时，应优化模拟执行路径，不能减少 releaseGate 覆盖。
- DSL 仍然是白名单规则系统，不支持任意 JS、函数、变量赋值或对象路径访问。
- 当前 UI 是文本编辑为主，后续可做表单化规则编辑，但必须继续复用同一 parser 和执行器。
