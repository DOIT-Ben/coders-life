# 2026-07-04 批次 3 每日挑战复盘

- 规划：`docs\plans\2026-07-04-batch3-daily-challenge-plan.md`
- 分支：`feat/v6-daily-challenge`
- 基线：`master` / `75320fce0587924c3ca48d45cbc8f6f379343d95`
- 提交：
  - `5f6f48f`：批次 3 每日挑战实施细案
  - `57af466`：每日挑战 seed、状态创建、历史和排行榜接口
  - `d3f2f49`：今日人生入口与挑战模式接线
  - `49ff874`：每日挑战结局记录、保存隔离和战报日期

## 做了什么

1. **每日挑战 seed**：新增 `dailyChallengeSystem`，用 UTC 日期键生成稳定 seed，同一 UTC 日期同 seed，不同日期切换 seed。
2. **今日人生入口**：启动页新增“今日人生”入口，复用现有职业、城市和价值优先级选择；普通“开始生存”和“继续上次生存”保持原逻辑。
3. **存档隔离**：挑战局 `autosave=false`，不会覆盖普通存档；挑战内点击“保存”给中文提示，结局写入挑战历史。
4. **本地 30 天历史**：新增挑战历史读写，按日期去重覆盖，倒序保留 30 条；损坏 JSON 安全回空。
5. **战报接线**：结局复盘和 Canvas 战报卡展示 `今日人生 · YYYY-MM-DD` 日期标签。
6. **排行榜边界**：保留 `getDailyChallengeLeaderboard()` 接口 stub，返回 unavailable，不渲染假排行榜 UI。

## 验证

- `npm ci`：通过；0 vulnerability。
- `npm run lint`：通过；0 error / 0 warning。
- `npm test`：18 files / 207 tests passed。
- `npm run build`：通过；首屏 `index` chunk 约 211KB，`saveManager`、`events` 和弹窗池数据仍独立分包。
- `npm run simulate`：通过；同 seed 仍在第 12 月触发 `realworld_cashflow_trap`，未触引擎语义。
- `npm run simulate:batch`：通过；36 scenarios，`releaseGate.passed=true`，成功/平衡/失败结局均覆盖，`deterministicReplayRate=1`。
- `git diff --check`：通过。
- 三档视口 Playwright 检查：
  - 390x844、768x1024、1280x900 均无横向溢出。
  - 可见 `button/a/input/select` 无低于 44px 的触控目标。
  - 今日人生入口、游戏内今日标识和行动面板均可见。

## 用户可见层审计

- 启动页和游戏内文案没有暴露 `seed`、`localStorage`、`stub`、内部存储 key 或调试词。
- “今日人生”不暗示有服务器排名；排行榜只保留代码接口，没有假 UI。
- 挑战局保存提示明确不会覆盖普通存档，结局后通过本地历史形成连续记录。
- 战报卡日期标签来自真实挑战日期，不影响普通局战报。

## 踩坑与经验

- `dailyChallengeSystem` 必须保持轻量。App 首屏可以静态 import 日期/历史函数，但不能把 `createInitialState`、引擎或事件池拉进首屏；挑战状态创建拆到 `dailyChallengeStateSystem`。
- `GameContainer` 加功能很容易再次超过 500 行。本批次将结局记录提到 `dailyChallengeResultSystem` 后压回 499 行，后续触碰该文件应优先继续拆分。
- Playwright `getByText('第 0 天')` 会同时命中头部和时间线，视口脚本应定位结构元素而不是模糊文本。

## 遗留与下一批预告

- 每日挑战纯本地，不防本地改系统时间；没有后端排行榜时不构成收益问题。
- 下一批进入 **人生脚本 DSL**。这是最高风险批次，开工前必须单独出实施细案并等待确认；不得直接实现。
