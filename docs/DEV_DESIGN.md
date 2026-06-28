# 程序员人生模拟器 V6 开发设计文档

> 版本：V6 Development Design Draft  
> 项目类型：模块化 Web 游戏 / 人生模拟器 / 规则驱动叙事系统  
> 设计原则：不再做单 HTML；前端、规则引擎、数据配置、存档、测试全部拆分。  
> 当前目标：从 V5 的单文件原型，升级为可维护、可扩展、可测试、可调参的工程化项目。

---

## 0. 文档目的

本开发设计文档用于指导《程序员人生模拟器 V6》的工程实现。它不是游戏世界观文案，也不是 GDD 的替代品，而是把 GDD 与规则配置草案转化为可开发的项目结构、模块职责、接口设计、状态流、测试方案和迭代计划。

V6 的核心方向是：把游戏从“单 HTML + 事件按钮 + 直接改数值”升级为“规则配置驱动 + 纯游戏引擎 + 响应式 UI + 可复现随机 + 可调参测试”的模块化 Web 项目。

---

## 1. 架构决策

### 1.1 不采用单 HTML

V6 明确不再采用单 HTML 文件。原因：

1. 单 HTML 难以维护：CSS、HTML、JS、规则数据混在一起，后期新增事件、行动、成就时会迅速失控。
2. 无法稳定测试：规则函数、UI 渲染、存档逻辑互相耦合，难以做单元测试。
3. 调参成本高：每次修改行动收益、事件概率、结局条件都需要进入主逻辑代码。
4. 随机事件不可复盘：旧结构通常使用 `Math.random()`，难以复现同一局游戏。
5. 不利于扩展：后续若要做云存档、排行榜、剧情编辑器、调参面板，会被单文件结构限制。

### 1.2 推荐技术栈

推荐使用：

```text
Vite + React + TypeScript
```

理由：

- Vite 适合轻量 Web 游戏项目，启动快，支持 React + TypeScript 模板。
- React 适合状态驱动 UI，能把“游戏状态变化”映射为“界面变化”。
- TypeScript 适合规则配置型项目，能约束 Action、Event、State、Ending 等结构，减少调参时的字段错误。
- 游戏核心引擎保持纯 TypeScript，不依赖 React，方便单元测试和未来迁移。

### 1.3 可选替代方案

如果希望更轻：

```text
Vite + Vanilla TypeScript
```

优点是依赖少，缺点是状态驱动 UI 和组件复用成本更高。

如果未来要做大型版本：

```text
Vite + React + TypeScript + Zustand + IndexedDB
```

但 MVP 阶段不建议过早引入复杂状态库。可以先用 React `useReducer` 管理游戏状态。

---

## 2. 项目目录结构

建议目录如下：

```text
programmer-survival-v6/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── README.md
├── docs/
│   ├── GDD.md
│   ├── DEV_DESIGN.md
│   ├── BALANCE_GUIDE.md
│   └── EVENT_WRITING_GUIDE.md
├── public/
│   └── icons/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.ts
│   │   └── app.css
│   ├── core/
│   │   ├── engine.ts
│   │   ├── monthlyLoop.ts
│   │   ├── reducers.ts
│   │   ├── selectors.ts
│   │   ├── formulas.ts
│   │   ├── rng.ts
│   │   ├── validators.ts
│   │   └── types.ts
│   ├── config/
│   │   ├── initialState.ts
│   │   ├── world.config.ts
│   │   ├── careers.config.ts
│   │   ├── actions.config.ts
│   │   ├── events.config.ts
│   │   ├── shop.config.ts
│   │   ├── achievements.config.ts
│   │   ├── endings.config.ts
│   │   └── balance.config.ts
│   ├── systems/
│   │   ├── worldSystem.ts
│   │   ├── economySystem.ts
│   │   ├── careerSystem.ts
│   │   ├── actionSystem.ts
│   │   ├── eventSystem.ts
│   │   ├── mentalHealthSystem.ts
│   │   ├── achievementSystem.ts
│   │   ├── endingSystem.ts
│   │   └── progressionSystem.ts
│   ├── storage/
│   │   ├── saveGame.ts
│   │   ├── migrations.ts
│   │   └── exportImport.ts
│   ├── ui/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx
│   │   │   ├── HeaderBar.tsx
│   │   │   ├── MainGrid.tsx
│   │   │   └── MobileActionDrawer.tsx
│   │   ├── screens/
│   │   │   ├── StartScreen.tsx
│   │   │   ├── CareerSelectScreen.tsx
│   │   │   ├── GameScreen.tsx
│   │   │   ├── DebugScreen.tsx
│   │   │   └── EndingScreen.tsx
│   │   ├── components/
│   │   │   ├── StatCard.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── ActionButton.tsx
│   │   │   ├── LogPanel.tsx
│   │   │   ├── EventChainPanel.tsx
│   │   │   ├── ShopModal.tsx
│   │   │   ├── AchievementModal.tsx
│   │   │   └── StageChoiceModal.tsx
│   │   └── hooks/
│   │       ├── useGame.ts
│   │       ├── useKeyboardShortcuts.ts
│   │       └── useResponsive.ts
│   └── tests/
│       ├── engine.test.ts
│       ├── formulas.test.ts
│       ├── rng.test.ts
│       ├── monthlyLoop.test.ts
│       └── simulation.test.ts
```

---

## 3. 分层架构

V6 分为五层。

### 3.1 Config Layer：规则配置层

负责存放所有可调参内容。

包括：

```text
世界变量
职业路线
行动配置
事件配置
商店物品
成就条件
结局条件
数值参数
```

原则：

- 配置只描述规则，不直接修改 UI。
- 配置中尽量使用纯数据。
- 条件函数可以存在，但要统一类型签名。
- 所有金额底层统一使用“元”。

### 3.2 Core Engine Layer：核心引擎层

负责游戏状态推进，不依赖 React。

主要职责：

```text
创建初始状态
执行行动
结算月份
触发事件
更新世界变量
计算绩效
判断解锁
判断结局
生成日志
```

核心要求：

- 纯函数优先。
- 输入 state，输出 nextState。
- 不直接访问 DOM。
- 不直接读写 localStorage。
- 不使用 Math.random()，统一使用可复现 PRNG。

### 3.3 Systems Layer：业务系统层

每个系统处理一种逻辑：

```text
worldSystem       AI替代进度、经济周期
economySystem     工资、税费、生活成本、投资
careerSystem      求职、晋升、跳槽、岗位等级
actionSystem      行动可用性、行动效果
eventSystem       事件触发、事件链记忆
mentalHealthSystem 精神、健康、燃尽负荷
achievementSystem 成就解锁
endingSystem      结局判断
progressionSystem 年龄阶段与关键选择
```

### 3.4 UI Layer：界面层

负责展示状态和响应用户操作。

原则：

- UI 不直接计算规则。
- UI 只调用 engine 暴露的方法。
- UI 中只做格式化、布局、交互状态。
- 所有行动按钮是否可点，由 selector 或 engine 判断。

### 3.5 Storage Layer：存档层

负责本地存档、版本迁移、导入导出。

MVP 使用 localStorage 即可。

后续可升级为：

```text
IndexedDB
云存档 API
导出 JSON 存档
```

---

## 4. 核心数据模型

### 4.1 GameState

```ts
export interface GameState {
  meta: {
    version: string;
    seed: number;
    createdAt: number;
    updatedAt: number;
  };

  player: PlayerState;
  world: WorldState;
  career: CareerState;
  economy: EconomyState;
  progression: ProgressionState;
  flags: GameFlags;
  history: GameHistory;
}
```

### 4.2 PlayerState

```ts
export interface PlayerState {
  age: number;
  month: number;

  mental: number;
  health: number;
  burnoutLoad: number;

  techXp: number;
  aiXp: number;
  reputationXp: number;

  tech: number;
  ai: number;
  reputation: number;

  cash: number;
  identity: IdentityState;
  relationships: RelationshipState;
}
```

说明：

- `techXp / aiXp / reputationXp` 是隐藏经验。
- `tech / ai / reputation` 是前端显示值，由公式计算。
- `burnoutLoad` 是隐藏或半隐藏变量，不建议一开始完全暴露给玩家，可用“燃尽风险：低/中/高”展示。

### 4.3 WorldState

```ts
export interface WorldState {
  aiReplacementIndex: number;
  aiAcceleration: number;

  economyCycle: "boom" | "stable" | "recession";
  economyHeat: number;

  marketRisk: number;
  jobMarketDemand: number;

  currentYearTheme: string;
}
```

宏观变量分为两类：

```text
AI替代进度：长期单向变化
经济周期：周期性波动
```

AI 进度不是惩罚，而是时代背景。经济周期不是随机灾难，而是影响跳槽、裁员、副业报酬、投资波动的环境变量。

### 4.4 CareerState

```ts
export interface CareerState {
  trackId: string;
  jobLevel: JobLevel;
  companyType: CompanyType;
  cityTier: CityTier;

  employed: boolean;
  monthsInCurrentJob: number;
  salaryGross: number;
  salaryNet: number;

  rollingPerformance6m: number[];
  interviewCooldown: number;
  promotionCooldown: number;
}
```

### 4.5 EconomyState

```ts
export interface EconomyState {
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyNetCashflow: number;

  livingCostBase: number;
  rent: number;
  subscriptions: number;

  assets: AssetAccount[];
  passiveIncome: number;
  debt: number;
}
```

### 4.6 History

```ts
export interface GameHistory {
  logs: GameLog[];
  monthSnapshots: MonthSnapshot[];
  eventChains: EventChainState[];
  unlockedAchievements: string[];
  purchasedItems: string[];
  stageChoices: StageChoiceRecord[];
}
```

---

## 5. 月度核心循环

V6 的核心不是按钮，而是月度循环。

```text
月初状态
→ 玩家选择行动
→ 应用行动即时效果
→ 结算工资/副业
→ 扣税费/生活成本/订阅
→ 结算投资收益
→ 更新 AI 进度和经济周期
→ 更新精神/健康/燃尽
→ 触发事件
→ 处理事件链记忆
→ 检查成就
→ 检查阶段选择
→ 检查结局
→ 生成月末快照
→ 进入下个月
```

建议实现为：

```ts
export function applyMonthlyTurn(
  state: GameState,
  actionId: string
): GameState {
  let next = cloneState(state);

  next = applyAction(next, actionId);
  next = settleSalary(next);
  next = settleLivingCost(next);
  next = settleInvestments(next);
  next = updateWorld(next);
  next = updateMentalAndHealth(next);
  next = triggerMonthlyEvents(next);
  next = updateEventChains(next);
  next = unlockAchievements(next);
  next = checkStageGate(next);
  next = checkEndings(next);
  next = appendMonthSnapshot(next);

  return next;
}
```

---

## 6. 规则系统设计

### 6.1 行动配置 ActionConfig

```ts
export interface ActionConfig {
  id: string;
  name: string;
  category: "learn" | "work" | "recover" | "career" | "side" | "relationship" | "asset";
  durationMonths: number;

  visibleEffect: Partial<ActionEffect>;
  hiddenEffect?: Partial<ActionEffect>;

  requirement: Requirement;
  cooldown?: CooldownConfig;

  riskTags: string[];
  narrativeTags: string[];

  description: string;
}
```

### 6.2 行动效果 ActionEffect

```ts
export interface ActionEffect {
  cash: number;
  techXp: number;
  aiXp: number;
  reputationXp: number;

  mental: number;
  health: number;
  burnoutLoad: number;

  jobChance: number;
  promotionChance: number;
  passiveIncomeSeed: number;
}
```

### 6.3 情境修正 Context Modifier

行动不能永远好，也不能永远坏。

示例：

```ts
export function getActionModifier(state: GameState, action: ActionConfig) {
  const modifier = {
    techXp: 1,
    aiXp: 1,
    cash: 1,
    mentalCost: 1,
    healthCost: 1,
    eventRisk: 1,
  };

  if (state.player.mental < 30) {
    modifier.techXp *= 0.75;
    modifier.aiXp *= 0.75;
    modifier.eventRisk *= 1.25;
  }

  if (state.player.health < 35 && action.riskTags.includes("high_pressure")) {
    modifier.healthCost *= 1.5;
  }

  if (state.world.economyCycle === "recession" && action.category === "career") {
    modifier.cash *= 0.8;
  }

  if (state.world.aiReplacementIndex > 60 && state.player.ai < 30) {
    modifier.eventRisk *= 1.2;
  }

  return modifier;
}
```

---

## 7. 世界系统

### 7.1 AI 替代进度

AI 替代进度是长期变量，不由玩家直接控制。

```ts
aiReplacementIndex = clamp(
  base + month * monthlyGrowth + acceleration + randomNoise,
  0,
  100
)
```

阶段建议：

| AI进度 | 阶段 | 世界反馈 |
|---:|---|---|
| 0-20 | 工具萌芽 | 学 AI 是优势 |
| 20-40 | 普及加速 | 不会 AI 开始落后 |
| 40-60 | 岗位重组 | 低端重复岗位风险上升 |
| 60-80 | 协作标准化 | AI 成为默认技能 |
| 80-100 | 新范式稳定 | 职业价值转向系统设计、判断、沟通、产品化 |

AI 进度影响：

```text
学习效率
岗位需求
低技能岗位风险
AI能力收益
裁员事件权重
转型事件权重
```

### 7.2 经济周期

经济周期建议使用状态机：

```ts
type EconomyCycle = "boom" | "stable" | "recession";
```

状态转移：

```text
boom → stable → recession → stable → boom
```

允许随机扰动，但不能完全随机。

经济周期影响：

| 系统 | 牛市 | 稳定 | 熊市 |
|---|---:|---:|---:|
| 跳槽成功率 | 高 | 中 | 低 |
| 薪资涨幅 | 高 | 中 | 低 |
| 裁员概率 | 低 | 中 | 高 |
| 私活报酬 | 高 | 中 | 低 |
| 投资收益 | 高波动偏正 | 中性 | 高波动偏负 |
| 创业成功率 | 高 | 中 | 低 |

---

## 8. 角色系统

### 8.1 四个核心显示属性

| 属性 | 显示范围 | 真实作用 |
|---|---:|---|
| 精神 | 0-100 | 决策质量、学习效率、事件风险 |
| 技术 | 0-100 | 岗位价值、项目能力、跳槽基础 |
| AI能力 | 0-100 | 效率乘数、转型能力、时代适应 |
| 存款 | 元 | 抗风险能力、选择自由度 |

### 8.2 隐藏或半隐藏属性

| 属性 | 作用 |
|---|---|
| 健康 | 中长期身体承载力 |
| 燃尽负荷 | 过去 3-6 个月透支累计 |
| 声望 | 跳槽、内推、副业、机会事件 |
| 关系 | 家庭、人脉、导师、伴侣 |
| 身份认同 | 玩家对“我是谁”的长期叙事状态 |

### 8.3 精神影响决策质量

当精神低于阈值时，不直接禁止玩家选择，而是改变选项展示和后果。

| 精神区间 | 状态 | 机制 |
|---:|---|---|
| 70-100 | 清醒 | 显示完整收益与风险 |
| 50-69 | 疲惫 | 部分风险提示变模糊 |
| 30-49 | 焦虑 | 学习/工作效率下降，负事件上升 |
| 15-29 | 疲劳判断 | 出现“看似划算”的陷阱选项 |
| 0-14 | 崩溃边缘 | 强制恢复提示，部分高压行动锁定 |

示例：

精神 80 时：

```text
加班冲刺：工资 +25%，技术 XP +10，精神 -14，健康 -8
```

精神 20 时：

```text
加班冲刺：你觉得再撑一个月就好了
可见：工资 +25%，技术 XP +10
隐藏：健康 -12，燃尽 +18，负面事件概率 +30%
```

---

## 9. 时间与阶段系统

### 9.1 时间单位

```text
1次行动 = 1个月
12个月 = 1年
起始年龄 = 22岁
主线结束 = 45岁
扩展结束 = 60岁
```

MVP 建议先做到 45 岁，因为用户提出的阶段模型重点在 22-45 岁。后续扩展可加入 45-60 岁第二人生。

### 9.2 阶段划分

| 年龄 | 阶段 | 主题 | 核心矛盾 |
|---|---|---|---|
| 22-28 | 草创期 | 证明自己 | 先学会，再活下去 |
| 28-33 | 黄金期 | 成长选择 | 钱、健康、梦想怎么分配 |
| 33-38 | 危机期 | AI重构 | 你站在替代侧还是协作侧 |
| 38-45 | 抉择期 | 身份转型 | 继续做执行者，还是重塑自己 |

### 9.3 阶段关键选择

每个阶段结束时触发不可跳过的关键选择。

#### 28岁节点：第一次路线定型

可选：

```text
技术深耕
跳槽加薪
AI转型
稳定生活
副业探索
```

永久影响：

```text
行动池权重
职业事件链
结局倾向
身份认同
```

#### 33岁节点：黄金期结算

可选：

```text
冲击高级岗位
转管理/负责人
做独立开发/副业
降低强度保健康
追随 AI 新范式
```

#### 38岁节点：中年危机节点

可选：

```text
专家路线
管理路线
自由职业路线
创业路线
守成路线
找回自己路线
```

#### 45岁节点：主结局判断

45 岁是主结局节点，不一定是失败节点。

---

## 10. 事件系统

### 10.1 事件类型

事件比例建议：

```text
日常事件：60%
触发事件：30%
随机事件：10%
```

### 10.2 EventConfig

```ts
export interface EventConfig {
  id: string;
  title: string;
  type: "daily" | "triggered" | "random" | "major";
  weight: number;

  condition: Requirement;
  effects: Partial<ActionEffect>;
  choices?: EventChoice[];

  chainId?: string;
  chainStep?: number;

  tags: string[];
  logText: string;
}
```

### 10.3 事件记忆链

事件不能只是一条日志。某些事件必须形成链。

示例：AI替代压力链

```text
01 同事开始用 AI 自动生成代码
02 项目组开始要求 AI 提效指标
03 组长找你谈话：你的交付速度偏慢
04 你的位置开始动摇
05 如果 AI < 30 且 tech < 40，触发降薪/转岗/失业风险
06 如果 AI ≥ 50，触发“你成为组内 AI 推广者”
```

EventChainState：

```ts
export interface EventChainState {
  chainId: string;
  currentStep: number;
  active: boolean;
  resolved: boolean;
  startedAtMonth: number;
  memory: Record<string, unknown>;
}
```

---

## 11. 决策系统

### 11.1 行动的三层后果

每个行动必须包含三层：

```text
即时反馈：玩家当月看到的变化
延迟后果：1-6个月后显现
情境修正：不同状态下后果不同
```

### 11.2 禁止绝对最优解

每个动作必须有适用场景和反噬场景。

| 行动 | 好场景 | 坏场景 |
|---|---|---|
| 系统学习 | 起步期、转型期 | 现金流过低时 |
| 加班冲刺 | 短期目标明确、健康高 | 精神低、健康低、连续使用 |
| AI训练 | 技术基础够、时代变化快 | 技术太低时收益打折 |
| 休息摸鱼 | 燃尽高、健康低 | 长期重复会落后 |
| 跳槽 | 市场热、声望高 | 经济冷、精神低 |
| 私活 | 技术成熟、短期缺钱 | 连续使用导致燃尽 |
| 创业 | 资源足、声望高、经济热 | 熊市、现金不足、关系差 |

### 11.3 延迟后果队列

```ts
export interface DelayedEffect {
  triggerMonth: number;
  sourceId: string;
  effect: Partial<ActionEffect>;
  logText: string;
}
```

比如连续加班不会立刻大病，而是在后续几个月增加事件权重。

---

## 12. 经济系统

### 12.1 货币单位

底层统一使用：

```text
元
```

前端格式化：

```ts
formatMoney(100000) => "10.0 万"
formatMoney(1250) => "1,250 元"
```

### 12.2 月度现金流

```text
月净现金流 = 税后工资 + 副业收入 + 被动收入 - 生活成本 - 订阅 - 医疗/事件支出
```

### 12.3 工资模型

```ts
grossSalary =
  baseSalary[cityTier][jobLevel]
  * trackCoef[careerTrack]
  * companyCoef[companyType]
  * marketCoef[economyCycle]
```

### 12.4 存款阶段

| 阶段 | 目标 |
|---|---:|
| 起步线 | 100,000 |
| 紧急备用金 | 150,000 |
| 半年缓冲 | 300,000 |
| 职业转型金 | 500,000 |
| 家庭风险基金 | 1,000,000 |
| 财务喘息区 | 3,000,000 |
| 准财务自由 | 6,000,000 |
| 长期自由 | 10,000,000 |

### 12.5 投资系统

MVP 只做三类：

```text
现金管理
稳健债券
指数基金
```

后续扩展：

```text
内容版权
工具产品
创业股权
```

投资不能稳定送钱，必须有波动和回撤。

---

## 13. UI/UX 设计要求

### 13.1 桌面布局

```text
┌────────────────────────────────────────────┐
│ Header：年龄 / 阶段 / AI进度 / 经济周期      │
├──────────────┬────────────────┬────────────┤
│ 角色状态      │ 人生日志/事件链   │ 行动面板    │
│ 现金流        │ 阶段目标         │ 商店/成就   │
└──────────────┴────────────────┴────────────┘
```

### 13.2 移动端布局

```text
顶部：世界状态
状态卡：横向滑动
主区：日志/事件链
底部：行动抽屉
```

### 13.3 必须遵守

```text
页面铺满 100dvh
主容器不随日志撑高
日志内部滚动
行动区内部滚动
商店弹窗内部滚动
状态卡固定高度
存款进度条固定长度
按钮触控高度不小于 44px，推荐 48px
```

### 13.4 行动按钮展示

每个按钮显示：

```text
行动名称
耗时
可见收益
可见风险
锁定原因
风险等级
```

锁定按钮不隐藏，而是灰化并显示原因。这样玩家知道下一步目标。

---

## 14. 存档设计

### 14.1 LocalStorage Key

```ts
const SAVE_KEY = "programmer_survival_v6_save";
```

### 14.2 SaveData

```ts
export interface SaveData {
  version: string;
  savedAt: number;
  state: GameState;
}
```

### 14.3 版本迁移

```ts
export function migrateSave(save: SaveData): SaveData {
  if (save.version === "6.0.0") return save;
  // 后续版本迁移
  return save;
}
```

### 14.4 导入导出

后续提供：

```text
导出 JSON
导入 JSON
复制存档码
```

---

## 15. 调试与平衡测试

### 15.1 Debug 面板

Debug 面板显示：

```text
当前 seed
当前月
年龄
AI替代进度
经济周期
月收入
月支出
净现金流
燃尽负荷
事件概率
可触发事件
可触发结局
行动收益排名
```

### 15.2 自动模拟

必须支持批量模拟：

```ts
runSimulation({
  seedStart: 1,
  count: 1000,
  strategy: "balanced"
})
```

策略至少包括：

```text
balanced        平衡路线
workaholic      纯加班
learner         纯学习
rest_first      高恢复
ai_first        AI优先
money_first     现金优先
random          随机行动
```

### 15.3 平衡目标

标准难度下建议：

| 指标 | 目标范围 |
|---|---:|
| 首次 Offer 中位月数 | 4-8个月 |
| 24个月存款中位数 | 10万-30万 |
| 120个月达到100万比例 | 35%-55% |
| 明显燃尽比例 | 15%-25% |
| 45岁主线存活率 | 50%-75% |
| 隐藏结局解锁率 | 3%-8% |

---

## 16. 测试方案

### 16.1 单元测试

必须覆盖：

```text
属性软上限公式
工资计算公式
生活成本公式
AI进度更新
经济周期状态机
行动解锁条件
事件触发权重
成就条件
结局条件
PRNG可复现性
```

### 16.2 集成测试

测试完整月度循环：

```text
执行行动后月份 +1
工资正常结算
生活费正常扣除
状态上下限正常 clamp
事件可触发
成就可解锁
结局可判断
```

### 16.3 UI 测试

至少测试：

```text
桌面 1440x900
平板 1024x768
手机 390x844
小屏 360x640
横屏 844x390
```

要求：

```text
无横向滚动
主页面不被日志撑高
行动按钮可点击
弹窗不溢出屏幕
状态卡数字不顶破布局
```

---

## 17. 开发阶段计划

### Phase 0：工程初始化

交付：

```text
Vite + React + TypeScript 项目
目录结构
基础路由
基础样式变量
GDD 和 DEV_DESIGN 放入 docs
```

### Phase 1：核心引擎

交付：

```text
GameState
规则配置
月度循环
PRNG
存档
基础测试
```

验收：

```text
可以在控制台跑 1000 局模拟
同 seed 结果一致
无 UI 也能推进游戏
```

### Phase 2：MVP UI

交付：

```text
职业选择
主游戏页
状态卡
行动按钮
日志面板
商店弹窗
成就弹窗
结局弹窗
```

验收：

```text
桌面/手机可玩
一局能从22岁玩到45岁
至少5个结局可触发
```

### Phase 3：事件链与阶段选择

交付：

```text
事件链系统
28/33/38/45岁阶段选择
延迟后果队列
身份认同系统
```

### Phase 4：调参与内容扩展

交付：

```text
Debug面板
自动模拟器
更多行动/事件/商店/成就
平衡参数表
```

---

## 18. MVP 内容范围

V6 MVP 不追求内容数量，先追求闭环稳定。

### 18.1 职业

```text
前端/产品界面工程师
后端/平台工程师
全栈/独立开发者
AI应用工程师
```

### 18.2 行动

至少 12 个：

```text
系统学习
项目实战
AI工具训练
求职投递
认真上班
加班冲刺
开源贡献
技术写作
人脉经营
面试跳槽
接私活
休息恢复
```

### 18.3 事件

至少 10 个：

```text
同事开始用AI
房租上涨
导师出现
朋友内推
线上事故
小病一场
裁员风波
AI工具突破
副业机会
家庭支出
```

### 18.4 结局

至少 5 个：

```text
提前出局
普通工具人
AI时代架构师
资本路赢家
找回自己
```

---

## 19. 编码规范

### 19.1 命名

```text
类型：PascalCase
函数：camelCase
配置 ID：snake_case
React 组件：PascalCase
常量：UPPER_SNAKE_CASE
```

### 19.2 函数原则

```text
纯函数优先
单函数不超过 80 行
复杂公式单独放 formulas.ts
不要在 UI 组件里写游戏规则
不要在配置里写 DOM 逻辑
```

### 19.3 状态原则

```text
所有状态从 GameState 派生
UI 不存重复业务状态
显示值用 selector 计算
长期数据写入 history
```

---

## 20. 验收标准

V6 MVP 完成时必须满足：

```text
项目不是单 HTML
规则配置与引擎分离
UI 与引擎分离
同 seed 可复现
能保存和读取
能从22岁推进到45岁
至少12个行动
至少10个事件
至少5个结局
桌面和手机均可玩
无横向滚动
主面板不被内容撑高
有基础调试面板
有至少20条单元测试
```

---

## 21. 后续扩展方向

### 21.1 云存档

```text
Node.js / Express / SQLite
用户登录
云端保存
多设备同步
```

### 21.2 剧情编辑器

```text
事件链编辑
行动配置编辑
结局配置编辑
调参预览
```

### 21.3 数据可视化

```text
人生曲线图
现金流图
精神/健康变化图
职业路线图
事件链回放
```

### 21.4 多城市与家庭系统

```text
城市迁移
买房/租房
父母健康
伴侣关系
子女教育
家庭责任
```

---

## 22. 开发优先级总结

最推荐的落地顺序：

```text
1. 建 Vite + React + TypeScript 项目
2. 把 rules_config_draft.js 转成 TypeScript config
3. 写 GameState 类型
4. 写 formulas.ts
5. 写 monthlyLoop.ts
6. 写 actionSystem.ts
7. 写 eventSystem.ts
8. 写 endingSystem.ts
9. 写存档
10. 写最小 UI
11. 写测试
12. 写 Debug 面板
13. 再扩内容
```

一句话原则：

> 先让规则跑通，再让界面好看；先让模拟可信，再让内容丰富；先让系统可测，再追求戏剧性。

---

## 23. 与 GDD 的关系

GDD 负责回答：

```text
游戏表达什么？
玩家体验什么？
世界如何运行？
人生选择如何分叉？
```

本开发设计文档负责回答：

```text
项目怎么拆？
代码怎么写？
状态怎么流动？
规则怎么配置？
如何测试？
如何扩展？
```

两者关系：

```text
GDD.md              设计总纲
DEV_DESIGN.md       工程实现说明
rules_config.ts     可执行规则
game_engine.ts      状态推进器
ui/*.tsx            交互表现层
```

---

## 24. 第一批开发任务清单

可以直接拆成任务：

```text
[ ] 初始化 Vite + React + TypeScript
[ ] 建立 src/core/types.ts
[ ] 建立 src/config/*.config.ts
[ ] 建立 src/core/rng.ts
[ ] 建立 src/core/formulas.ts
[ ] 建立 src/systems/economySystem.ts
[ ] 建立 src/systems/actionSystem.ts
[ ] 建立 src/systems/eventSystem.ts
[ ] 建立 src/systems/endingSystem.ts
[ ] 建立 src/core/monthlyLoop.ts
[ ] 建立 src/storage/saveGame.ts
[ ] 建立 CareerSelectScreen
[ ] 建立 GameScreen
[ ] 建立 StatCard / ProgressBar / ActionButton / LogPanel
[ ] 建立 ShopModal / AchievementModal / EndingModal
[ ] 建立 DebugScreen
[ ] 写 engine 单元测试
[ ] 写 simulation 自动测试
```

---

## 25. 结论

V6 的开发重点不是“把页面重做得更好看”，而是把游戏从一个单文件原型升级成真正的规则驱动模拟系统。

V6 成功的标志不是内容数量，而是：

```text
每个行动都有代价
每个选择都有后果
每条路线都有活法
每次失败都能解释
每次成功都不是单一数值堆出来的
```

这才符合《程序员人生模拟器》的核心价值观：不是鼓励玩家无脑暴富，也不是鼓励躺平，而是让玩家在 AI、经济、健康、关系和自我认同之间做长期选择。
