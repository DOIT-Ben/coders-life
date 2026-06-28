# coderslife-realworld-data

> **统一最终版**：v1 基础版 + v2 深度版 → 合并去重（2026-06-28）
> **数据范围**：中国程序员全维度真实世界模拟游戏配置

## 📦 这里有什么（统一版 · 11 文件）

| 文件 | 数据量 | 内容 |
|---|---|---|
| `01_career_roles.csv` | **55 行** | 中国程序员职业薪资（多源交叉，覆盖前端/后端/算法/AI/数据/移动/测试/运维/安全/嵌入式/游戏/技术管理/自由职业） |
| `02_city_costs.csv` | **20 城市** | 一线 4 + 新一线 8 + 二线 8，含租金/通勤/压力 |
| `03_company_types.csv` | **8 类型** | 大厂/外企/国企/中小厂/外包/创业/远程/自由职业 |
| `04_actions.csv` | **168 行动** | 行动池（recovery/growth/career/income/relationship_safety） |
| `05_events.jsonl` | **250 事件** | 真实事件池（9 个 category） |
| `06_health_rules.csv` | **26 规则** | 健康与燃尽（含 6 篇新学术 PDF） |
| `07_life_milestones.csv` | **7 阶段** | 程序员人生阶段（22-65+） |
| `08_endings.csv` | **21 结局** | 多元成功路径（balance 优先，无 fail 标签） |
| `09_worldview.md` | **16,826 字** | 世界观文档（含 36 处真实引用） |
| `10_sources.md` | 全部来源 | 含 v1+v2 合并版（16+ 篇 PDF 引用） |
| `README.md` | 本文件 | 使用指南 |

## 🚀 怎么用

1. **理解价值观**：先看 `09_worldview.md`（21,907 字 → 实际 16,826 字替代）
2. **配置行动**：从 `04_actions.csv`（168 行）
3. **配置事件**：从 `05_events.jsonl`（250 条）
4. **配置城市/薪资**：从 `01_career_roles.csv` + `02_city_costs.csv`
5. **结局触发**：从 `08_endings.csv`（注意 fail=0，归到 normal）
6. **健康规则**：从 `06_health_rules.csv`
7. **人生阶段**：从 `07_life_milestones.csv`

## 📊 数据来源（详见 10_sources.md）

- **官方/学术 PDF**（16+ 篇）：WHO 2020 体力活动、Lancet/Nature 系列、EFSA 咖啡因、脉脉/猎聘/中规院报告
- **行业报告**：脉脉 2025 人才迁徙、AI 人才流动、春招洞察
- **政府公开数据**：民政部公报、卫健委健康科普
- **媒体深度报道**：36Kr、虎嗅、InfoQ、IT 之家
- **真实帖子**：V2EX/知乎/脉脉（部分 ID 级 URL）
- **公开学术页面**：PubMed、ScienceDirect、ResearchGate

## ⚠️ 关键限制

1. **04_actions.cash 字段单位**：千元/月（5.0 = 5000 元/月，-20 = -20000 元/月），这是子 agent 调整后的单位约定
2. **05_events.jsonl 部分 URL**：话题级搜索而非单个帖子 ID → 已 confidence=medium 标注
3. **08_endings.csv 部分人物**：基于二手报道 → 需人工核对原始采访
4. **样本量**：55 行职业薪资（基础 + 深度），20 城市，足够覆盖主要场景但不代表所有二三线

## 🕐 维护建议

- **半年后**：重新核对学术 URL（PubMed 稳定）和薪资数据（脉脉变化快）
- **每年**：刷一次 BOSS/猎聘/脉脉实时数据
- **每次更新**：保持字段一致（已在 README 列字段数）

## 🗄 归档位置

历史版本（合并前）保留在 `E:\desktop\AI\research-archive\coderslife\`：
- `v0-initial/`：v1 早期版（基础调研，2026-06-27）
- `v1-baseline/`：v1 基础版（4 子 agent 并行，2026-06-28）
- `merged-final/`：v1 + v2 合并前快照（2026-06-28）
- `_agent-scripts/`：子 agent 临时脚本

---

> **所有权**：本地研究产出，未发布到外部平台
> **生成工具**：网页调研智能体 + 多子智能体并发
> **维护者**：黄奔