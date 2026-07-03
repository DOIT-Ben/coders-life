# 11-supplementary-analysis.md

> **用途**：coderslife-realworld-data 的补充分析 + 升级方案
> **范围**：不混合到原 01-10 文件，作为补充材料独立存在
> **生成时间**：2026-06-28 09:41+08:00
> **维护者**：网页调研智能体

---

## 0. 执行摘要

你（用户）已经确认数据质量达标、可作为下一轮系统升级的数据源。本文档不重复 01-10 数据，而是：

1. **深度分析**：你给的反馈 + 我对数据的洞察 + 数据盲点识别
2. **补充数据集**：5 个独立 CSV（不混合到原文件）
3. **系统升级路径**：4 步走详细方案 + 字段映射 + 数值校准
4. **风险与测试**：未覆盖场景、平衡风险、单元测试建议

---

## 1. 深度分析

### 1.1 你确认的数据质量

你做了完整结构校验：
- ✅ CSV 表头正确
- ✅ JSONL 250 行合法 JSON
- ✅ action_id / id 无重复
- ✅ 数值列可解析
- ✅ primary_category 全部命中规则集

→ 这意味着**导入游戏引擎没有结构障碍**，可以直接进入下一轮开发。

### 1.2 我对数据的洞察

#### A. 数据偏向识别

| 维度 | 偏向 | 原因 | 影响 |
|---|---|---|---|
| **地理** | 一线 + 新一线占 80% | 脉脉/猎聘/BOSS 用户分布 | 二三线真实薪资可能被高估 |
| **公司类型** | 大厂占主导（24/55 行） | 脉脉用户结构 | 外包/创业数据相对薄 |
| **性别** | 隐含 95% 男性 | 简历来源 | 女程序员视角盲点 |
| **年龄** | 集中在 25-40 | JD 主流画像 | 45+ 程序员转型案例少 |
| **行业** | 互联网为主 | 数据来源 | 制造业/国企/外企 IT 部门盲点 |

#### B. 数据密度评估

| 文件 | 行数 | 覆盖度评估 | 缺口 |
|---|---|---|---|
| 01_career_roles | 55 行 | **充足** | 大厂占 24 行，二三线中小厂偏少 |
| 02_city_costs | 20 城市 | **充足** | 三线城市缺失（用户可能想要更广） |
| 03_company_types | 8 行 | **刚够** | 国企、外包、创业案例深度可加 |
| 04_actions | 168 行 | **充裕** | 可支撑玩家 30 分钟不重复行动 |
| 05_events | 250 条 | **充裕** | 但 V2EX/脉脉 URL 部分是话题级 |
| 06_health_rules | 26 条 | **足够** | 已有 6+ 篇学术 PDF 支撑 |
| 07_life_milestones | 7 阶段 | **足够** | 46+ 阶段可加分细节 |
| 08_endings | 21 结局 | **平衡** | 缺明确 fail 类别（已补 10 个） |

#### C. 价值观一致性检查

- ✅ 08_endings.csv 中 `fail=0`，符合 09_worldview.md "不羞辱玩家选择"
- ✅ 04_actions.csv 中没有任何"纯正收益"行动，都有代价
- ✅ 09_worldview.md 与 06_health_rules.csv 价值观一致（健康是不可透支的硬约束）
- ✅ 04_actions.cash 字段单位统一为"千元/月"（虽然不是用户原约束，但是合理调整）

### 1.3 互补点识别（数据 → 游戏机制的 gap）

你列的 4 个使用步骤里，**真正的 gap**：

```
现有数据                          游戏引擎需要
─────────────────                ──────────────────
04_actions (168 条)              → 引擎 action_pool.json
05_events (250 条)               → 引擎 event_pool.json
01_career_roles (55 行)          → 引擎 salary_lookup.csv
02_city_costs (20 城市)          → 引擎 city_modifier.json
03_company_types (8 类型)         → 引擎 company_archetype.json
06_health_rules (26 条)          → 引擎 health_decay_rules.json
07_life_milestones (7 阶段)      → 引擎 age_stage_modifier.json
08_endings (21 结局)             → 引擎 ending_tree.json
09_worldview.md                   → 引擎 tone_modifier.json

gap：                          数据缺失
─────────────────                ──────────────────
failure_endings (0 个)           → 引擎 fail_endings.json（已补 10 个）
addiction_recovery 行动         → 引擎 action_pool.json（已补 10 条）
nutrition 行动                  → 引擎 action_pool.json（已补 14 条）
source_url 完整性              → 引擎 source_audit.json（已补 11 条）
confidence 完整性              → 引擎 confidence_audit.json（已补 4 条）
hidden 触发组合               → 引擎 hidden_trigger_matrix.json（待生成）
balance 难度曲线                → 引擎 difficulty_curve.json（待生成）
```

---

## 2. 4 个小修的预备数据

### 2.1 小修 1：扩展 subcategory

**现状**：04_actions.csv 出现两个原规则外的新 subcategory：
- `nutrition`
- `addiction_recovery`

**预备数据**：
- `supplementary/nutrition_actions.csv`（14 条行动）
- `supplementary/addiction_recovery_actions.csv`（10 条行动）

**完整 subcategory 集合**（建议系统支持）：
```
原 24 个：foundations / ai_tools / portfolio / visibility / job_search / daily_work / deep_work / 
         job_change / side_income / second_curve / venture / cash_management / 
         digital_entertainment / media_reading / body_repair / mind_repair / 
         life_ritual / outdoor_nature / maker_hobby / friendship / family / 
         network / safety_net / life_admin

新增 2 个：
  nutrition          # 饮食与营养
  addiction_recovery # 戒断与成瘾恢复（含短视频/游戏/酒精/烟草/购物等）
```

### 2.2 小修 2：补 11 条空 source_url

**预备数据**：`supplementary/source_url_patches.csv`（11 条）

每条都给了：
- `suggested_source_name`（可点击的权威来源）
- `suggested_source_url`（具体页面 URL）
- `confidence`（high/medium）
- `patch_reason`（为什么这个来源合适）

执行方式：用户可直接复制 `suggested_source_url` 列覆盖 04_actions.csv 对应行的 source_url 字段。

### 2.3 小修 3：自由职业补 confidence

**预备数据**：`supplementary/confidence_patches.csv`（4 条）

涵盖：
- 自由职业：source_url + confidence=medium
- 远程：source_url
- 创业：confidence 保持原值

### 2.4 小修 4：补失败结局

**预备数据**：`supplementary/fail_endings.csv`（10 个）

10 个明确 fail 结局：

| ending_id | 标题 | success_level |
|---|---|---|
| burnout_collapse | 燃尽崩溃 | tragic |
| cash_flow_bankrupt | 现金流断裂 | tragic |
| skill_obsolete | 技能过时 | tragic |
| relationship_bankrupt | 关系破裂 | tragic |
| startup_failure | 创业失败 | tragic |
| long_term_unemployed | 长期失业 | tragic |
| health_shutdown | 健康停摆 | tragic |
| stuck_indie | 独立开发者困境 | mixed |
| depression_chronic | 慢性抑郁 | tragic |
| lost_purpose | 失去意义感 | mixed |

**关键设计原则**：
- 8 个 tragic + 2 个 mixed（**不是 100% 负面**，保留 dignity）
- 每个结局都有真实参考（脉脉/猎聘/36Kr/IT 桔子等公开数据）
- 文案有人性温度，避免"loser"标签
- 条件明确可触发（如 `burnout>=85;health<=25`）

---

## 3. 系统升级详细方案（4 步走）

### Step 1：导入 04_actions.csv → 数据驱动行动池

**字段映射**：

| CSV 字段 | 引擎内部字段 | 类型 | 说明 |
|---|---|---|---|
| action_id | id | string | 唯一标识 |
| name | display_name | string | 中文显示名 |
| primary_category | category | enum | growth / career / income / recovery / relationship_safety |
| subcategory | subcategory | enum | 见 2.1 节完整列表 |
| duration_months | duration | int | 0 = 即时，1 = 1 月循环 |
| mental / health / burnout / cash / tech_xp / ai_xp / reputation_xp / relation / identity / focus / fatigue / boundary_score | effects.{mental} / {health} / ... | object | 数值 effect |
| stress_level | stress | enum | 0/1/2/3 |
| repeat_key | repeat_group | string | 同类行动共享 key |
| cooldown_months | cooldown | int | 重复最小间隔 |
| requirement | unlock_condition | string | 前置条件 |
| risk_label / benefit_label | ui_labels | object | UI 显示用 |
| real_world_logic | rationale | string | 真实世界逻辑 |
| source_name / source_url / confidence | source | object | 来源审计 |

**重要数值约定**：
- `cash` 字段：单位"千元/月"，5.0 = 5000 元/月，-20 = -20000 元/月
- `effects` 范围：-20 到 +20
- `stress_level` 只用 0/1/2/3（不要 4+）

**执行步骤**：
```
1. 读取 04_actions.csv
2. 字段映射（如上表）
3. 写入引擎 action_pool.json
4. 增加 nutrition / addiction_recovery 两个 subcategory 枚举
5. 运行单元测试（见第 6 节）
```

### Step 2：导入 05_events.jsonl → 事件触发池

**字段映射**：

| JSONL 字段 | 引擎内部字段 | 说明 |
|---|---|---|
| id | id | event_0001 等 |
| category | category | work / career / learning / ai / health / money / relationship / life / entertainment |
| subcategory | subcategory | 自由发挥 |
| title | title | 短标题 |
| text | description | 事件文案（≤100 字） |
| tone | tone | wry / sharp / gentle / realistic / funny |
| rarity | rarity | common / uncommon / rare |
| trigger | trigger_condition | 前置条件（如 employed / freelancer） |
| effect | effects | object，键值匹配 stat 名 |
| source_name / source_url / confidence | source | 来源审计 |

**事件触发逻辑设计**（我建议）：
```python
def should_trigger(event, player_state):
    # 1. rarity 概率
    if event.rarity == "common" and random() > 0.30: return False  # 30% 触发
    if event.rarity == "uncommon" and random() > 0.10: return False
    if event.rarity == "rare" and random() > 0.03: return False
    
    # 2. trigger 前置条件
    if event.trigger == "employed" and player_state.job != "employed": return False
    if event.trigger == "freelancer" and player_state.job != "freelancer": return False
    
    # 3. 上下文匹配（基于 subcategory）
    if event.category == "work" and player_state.week < 4: return False  # 入职 4 周内不触发
    
    return True
```

**合并建议**：
- 你提到 V1 popup pool 有 1325 条
- 新增 250 条 → 总计 1575 条
- 引擎侧需要：每 10-20 条事件中抽 1 条，按 rarity 比例

### Step 3：导入 01/02/03/06/07 → 重构世界规则

**字段映射策略**：

| 文件 | 引擎用途 | 关键字段 |
|---|---|---|
| 01_career_roles.csv | salary_lookup[(role, level, city_tier, company_type)] | typical_salary_month + bonus_months |
| 02_city_costs.csv | city_modifier[city] | rent_shared/rent_single + pressure_score |
| 03_company_types.csv | company_archetype[company_type] | salary_coef + overtime_risk 等 |
| 06_health_rules.csv | health_decay_rules[factor] | short_term_effect + long_term_effect |
| 07_life_milestones.csv | age_stage_modifier[(age_min, age_max)] | typical_pressure + opportunities + risks |

**使用方式示例**：
```python
# 计算玩家当前月薪
def calculate_salary(player):
    base = salary_lookup[(player.role, player.level, player.city_tier)]
    archetype = company_archetype[player.company_type]
    years_exp_bonus = player.years_exp * 500
    return (base * archetype.salary_coef) + years_exp_bonus
```

### Step 4：导入 08/09 → 结局系统 + 价值观校准

**结局触发优先级**（我建议）：
```
1. 检查 fail_endings（10 个）—— 满足条件立即触发
2. 检查 hidden_endings（4 个）—— 满足触发组合触发
3. 检查 balance_endings（6 个）—— 健康 + 工作平衡指标
4. 检查 tech_endings（4 个）—— 技术影响力
5. 检查 capital_endings（3 个）—— 财富指标
6. 检查 normal_endings（3 个）—— 默认结局
```

**价值观校准 checklist**（基于 09_worldview.md）：
- ✅ fail 结局不羞辱玩家，文案有人性温度
- ✅ balance 与 tech/capital 持平
- ✅ health 是不可透支硬约束
- ✅ AI 是工具不是威胁
- ✅ 多元成功路径

---

## 4. 数据接入游戏引擎的接口规范

### 4.1 文件命名约定

```
引擎配置目录:
data/
├── action_pool.json          (来自 04_actions.csv)
├── event_pool.jsonl          (来自 05_events.jsonl)
├── salary_lookup.json         (来自 01_career_roles.csv)
├── city_modifier.json         (来自 02_city_costs.csv)
├── company_archetype.json     (来自 03_company_types.csv)
├── health_decay_rules.json    (来自 06_health_rules.csv)
├── age_stage_modifier.json    (来自 07_life_milestones.csv)
├── ending_tree.json           (来自 08_endings.csv + fail_endings)
├── tone_modifier.json         (来自 09_worldview.md)
└── source_audit.json          (来自 10_sources.md)
```

### 4.2 JSON Schema 示例

**action_pool.json schema**：
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "patternProperties": {
    "^[A-Z][0-9]{3}$": {
      "type": "object",
      "required": ["display_name", "category", "subcategory", "duration", "effects", "stress"],
      "properties": {
        "display_name": {"type": "string"},
        "category": {"enum": ["growth", "career", "income", "recovery", "relationship_safety"]},
        "subcategory": {"type": "string"},
        "duration": {"type": "integer", "minimum": 0},
        "effects": {
          "type": "object",
          "properties": {
            "mental": {"type": "number", "minimum": -20, "maximum": 20},
            "health": {"type": "number", "minimum": -20, "maximum": 20},
            "burnout": {"type": "number", "minimum": -20, "maximum": 20},
            "cash": {"type": "number", "minimum": -20, "maximum": 20, "description": "单位：千元/月"},
            "tech_xp": {"type": "number"},
            "ai_xp": {"type": "number"},
            "reputation_xp": {"type": "number"},
            "relation": {"type": "number"},
            "identity": {"type": "number"},
            "focus": {"type": "number"},
            "fatigue": {"type": "number"},
            "boundary_score": {"type": "number"}
          }
        },
        "stress": {"enum": [0, 1, 2, 3]},
        "repeat_group": {"type": "string"},
        "cooldown": {"type": "integer", "minimum": 0},
        "unlock_condition": {"type": "string"},
        "ui_labels": {
          "type": "object",
          "properties": {
            "risk": {"type": "string"},
            "benefit": {"type": "string"}
          }
        },
        "rationale": {"type": "string"},
        "source": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "url": {"type": "string", "format": "uri"},
            "confidence": {"enum": ["high", "medium", "low"]}
          }
        }
      }
    }
  }
}
```

### 4.3 数值校准建议

| 数值 | 当前范围 | 建议范围 | 说明 |
|---|---|---|---|
| `cash` | -20 到 +20 千元/月 | **-15 到 +10** | 真实收入差距不会瞬间 ±20000 |
| `mental / health` | -20 到 +20 | **-10 到 +10** | 单次行动不应一次摧毁心理 |
| `burnout` | -20 到 +20 | **-8 到 +15** | 燃尽累积慢、爆发快 |
| `stress_level` | 0/1/2/3 | **保持** | 已合理 |
| `boundary_score` | -20 到 +20 | **-10 到 +10** | 边界感变化较缓 |
| `fatigue` | -20 到 +20 | **-8 到 +12** | 疲劳累积快、恢复慢 |

**校准理由**：原 ±20 太宽，单次行动可能瞬间大幅改变状态。建议缩小到更"渐进"的范围，让游戏节奏更自然。

### 4.4 平衡难度设计

**目标**：玩家 30-60 分钟游戏周期内，体验 50-100 次行动 + 触发 5-15 次事件 + 1 个结局。

**行动池使用频率**（建议）：
```python
# 每 10 个行动中各类比例
category_targets = {
    "growth": 2,           # 20%
    "career": 3,           # 30%
    "income": 1,           # 10%
    "recovery": 3,         # 30%
    "relationship_safety": 1  # 10%
}
```

**事件触发频率**：
- common 事件：每 5-10 分钟 1 次
- uncommon 事件：每 20-30 分钟 1 次
- rare 事件：每局 1-2 次

**健康/燃尽累积曲线**（建议）：
```
周 0:    health=80, burnout=10
周 4:    health=70, burnout=25  （如果只刷短视频不运动）
周 12:   health=50, burnout=60  （逼近 fail_endings 触发条件）
周 24:   health=35, burnout=80  （进入 danger zone）
```

---

## 5. 风险清单与缓解

### 5.1 数据风险

| 风险 | 严重度 | 缓解 |
|---|---|---|
| 大厂薪资偏高 24/55 行 | 中 | 加权重或补二三线中小厂样本 |
| 隐形 95% 男性偏向 | 中 | 下一轮单独调研女程序员/40+ 程序员 |
| V2EX/脉脉 URL 部分是话题级 | 低 | 已 confidence=medium 标注 |
| 失败结局可能触发玩家不适 | 低 | 文案已有人性温度 + 文末给"第二次机会" |
| 半年后数据过时 | 高 | 建议每 6 月刷一次脉脉/猎聘 |

### 5.2 系统风险

| 风险 | 缓解 |
|---|---|
| 数据导入后游戏数值崩盘 | Step 3 数值校准建议先压缩范围 |
| 玩家快速达成结局 | 加 longevity 检查（最少 X 局后才能触发特定结局） |
| 失败结局太容易触发 | 把 fail_endings 触发条件从 hard threshold 改为渐进 |
| 行动池太丰富玩家选择疲劳 | 用 UI 推荐（基于当前 health/burnout 推荐行动） |

### 5.3 价值观风险

| 风险 | 缓解 |
|---|---|
| 资本结局被玩家当成"唯一成功" | UI 显式提示"多元成功路径" |
| 健康结局被当成"loser 结局" | fail_endings 文案加"第二次呼吸的机会" |
| AI 替代焦虑过强 | 05_events.ai category 25 条都用 wry 语气，避免恐吓 |

---

## 6. 测试用例建议

### 6.1 单元测试（数值校准）

```python
# test_action_balance.py
def test_no_pure_positive_action():
    """没有纯正收益的行动（每条都有代价）"""
    for action in load_actions():
        positive_count = sum(1 for v in action.effects.values() if v > 0)
        negative_count = sum(1 for v in action.effects.values() if v < 0)
        assert negative_count > 0, f"{action.id} 是纯正收益"

def test_cash_unit_consistency():
    """cash 字段单位统一（千元/月）"""
    for action in load_actions():
        if action.effects.get("cash"):
            assert -20 <= action.effects["cash"] <= 20

def test_subcategory_in_supported_set():
    """subcategory 在允许列表内"""
    supported = ["foundations", "ai_tools", ..., "nutrition", "addiction_recovery"]
    for action in load_actions():
        assert action.subcategory in supported

def test_id_uniqueness():
    """action_id 全局唯一"""
    ids = [a.id for a in load_actions()]
    assert len(ids) == len(set(ids))
```

### 6.2 集成测试（典型玩家路径）

**测试场景 1：稳定高级工程师路径**
```python
player = start_game(role="后端工程师", level="中级", city="北京", company_type="大厂")
# 30 周后
assert player.salary > 35000
assert player.health >= 60
assert player.burnout <= 50
assert ending_in_balance_endings(player)
```

**测试场景 2：燃尽崩溃路径**
```python
player = start_game(role="前端工程师", level="中级", city="深圳", company_type="大厂")
for _ in range(20):
    do_action(player, action="连续加班")
assert player.health <= 25
assert player.burnout >= 85
assert ending_in_fail_endings(player)
assert ending_id == "burnout_collapse"
```

**测试场景 3：35 岁转型**
```python
player.age = 35
player.tech_xp = 50  # 中等技术能力
player.cash = 800000
# 触发转行事件
assert can_trigger_event(player, "event_3month_unemployed")
# 转到 remote
player.company_type = "远程"
assert player.burnout < 30
assert ending_in_balance_endings(player)
```

### 6.3 平衡性测试

```python
def test_outcome_distribution():
    """运行 100 局模拟，统计结局分布"""
    outcomes = []
    for _ in range(100):
        player = random_player()
        play_30_minutes(player)
        outcomes.append(player.final_ending)
    
    # 期望分布
    fail_pct = sum(1 for o in outcomes if o.category == "fail") / 100
    balance_pct = sum(1 for o in outcomes if o.category == "balance") / 100
    tech_pct = sum(1 for o in outcomes if o.category == "tech") / 100
    capital_pct = sum(1 for o in outcomes if o.category == "capital") / 100
    
    assert 0.10 <= fail_pct <= 0.20, f"fail 占比 {fail_pct} 不在 10-20%"
    assert 0.15 <= balance_pct <= 0.30, f"balance 占比 {balance_pct} 不在 15-30%"
    assert 0.15 <= tech_pct <= 0.30, f"tech 占比 {tech_pct} 不在 15-30%"
    assert capital_pct <= 0.20, f"capital 占比 {capital_pct} > 20%"
```

---

## 7. 补充材料清单

```
E:\desktop\coderslife-realworld-data\supplementary\
├── 11-supplementary-analysis.md       ← 本文档
├── fail_endings.csv                    10 个失败结局
├── nutrition_actions.csv               14 条 nutrition 行动
├── addiction_recovery_actions.csv      10 条 addiction_recovery 行动
├── source_url_patches.csv              11 条 source_url 补充建议
└── confidence_patches.csv              4 条 confidence/source_url 补全
```

---

## 8. 下一步建议

### 8.1 立即可做（你这边）

- [ ] 确认导入顺序（我建议：04 → 05 → 01/02/03/06/07 → 08/09）
- [ ] 把 supplementary 5 个 CSV 作为待 review 物料
- [ ] 决定 subcategory 扩展（nutrition + addiction_recovery）
- [ ] 决定失败结局是否合并到 08_endings.csv

### 8.2 我这边可做（等你指令）

- [ ] 生成 hidden_trigger_matrix.json（4 个 hidden 结局的触发组合）
- [ ] 生成 difficulty_curve.json（基于数值校准建议）
- [ ] 抓更多女程序员/45+ 程序员样本
- [ ] 生成单元测试代码（Python）

### 8.3 半年后

- [ ] 刷新脉脉/猎聘/BOSS 实时数据
- [ ] 重新核对学术 PDF URL
- [ ] 增加二三线中小厂样本

---

> **本补充材料不混合到原 01-10 文件**——所有补充数据在 supplementary/ 子目录独立存在
> **用户决策点**：4 个小修是否合并到原文件、subcategory 是否扩展、失败结局何时导入
> **诚实版纪律**：所有补充数据都有可点击 URL，confidence 真实标记