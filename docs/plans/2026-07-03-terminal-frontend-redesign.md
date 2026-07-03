# 前端重设计规划：终端化「程序员母语」界面

- 日期：2026-07-03
- 范围：程序员人生模拟器 V6 前端表现层与交互层（不改游戏引擎数值逻辑）
- 模式：严格模式（跨模块、多文件、正式交付物）
- 前置讨论：本文承接同日的趣味化方向讨论（四层改造：终端外壳 / 界面语义工具化 / 引擎开放玩法 / 键盘优先）

## 一、第一性原理：这次到底要解决什么

产品定位是**给程序员玩的人生模拟器**。内容层的共鸣（加班、面试、裁员、35 岁）已经有了，但表现层是一套换成任何题材都成立的通用卡片 UI（暖色纸质主题、无任何职业身份符号）。对目标用户而言，第一眼没有"这是为我做的"信号。

核心命题：**让界面本身说程序员的母语**。程序员每天面对的是终端、git、监控告警——把游戏外壳做成这些工具的戏仿，第一眼就完成身份识别，交互上再给到键盘效率和即时反馈，趣味性从"皮肤"变成"体验"。

本轮只做表现层与交互层（外壳），**不做**"人生脚本/每日挑战"玩法开放（涉及沙箱安全边界，单独立项）。

## 二、行业验证与调研

| 论点 | 证据 | 来源 |
|---|---|---|
| 终端美学对程序员群体有已验证的吸引力 | Hacknet 以拟真终端氛围成为该品类经典；Bitburner（终端+脚本自动化）Steam 7000+ 评价 95% 好评如潮 | 前轮调研：steamcommunity / nodal.gg / lobste.rs 社区讨论（会话内已引用） |
| 现实共鸣题材 + 低成本表达成立 | 《中国式家长》以表情包级美术 + 题材共鸣拿到 Steam 89% 好评、畅销榜前十 | 维基百科 / 机核评测（会话内已引用） |
| 命令面板是被验证的效率交互 | Ctrl+K 命令面板已是开发者工具标配（VS Code、GitHub、Linear、Vercel 等），React 生态有 cmdk 等成熟库 | 行业通识 + cmdk 开源库 |
| CSS 自定义属性做主题换肤 | CSS Custom Properties 是标准换肤手段，本项目 app.css 已全量使用 `var(--*)` 设计令牌 | 项目源码（src\styles\app.css :root） |

**联网限制说明**：终端游戏与《中国式家长》的证据来自本会话前一轮 WebSearch；cmdk/命令面板为行业通识，未重复检索。

## 三、复用 / 适配 / 自研

| 事项 | 结论 | 理由 |
|---|---|---|
| 主题换肤 | **复用**项目既有 `:root` 设计令牌体系，只换值不换名 | 1476 行 CSS 全部走 `var(--*)`；且契约测试锁定了大量结构规则字符串，换令牌值是唯一零风险路径 |
| 命令面板 | **自研**（约 200 行），不引入 cmdk | 项目运行时依赖只有 react/react-dom（工程原则：最小依赖）；cmdk 的样式假设与终端拟态冲突；本组件命令集固定、无需 cmdk 的嵌套页/异步加载能力 |
| 等宽字体 | **复用**系统字体栈（JetBrains Mono/Cascadia/Consolas + 中文回退），不引入 webfont | 零网络依赖、零许可风险；中文字符本就不等宽，webfont 收益低 |
| commit log 视觉 | **适配** git log 的信息结构（短哈希 + 类型标签 + 标题 + diff 着色），数据源复用现有 logs/decisionLog | 引擎日志结构已含 type/month/title/text，映射即可，不改数据层 |
| 面板组件化 | **复用**既有组件目录约定，从 GameContainer 拆出 panels | GameContainer 559 行超 500 行阈值，按全局规则先拆再加功能 |

## 四、落地方案

### 设计语言（统一心智：一个正在运行的终端会话）

- **配色**：深空背景（#0B0F14 系）+ 荧光绿主色 + 青/琥珀/玫红信号色，对应 git diff / 日志级别的语义（+绿 -红 WARN 琥珀）。
- **字体**：等宽栈 `"JetBrains Mono","Cascadia Code","SF Mono",Consolas` + 中文回退。
- **质感**：极淡扫描线（opacity ≤ .05，pointer-events:none），不做闪烁/抖动（尊重 prefers-reduced-motion，避免眩晕）。
- **窗口 chrome**：标题卡改成终端窗口样式（三圆点 + `coder@life:~` 提示符），全局文案保持中文，终端命令词只作为风味符号出现。

### 分期与改动面

**Stage A 终端主题皮肤**（app.css 令牌与装饰层、App.tsx 标题卡）
- `:root` 令牌换终端暗色系；body 字体换等宽栈；扫描线伪元素；TitleCard 加终端窗口条。
- 红线：契约测试锁定的结构规则字符串（grid/max-height/overflow 等约 20 处）逐字保留；`--shadow` 等令牌名不改。

**Stage B 面板拆分 + commit log**（先拆后加，满足 >500 行规则）
- 从 GameContainer 拆出 `components/panels.tsx`（PressureSummary、ProjectProgressPanel、StatCard）与重写 `components/LifeLog.tsx`（覆盖同名死文件）。
- LifeLog 改 commit log 风格：`短哈希 D·天数 [类型标签] 标题 正文`，哈希由 `month+title` 确定性生成；最新一条带光标动效。
- 决策日志 mini 面板效果值走 diff 着色（+绿 / -红）。
- 契约测试 `v1FrontendContract.test.ts` 同步把移动走的 token 断言指向新源文件（属计划内更新，逐条对应）。

**Stage C 终端命令面板**（新文件 `components/CommandPalette.tsx` + GameScreen 接线）
- 唤起：Ctrl+K 或反引号 `` ` ``（输入框聚焦时不劫持）；Esc 关闭。
- 命令集（输出全部中文产品化文案）：`help`、`whoami`（人生摘要）、`htop`（状态表）、`log [n]`、`run <行动名>`（子串匹配，歧义时列候选）、`save`、`undo`、`open 商店|成就|收藏`、`clear`、`exit`、`sudo *`（彩蛋：`权限不足：人生没有 root`）。
- 可访问性：role="dialog"、aria-label、焦点困在面板内，关闭后焦点还原。

**Stage D P0 告警 + 微交互 + 收尾**
- 危机激活（crisis.burnout/mentalHealth active 或精神 < 25）时显示 P0 告警条：`▲ P0 · <危机名> · 值班人：你`，复用现有 .crisis 展示条件并扩展样式。
- StatCard 数值滚动动画（自研 ~20 行 rAF hook，respect prefers-reduced-motion）。
- 全量验证、复盘入 docs\dev-records、workbench 更新。

### 明确不做（本轮）与暂缓说明

- 人生脚本 DSL / 每日挑战 seed 玩法：单独立项（沙箱安全 + 玩法平衡需独立规划）。
- 结局 Postmortem 深改与 GameDialogs：该文件 589 行超阈值，本轮不新增分支；拆分目标（按对话框拆文件）与结局重设计合并到下一轮，删除条件同规划约束 C。
- j/k 全局键航：命令面板已覆盖键盘效率主诉求，全局 vim 键位与搜索框/弹窗焦点冲突面大，观察命令面板使用反馈后再定。
- 死文件清理（WorldStatusBar/DebugPanel 等 6 个未被引用组件）：被契约测试断言引用，清理需连同测试一起动，放入下一轮工程清理。

## 五、风险与验证标准

### 风险

| 风险 | 等级 | 缓解 |
|---|---|---|
| 契约测试大面积断言 CSS/源码字符串 | 高 | 换令牌值不动结构规则；移动代码时逐条迁移断言；每个 Stage 跑全量测试 |
| 暗色主题可读性/对比度回退 | 中 | 文本对比度按 WCAG AA 自检；危机/告警色保持语义一致 |
| 命令面板与现有键盘输入冲突 | 中 | 输入框聚焦时不响应唤起键；Esc 关闭优先于其他弹窗逻辑单独处理 |
| 移动端可用性回退 | 中 | 660px 媒体查询规则不动；命令面板在触屏上提供入口按钮 |
| 大文件规则 | 低 | GameContainer 先拆后加；GameDialogs 本轮不动并已写明暂缓原因 |

### 验证标准

1. `npm test` 全绿（含更新后的契约测试）、`npm run lint` 0 error、`npm run build` 成功且首屏 chunk 不新增大依赖。
2. 同 seed `npm run simulate` 与改前一致（本轮不触引擎，防误伤）。
3. 手工链路（浏览器）：终端主题渲染正常；commit log 正确着色；Ctrl+K 唤起面板并能 `run` 行动、`htop` 查状态、`sudo` 彩蛋；移动视口无横向溢出。
4. 用户可见层审计：无英文异常/内部标签泄漏；命令面板输出全部中文产品化。
