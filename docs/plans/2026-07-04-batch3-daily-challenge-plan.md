# 批次 3：每日挑战实施细案

- 日期：2026-07-04
- 分支：`feat/v6-daily-challenge`
- 基线：`master` / `75320fce0587924c3ca48d45cbc8f6f379343d95`
- 范围：只实现路线图批次 3，不进入人生脚本 DSL、排行榜后端、账号系统、数值平衡调参或付费设计。

## 一、第一性原理：当前阶段核心需求

批次 1 已清掉工程债，批次 2 已把结局变成可复盘、可截图的分享物。批次 3 的核心命题是“玩家明天为什么还来”。每日挑战要提供一个低成本回访理由：

1. **同一天有同一个开局种子**：玩家可以说“今天这局你怎么玩”，形成可比较的共同话题。
2. **结束后能晒**：复用批次 2 战报卡，但加上“今日人生”的日期语境。
3. **本地历史形成连续感**：不做账号和后端，也能让玩家看到近 30 天自己来过、玩过、结果如何。

本批次不改变核心玩法公式。每日挑战只是特殊入口：日期派生 seed，仍使用现有 `createInitialState`、行动系统、结局系统、复盘系统和 Canvas 战报。

## 二、调研与可复用方法

现有项目已经具备每日挑战所需的核心基础：

- `createInitialState(track, cityTier, seed, values)` 支持外部传入 seed。
- 引擎行动、月结、事件和批量模拟已有确定性回放验证。
- 批次 2 的 `buildEndingPostmortem` 与 `createEndingShareImage` 已能从终局状态生成战报。
- App 首屏已经把 `GameContainer` lazy 分包，必须继续避免静态 import `saveManager` / `config/events`。

成熟方法上，本批次复用 Wordle 式“日期派生全员同题”的产品结构，但不做排行榜，因为项目明确要求纯本地零后端。为了满足“全球同局”，挑战日期使用 **UTC 日期键 `YYYY-MM-DD`**；这样不同地区在同一 UTC 日拿到同一个 seed。纯本地版本不防系统时间作弊，因为没有排行榜和奖励收益。

## 三、复用、适配与自研边界

| 模块 | 决策 | 理由 |
|---|---|---|
| 每日 seed | 自研 FNV-1a 哈希，输入 `coders-life-daily-v1|YYYY-MM-DD` | 零依赖，结果稳定，测试可注入日期 |
| 今日入口 | 适配现有职业/城市/价值选择页 | 玩家仍可选择画像；挑战只固定 seed |
| 普通存档 | 不覆盖 | 每日挑战不应污染“继续上次生存” |
| 挑战历史 | 自研 localStorage 30 天环形历史 | 纯本地，无后端 |
| 战报卡 | 复用批次 2，增加挑战日期标签 | 保持传播物一致 |
| 排行榜 | 只留类型和接口 stub，不显示假排行榜 | 满足后续后端接入边界，避免假功能 |

## 四、落地方案

### 任务 1：每日挑战纯函数与历史存储

**新增文件**

- `src\systems\dailyChallengeSystem.ts`
- `src\tests\dailyChallenge.test.ts`

**实现内容**

- `getDailyChallenge(date = new Date())`：
  - 使用 UTC 日期生成 `dateKey`。
  - 用稳定哈希生成 `seed`，范围保持在 `1..999999`。
  - 返回中文标签，如 `今日人生 · 2026-07-04`。
- `createDailyChallengeState(track, cityTier, values, date)`：
  - 调用 `createInitialState(track, cityTier, seed, values)`。
  - 写入一条中文开局日志，说明这是今日挑战，不改玩法数值。
- `recordDailyChallengeResult(result, storage)`：
  - 按 `dateKey` 去重覆盖同日结果。
  - 按日期倒序保留 30 条。
- `readDailyChallengeHistory(storage)`：
  - 容错读取损坏 JSON，损坏时返回空数组。
- `getDailyChallengeLeaderboard(challenge)`：
  - 返回 `{ available: false, entries: [] }` 的接口 stub，不进入 UI 假展示。

**测试**

- 同一 UTC 日期生成相同 seed，不同日期生成不同 seed。
- 同一日期、同一职业/城市/价值、同一行动序列产生一致终局核心状态。
- 历史写入同日覆盖、超过 30 条时截断、损坏存储安全回空。

**提交**

`feat: 生成每日挑战种子与历史 | v0.1.0 | 2026-07-04`

### 任务 2：启动页接入“今日人生”入口

**修改文件**

- `src\App.tsx`
- `src\styles\app.css`
- `src\tests\dailyChallengeUi.test.tsx`
- `src\tests\v1FrontendContract.test.ts`

**实现内容**

- `GameConfig` 增加 `mode`：
  - 普通局：`{ type: 'normal' }`
  - 今日挑战：`{ type: 'daily', challenge }`
- 启动页职业/城市/价值选择区下方新增“今日人生”入口：
  - 主按钮：`今日人生`
  - 辅助信息：显示今日挑战日期和“同一天同种子”说明。
  - 历史摘要：显示最近 30 天内最近 3 条本地结果。
- `startDailyChallenge()`：
  - 用当前职业/城市/价值和今日 seed 创建 `GameContainer`。
  - 不修改普通 `savedState`。
- 普通“开始生存”保持现状。

**测试**

- 页面出现“今日人生”和今日 UTC 日期。
- 点击今日入口后进入第 0 天游戏，并显示今日挑战标识。
- 普通存档存在时，点击今日入口不删除、不覆盖“继续上次生存”。
- 契约测试断言首屏没有静态 import `saveManager` / `config/events`，并锁定每日挑战入口文案。

**提交**

`feat: 接入今日人生入口 | v0.1.0 | 2026-07-04`

### 任务 3：结局记录历史并接入战报日期

**修改文件**

- `src\components\GameContainer.tsx`
- `src\components\dialogs\EndingDialog.tsx`
- `src\systems\endingPostmortemSystem.ts`
- `src\systems\shareCardSystem.ts`
- `src\tests\endingDialog.test.tsx`
- `src\tests\shareCard.test.ts`

**实现内容**

- `GameContainer` 接收 `dailyChallenge?: DailyChallenge` 和 `autosave?: boolean`：
  - 普通局 `autosave=true`。
  - 今日挑战 `autosave=false`，避免覆盖普通存档。
- 今日挑战结局时记录本地历史：
  - `dateKey`、`seed`、结局标题、`endingId`、月份、最终现金、复盘类别、短哈希。
  - 使用 ref 防止同一个结局重复写入。
- `EndingDialog` 接收 `challengeLabel`：
  - 复盘 Hero 展示 `今日人生 · YYYY-MM-DD`。
  - 战报卡绘制同样展示日期标签。

**测试**

- 今日挑战结局后写入历史；同一结局重复渲染不重复写。
- 战报 Canvas 绘制包含日期标签。
- 今日挑战下“保存”按钮给出中文提示，不覆盖普通存档。

**提交**

`feat: 记录每日挑战结局 | v0.1.0 | 2026-07-04`

### 任务 4：验证、视口审计与复盘

**修改文件**

- `docs\dev-records\2026-07-04-batch3-daily-challenge.md`
- `workbench\readme.md`
- `workbench\known-pitfalls.md`

**验证命令**

- `npm ci`
- `npm run lint`
- `npm test`
- `npm run build`
- `npm run simulate`
- `npm run simulate:batch`
- `git diff --check`

**视口实测**

- 390x844：今日人生入口、历史摘要、职业选择和价值选择无横向溢出，按钮不低于 44px。
- 768x1024：入口与普通开始按钮层级清楚。
- 1280x900：启动页信息密度稳定，今日挑战不挤压职业卡。

**用户可见层审计**

- 不出现“seed/hash/localStorage/stub”等内部词。
- 排行榜不显示假功能。
- 每日挑战文案明确“同一天同种子”，不暗示有服务器排名。
- 战报保存说明仍与真实行为一致。

**提交**

`docs: 记录批次3复盘与验证 | v0.1.0 | 2026-07-04`

## 风险与控制

| 风险 | 控制 |
|---|---|
| 今日挑战覆盖普通存档 | `autosave=false`，历史单独存储 |
| “全球同局”与本地时区冲突 | 使用 UTC 日期键，并在文案中避免承诺本地午夜刷新 |
| 首屏 chunk 污染 | `dailyChallengeSystem` 不 import `saveManager` 或 `config/events`；存档继续动态 import |
| 历史数据损坏导致白屏 | 读取时捕获 JSON 错误，返回空历史 |
| 假排行榜误导用户 | 只留接口类型，不渲染排行榜 UI |
| 同局结局重复写历史 | 结局写入用 `dateKey + endingId + month + shareHash` 防重复 |

## 不做事项

- 不做后端排行榜、账号、上传分享。
- 不防本地改系统时间。
- 不改行动、结局、数值、事件概率。
- 不进入批次 4 人生脚本 DSL。
