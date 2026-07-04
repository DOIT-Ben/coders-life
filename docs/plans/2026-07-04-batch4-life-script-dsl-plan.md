# 批次 4：人生脚本 DSL 实施细案

- 日期：2026-07-04
- 分支：`plan/v6-life-script-dsl`
- 基线：`master` / `90a36e3c9e543a9467bc6392534bbbf96f2a54c9`
- 状态：**规划范围已按董事长意见调整：不设置额外产品表达限制；安全白名单和真实玩法执行边界保持不变。**
- 范围：人生脚本 DSL、脚本策略执行、挂机跑局、加速回放、批量模拟脚本矩阵。不得新增后端、账号、付费或任意 JS 执行能力。

## 一、第一性原理：当前阶段核心需求

前三批已经完成工程清债、结局复盘/战报、每日挑战。批次 4 的目标是把“程序员愿意晒”升级成“程序员愿意调策略”：玩家不只是点行动，而是写一套受限规则，让系统按规则跑完一局，再回看这套人生策略如何失败、平衡或成功。

核心需求有四个：

1. **表达力够用**：能表达“精神低就恢复”“有 offer 就接受”“现金流紧张就赚钱”“稳定后补 AI/作品”等策略。
2. **安全边界硬**：脚本不能是 JavaScript，不能 `eval`，不能访问浏览器、网络、存档或任意对象。
3. **复用真实玩法**：脚本只能选择真实可用行动，执行仍走 `planMonth`、`canExecuteAction`、事件选择和结局系统。
4. **可验证**：脚本策略必须进入批量模拟矩阵，releaseGate 通过后才算交付。

本批次不是“让玩家写代码控制游戏”。它是一个受限规则系统，目标是制造策略分享和回放乐趣，同时不打开安全洞。

## 二、调研与可复用方案

外部依据：

- MDN `eval()` 文档明确把字符串动态执行列为 injection sink，并说明直接 `eval` 会以调用方权限运行代码，还会带来性能和优化问题：`https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval`
- OWASP Code Injection 把未受控输入进入解释器/执行器视为代码注入风险：`https://owasp.org/www-community/attacks/Code_Injection`
- MDN structured clone 说明了浏览器中可安全复制/传递的数据形态，适合回放快照和 worker 边界设计：`https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm`

项目内可复用基础：

- `autoChoiceSystem.chooseMonthlyPlanForStrategy` 已有策略选择模式，可复用“候选行动 → `canExecuteAction` → `buildMonthlyPlan` → 不超预算”的执行思路。
- `planMonth` 已经真实执行月度多行动、冷却、事件、项目进度和结局。
- `simulateBatch` 已有策略矩阵、确定性回放和 releaseGate。
- 批次 2/3 的复盘、战报、每日 seed 可直接承接脚本跑局结果。

结论：**自研受限 DSL parser + 复用 autoChoiceSystem 执行模式 + 扩展 batch simulation**。不引入外部 parser 依赖，不使用 `eval` / `Function` / WebAssembly / iframe 沙箱。

## 三、DSL 能力范围（确认版）

### 语法

玩家可写多行规则：

```text
当 精神 < 35 则 睡眠修复
当 健康 < 40 则 运动
当 当前offer 可用 则 接受offer
当 现金 < 50000 则 正常上班
当 AI协作 < 60 并且 现金 > 20000 则 AI工具训练
当 待业 并且 当前面试 可用 则 参加面试
当 健康 < 60 或者 燃尽 > 70 则 睡眠修复
否则 系统学习
```

### 条件白名单

第一版只允许这些条件字段：

- 数值：`精神`、`健康`、`燃尽`、`现金`、`技术`、`AI协作`、`关系`、`月份`、`年龄`、`现金流压力`、`职业风险`、`健康债`
- 状态：`在职`、`待业`、`当前面试 可用`、`当前offer 可用`、`危机中`
- 比较：`<`、`<=`、`>`、`>=`、`=`、`!=`

### 动作白名单

动作必须映射到真实 `ACTIONS`：

- 文本使用用户可见行动名，如 `睡眠修复`、`系统学习`。
- parser 输出真实 action id，如 `sleep_repair`、`system_learning`。
- 执行时再次通过 `canExecuteAction`，不可用则跳过该规则。

### 组合与边界

- 支持 `并且`、`或者` 组合条件，按括号缺省的左到右顺序解析；第一版不引入用户自定义变量。
- `则` 后允许写一个或多个真实行动名，多个行动用 `、` 或 `，` 分隔；执行器按顺序尝试加入月度计划。
- 从上到下匹配规则；命中规则产生候选行动，最终是否执行由真实 `canExecuteAction`、`buildMonthlyPlan` 和月度预算/槽位决定。
- 不再设置“单脚本最多 12 条”“每条规则只能一个条件”“只允许一个 fallback”等产品表达限制。
- 为防止浏览器卡死，parser 和 runner 保留工程级硬保护：单次解析只接受有限文本长度，跑局最多推进 280 个月，连续无推进会停止并给出中文提示。这些不是玩法限制，只是运行安全边界。
- 继续禁止循环、函数、变量赋值、随机数、算术表达式、访问对象路径、导入模块。

核心原则：表达力先放开，但执行权不放开。脚本不能越过真实游戏行动、条件来源和月度计划预算。

## 四、落地任务

### 任务 1：DSL AST、parser 与验证

**新增文件**

- `src\systems\lifeScriptDsl.ts`
- `src\tests\lifeScriptDsl.test.ts`

**实现内容**

- 定义 AST：
  - `LifeScriptRule`
  - `LifeScriptCondition`
  - `LifeScriptProgram`
  - `LifeScriptParseResult`
- `parseLifeScript(source: string)`：
  - 按行解析。
  - 空行忽略。
  - `当 <条件表达式> 则 <行动名>[、<行动名>]` 转 AST。
  - `否则 <行动名>[、<行动名>]` 转 fallback rule。
  - 条件表达式支持白名单字段、白名单比较符、`并且`、`或者`。
  - 不识别内容返回中文错误，不抛英文异常。
- `validateLifeScript(program)`：
  - 条件字段、比较符、行动名必须在白名单。
  - 明确禁止包含 `eval`、`Function`、`import`、`window`、`document`、`localStorage`、`fetch`、`.`、`;`、`{`、`}`、`() =>`。
  - 仅做工程级输入保护：拒绝超长文本、超长单行和空动作规则。

**测试**

- 合法脚本解析为稳定 AST。
- `并且`、`或者` 和多行动规则解析为稳定 AST。
- 非白名单字段、动作、符号返回中文错误。
- 包含 JS 片段时拒绝。
- parser 不调用 `eval` / `Function`，契约测试 grep 源码。

**提交**

`feat: 解析人生脚本DSL | v0.1.0 | 2026-07-04`

### 任务 2：脚本执行器复用月度计划

**新增文件**

- `src\systems\lifeScriptExecutor.ts`
- `src\tests\lifeScriptExecutor.test.ts`

**修改文件**

- `src\systems\autoChoiceSystem.ts`

**实现内容**

- `chooseMonthlyPlanForLifeScript(state, program)`：
  - 从上到下评估规则。
  - 当前规则命中后按动作列表顺序尝试加入候选。
  - 不重复行动。
  - 每加入一个行动都用 `canExecuteAction` 和 `buildMonthlyPlan` 检查预算。
  - 不单独设置脚本动作数量上限；最终数量由真实月度计划系统的预算和槽位决定。
  - 如果没有规则可执行，回退到 `chooseMonthlyPlanForStrategy(state, 'stable_cashflow')`。
- 条件读取统一走白名单 accessor：
  - 可见数值走 `getVisibleStats` 或 `derivePressureSnapshot`。
  - 当前 offer / 面试使用 active 状态，不看历史累计。

**测试**

- 精神低时选择恢复行动。
- 复合条件命中时按顺序选择多个真实可执行行动。
- offer 可用时选择 `C2002`。
- 行动不可用时跳过，不伪造执行。
- 预算超载时不加入。
- 同一状态同一脚本输出确定性一致。

**提交**

`feat: 执行人生脚本策略 | v0.1.0 | 2026-07-04`

### 任务 3：挂机跑局与加速回放 UI

**新增文件**

- `src\components\dialogs\LifeScriptDialog.tsx`
- `src\systems\lifeScriptRunner.ts`
- `src\tests\lifeScriptUi.test.tsx`

**修改文件**

- `src\components\GameContainer.tsx`
- `src\components\GameDialogs.tsx`
- `src\styles\app.css`
- `src\tests\v1FrontendContract.test.ts`

**实现内容**

- 游戏头部新增“脚本”入口，仅在游戏内显示。
- 弹窗包含：
  - 脚本文本编辑区。
  - 规则解析结果。
  - 中文错误列表。
  - “跑 12 个月”“跑到结局”两个按钮。
- 跑局执行：
  - 每步先处理 pending event choice，沿用 simulation 选择默认第一项。
  - 每月用脚本生成 plan，再调用 `planMonth`。
  - 每次最多 280 个月，防无限循环。
  - 若连续 6 次没有推进月份，停止并提示“脚本卡住了”。
- 加速回放：
  - 先生成快照列表，再用 `requestAnimationFrame` 或定时器播放关键月份。
  - `prefers-reduced-motion` 下直接展示最终结果。

**测试**

- UI 可打开脚本弹窗，输入合法脚本后能跑 12 个月。
- 非法脚本只显示中文错误，不执行。
- 跑到结局必须通过真实行动路径，不直接篡改终态。
- 移动端弹窗可滚动，关闭和执行按钮可达。

**提交**

`feat: 接入人生脚本跑局 | v0.1.0 | 2026-07-04`

### 任务 4：批量模拟脚本矩阵与 releaseGate

**修改文件**

- `scripts\simulateBatch.ts`
- `scripts\releaseThresholds.json`
- `src\tests\batchSimulation.test.ts`

**新增文件**

- `src\config\lifeScriptPresets.ts`

**实现内容**

- 增加 4 个预设脚本：
  - `现金流优先`
  - `健康优先`
  - `AI转型`
  - `关系优先`
- `simulateBatch` 支持脚本策略矩阵：
  - 默认仍保留现有 auto strategies。
  - 新增 `lifeScriptStrategies` 字段。
  - releaseGate 需要脚本策略至少覆盖成功、平衡、失败三类结局。
- 确定性回放样本增加一个脚本策略样本。

**测试**

- 脚本矩阵跑通，不产生 `none` 作为覆盖结局。
- releaseGate evidence 包含脚本策略结果。
- 同 seed 同脚本 replay hash 一致。

**提交**

`feat: 扩展脚本策略模拟门禁 | v0.1.0 | 2026-07-04`

### 任务 5：验证、复盘与交付

**修改文件**

- `docs\dev-records\2026-07-04-batch4-life-script-dsl.md`
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

- 390x844：脚本弹窗可滚动，错误提示、运行按钮、关闭按钮可达。
- 768x1024：脚本编辑和解析结果不挤压。
- 1280x900：回放信息、日志和按钮布局稳定。

**提交**

`docs: 记录批次4复盘与验证 | v0.1.0 | 2026-07-04`

## 风险与控制

| 风险 | 控制 |
|---|---|
| DSL 变成任意代码执行 | 禁止 `eval` / `Function` / import；parser 只产白名单 AST |
| 表达力过强导致测试不可控 | 第一版只支持单条件单动作、最多 12 条、最多 3 行动 |
| 脚本跑局卡死 | 280 月上限、连续无推进保护、pending event 固定处理 |
| UI 假功能 | 非法脚本不执行；不可用行动跳过并提示 |
| 破坏引擎 determinism | 所有执行走 `planMonth`，脚本矩阵纳入 deterministic replay |
| GameContainer 再超 500 行 | 脚本 UI 放独立 dialog，执行器放 systems |

## 确认问题

请确认第一版 DSL 能力范围：

1. 是否接受“单条件 → 单行动”的第一版限制？
2. 是否接受最多 12 条规则、每月最多 3 个行动？
3. 是否接受“否则”只允许一个，且不支持 `并且/或者`？

确认后才能从此计划进入实现。
