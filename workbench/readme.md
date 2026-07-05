# workbench

## 当前状态（2026-07-04）

- 存档链路已修通：App 经 `saveManager.loadGame()` 读档（含迁移），「继续上次生存」可用。
- 弹窗事件池异步分包：引擎消费 `EVENTS` 前必须 `await ensureGameDataLoaded()`（App/脚本/测试 setup 已接）。
- 工程护栏：`npm run lint` 0 error / 0 warning，`react-hooks/set-state-in-effect` 已升回 error，已入 CI。
- 前端结构：`GameDialogs` 已拆到 `components\dialogs\`，组件文件均低于 500 行；6 个旧组件已删除。
- 结局体验：结局弹窗已升级为人生复盘报告，包含事故时间线、根因分析、影响面、下一局改进项和 Canvas PNG 战报卡。
- 留存入口：启动页已接入“今日人生”每日挑战，UTC 日期派生 seed，挑战局不覆盖普通存档，结局写入本地 30 天历史。
- 策略玩法：游戏内已接入“人生脚本”受限 DSL，支持白名单条件/行动、多行动月度计划、跑 12 个月/跑到结局和批量模拟脚本矩阵。
- 可访问性：人生终端具备焦点圈闭；390/768/1280 三档视口无横向溢出、无低于 44px 的可见交互目标。
- 测试：22 files / 226 tests 通过；lint / build / simulate / simulate:batch 门禁通过。

## 最近变更摘要

- 2026-07-04：批次 3 每日挑战（日期 seed、今日人生入口、本地 30 天历史、战报日期标签、排行榜接口 stub），详见 `docs\dev-records\2026-07-04-batch3-daily-challenge.md`。
- 2026-07-04：批次 4 人生脚本 DSL（受限 parser、真实月度执行器、脚本跑局 UI、批量模拟脚本矩阵、关系结局优先级修正），详见 `docs\dev-records\2026-07-04-batch4-life-script-dsl.md`。
- 2026-07-04：批次 2 结局 Postmortem + 战报卡片（结构化复盘、Canvas PNG、三类结局测试、三档视口审计），详见 `docs\dev-records\2026-07-04-batch2-ending-postmortem-share-card.md`。
- 2026-07-04：批次 1 工程清债（弹窗拆分、lint 清零、死组件删除、命令面板焦点圈闭、旧日志样式清理、触控尺寸补齐），详见 `docs\dev-records\2026-07-04-batch1-engineering-debt.md`。
- 2026-07-03：优化批次（存档修复、数据分包、护栏、引擎修正）+ 终端化前端重设计（暗色终端主题、commit log 日志、人生终端命令面板、P0 告警），详见 `docs\dev-records\2026-07-03-optimization-execution.md`。
