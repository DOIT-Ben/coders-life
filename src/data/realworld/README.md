# src\data\realworld

本目录只保留**运行时被代码 import 的生成数据**（`realworld_*.json`，由 `src\config\realworld*.ts` 消费）。

原始调研数据（CSV / JSONL）、世界观与来源文档在 `tools\data\realworld\`，对应关系：

| 生成 JSON（本目录） | 原始来源（tools\data\realworld\） |
|---|---|
| realworld_career_roles.json | 01_career_roles.csv |
| realworld_city_costs.json | 02_city_costs.csv |
| realworld_company_types.json | 03_company_types.csv |
| realworld_actions.json | 04_actions.csv（含 addiction_recovery / nutrition 补充） |
| realworld_events.json | 05_events.jsonl |
| realworld_health_rules.json | 06_health_rules.csv |
| realworld_life_milestones.json | 07_life_milestones.csv |
| realworld_fail_endings.json | fail_endings.csv |

修改数值请改本目录 JSON 并同步更新原始 CSV 备注；新增数据维度先看 `tools\data\realworld\README.md` 的字段说明。
