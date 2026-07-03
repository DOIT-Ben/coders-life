# 批次 2：结局 Postmortem 与战报卡片实施细案

- 日期：2026-07-04
- 分支：`feat/v6-ending-postmortem-share-card`
- 基线：`master` / `45d26430bea9c5f43bfd44b3cafc076801b1fafa`
- 范围：只实现路线图批次 2，不进入每日挑战、人生脚本 DSL、数值平衡调参或玩法规则改动。

## 一、第一性原理：当前阶段核心需求

终端化外壳和工程清债已经完成，下一步要解决的是结局后的留存和传播问题。当前结局弹窗只有少量终局数值、结局文案和最多 3 个转折点，玩家很难回答两件事：

1. 这局为什么走到这个结局。
2. 这局有什么值得截图分享。

批次 2 的核心目标不是新增玩法，而是把已有游戏过程数据重新组织成“人生事故复盘报告”和“终端风战报 PNG”。所有内容必须来自现有 `GameState`：`logs`、`turningPoints`、`decisionLog`、终局 `stats`、`career`、`finance`、`healthProfile`、`crisis`、`endingId`。不新增后端，不新增运行时依赖，不改变结局触发条件。

成功标准：

- 失败、平衡、成功三类结局都能渲染结构化复盘：时间线、根因、影响面、改进项。
- 战报卡片能在浏览器中生成 PNG，移动端可通过长按图片保存，桌面端可下载。
- UI 文案是中文产品化表达，不泄漏内部字段名、调试词或实现细节。
- 首屏 chunk 不静态 import `saveManager` 或 `config/events`；`GameDialogs` 仍作为 lazy chunk。

## 二、调研：成熟方法与可复用方案

1. **SRE Postmortem 结构已被工程团队验证**  
   Google SRE 的 postmortem 文化强调无责复盘、事实时间线、根因分析和可执行 action items。参考：
   - https://sre.google/workbook/postmortem-culture/
   - https://sre.google/sre-book/postmortem-culture/
   - https://research.google/pubs/postmortem-action-items-plan-the-work-and-work-the-plan/

2. **Canvas 导出 PNG 是浏览器原生能力**  
   MDN 文档说明 `HTMLCanvasElement.toDataURL()` 可返回指定格式的数据 URL，默认或不支持格式时返回 PNG。参考：
   - https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL

3. **本项目已有可复用数据**  
   - `turningPoints` 已记录健康债、现金流压力、职业风险、关系债首次越过 70 的关键节点。
   - `decisionLog` 已记录最近行动的收益、代价和风险提示。
   - `logs` 最后一条 ending log 已含结局标题与正文。
   - `ENDINGS` 已有 category，可区分失败、普通/平衡、技术/资本/隐藏成功方向。

## 三、复用、适配与自研边界

| 模块 | 决策 | 理由 |
|---|---|---|
| 复盘数据生成 | 自研纯函数，复用 `GameState` | 避免 UI 中堆业务判断，测试三类结局更稳定 |
| 时间线 | 复用 `turningPoints`，不足时补最近关键 `decisionLog` | 保证真实来自玩家路径，不伪造剧情 |
| 根因分析 | 适配终局压力、结局类别和最近决策 | 用可解释规则生成人话摘要，不改引擎 |
| 影响面 | 复用终局数值与开局近似基线 | 展示现金、健康、精神、关系、AI/技术、职业状态 |
| 改进项 | 自研建议模板，按主要问题选择 3 条 | 保持中文产品化，不暴露内部公式 |
| 战报卡片 | 原生 Canvas 自绘 | 零依赖、体积可控、可测试生成 data URL |
| 下载/保存 | 桌面提供下载按钮，移动端展示 PNG 预览 | 移动浏览器保存图片常依赖长按，按钮文案需准确 |

## 四、落地方案

### 任务 1：复盘数据模型与纯函数

**新增文件**

- `src\systems\endingPostmortemSystem.ts`
- `src\tests\endingPostmortem.test.ts`

**实现内容**

- 定义 `EndingPostmortem`、`PostmortemTimelineItem`、`PostmortemImpactItem`、`PostmortemActionItem`。
- `buildEndingPostmortem(state: GameState): EndingPostmortem`：
  - `category`：把 `fail` 归为失败，把 `tech/capital/hidden` 归为成功，把 `normal/balance` 归为平衡。
  - `headline`：来自最后一条 ending log 标题，缺失时用“人生复盘报告”。
  - `summary`：来自 ending log 正文，去除过长内容后保留中文摘要。
  - `timeline`：优先取最近 4 个 `turningPoints`；不足时用最近 4 条 `decisionLog` 补齐。
  - `rootCauses`：按现金流、健康债、燃尽、职业风险、关系债、能力成长不足等真实终局状态排序取 3 条。
  - `impact`：展示生存月份、现金、健康、精神、关系、技术、AI、职业状态、成就数量。
  - `actionItems`：按 root cause 生成下一局建议，失败局偏止血，平衡局偏突破，成功局偏复盘可复制路径。
  - `shareHash`：用 seed、month、endingId 和关键数值生成稳定短哈希。

**测试**

- 失败结局：构造含现金流/健康/燃尽压力的终局，断言输出 category 为 `failure`，含时间线、根因、影响面、改进项。
- 平衡结局：构造 `ordinary_tool` 终局，断言输出 category 为 `balanced`，改进项不是失败止血口吻。
- 成功结局：构造 `ai_architect` 或 `capital_free` 终局，断言输出 category 为 `success`，战报短哈希稳定。
- 断言所有输出文案不包含裸内部字段名：`endingId`、`healthDebt`、`cashflowStress`、`decisionLog`。

**提交**

`feat: 生成结局复盘数据 | v0.1.0 | 2026-07-04`

### 任务 2：重构结局弹窗为人生复盘报告

**修改文件**

- `src\components\GameDialogs.tsx`
- `src\components\dialogs\EndingDialog.tsx`
- `src\styles\app.css`
- `src\tests\v1FrontendContract.test.ts`
- `src\tests\endingDialog.test.tsx`

**实现内容**

- 将 `EndingDialog` 从 `GameDialogs.tsx` 拆到 `components\dialogs`，保持 `GameDialogs` lazy 聚合入口。
- 结局弹窗改为四段：
  - 事故时间线
  - 根因分析
  - 影响面
  - 下一局改进项
- 弹窗高度沿用 `ModalShell` 与 `.modal-scroll`，确保移动端可滚动、关闭按钮和底部行动始终可达。
- 保留“重新开始”和“查看结果”按钮，不改变游戏状态。

**测试**

- 用 React Testing Library 渲染失败/平衡/成功三类终局，断言四段标题和关键数据均出现。
- 契约测试迁移 `EndingDialog` 源码断言，防止 `GameDialogs.tsx` 回到大文件。

**提交**

`feat: 重构结局复盘弹窗 | v0.1.0 | 2026-07-04`

### 任务 3：Canvas 战报卡片

**新增文件**

- `src\systems\shareCardSystem.ts`
- `src\tests\shareCard.test.ts`

**修改文件**

- `src\components\dialogs\EndingDialog.tsx`
- `src\styles\app.css`

**实现内容**

- `drawEndingShareCard(canvas, postmortem)`：绘制 1080x1440 终端风竖版卡片，包含：
  - 产品名“程序员人生模拟器”
  - 结局标题与类别标签
  - 生存月份、最终现金、AI/技术、健康/精神
  - 3 条关键根因或转折点
  - `#短哈希`
- `createEndingShareImage(postmortem)`：创建离屏 canvas，返回 PNG data URL。
- 弹窗中提供“生成战报”按钮；生成后展示 `<img alt="本局战报卡片">`。
- 桌面端提供“下载 PNG”；移动端提示“长按图片保存”。
- Canvas 文本换行用自研 `wrapCanvasText`，不引入依赖。

**测试**

- mock canvas context，断言绘制函数调用了核心文本。
- 断言 `createEndingShareImage` 返回 `data:image/png` 前缀。
- UI 测试点击“生成战报”后出现图片、下载链接和移动保存提示。

**提交**

`feat: 生成结局战报卡片 | v0.1.0 | 2026-07-04`

### 任务 4：验证、用户可见层审计与复盘

**修改文件**

- `docs\dev-records\2026-07-04-batch2-ending-postmortem-share-card.md`
- `workbench\readme.md`
- `workbench\known-pitfalls.md`

**验证命令**

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run simulate`
- `npm run simulate:batch`
- `git diff --check`

**视口实测**

- 390x844：结局弹窗可滚动，关闭/重新开始/生成战报可达，战报图不横向溢出。
- 768x1024：四段复盘排版不拥挤，图片预览比例稳定。
- 1280x900：弹窗宽度不过度拉伸，Canvas 下载入口清晰。

**用户可见层审计**

- 无英文异常、堆栈、内部字段名或调试词。
- 所有按钮文案与真实效果一致：生成、下载、长按保存。
- 复盘内容来自真实状态，不编造不存在的行动或转折点。

**提交**

`docs: 记录批次2复盘与验证 | v0.1.0 | 2026-07-04`

## 风险与控制

| 风险 | 控制 |
|---|---|
| 复盘文案看起来像伪造剧情 | 所有 timeline/root cause 均由 `GameState` 派生，测试覆盖无转折点 fallback |
| Canvas 在 jsdom 不完整 | 绘制层拆纯函数，测试 mock context；浏览器视口验收检查真实图片 |
| 移动端弹窗再次过长不可关闭 | 继续复用 `ModalShell` + `.modal-scroll`，Playwright 三档视口扫关闭按钮和滚动区 |
| 首屏 chunk 被污染 | `EndingDialog` 仍经 `GameDialogs` lazy 加载；不静态 import `saveManager` / `config/events` |
| 文件重新超 500 行 | `EndingDialog`、postmortem system、share card system 分文件；提交前 `wc -l` 检查 |

## 不做事项

- 不调整结局触发条件。
- 不调整数值平衡。
- 不新增后端、账号、排行榜或分享上传。
- 不启动每日挑战。
- 不启动人生脚本 DSL。
