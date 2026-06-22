# coders-life

程序员生存模拟器的大体量弹窗版。

当前正式弹窗池：`1325` 条。

## 入口

- `程序员生存模拟器.html`

## 资源

- `程序员生存模拟器_弹窗库_2026-06-18.js`
- `data/popup_pool_game_ready_2026-06-18.json`
- `data/popup_pool_structured_2026-06-18.csv`
- `data/popup_pool_structured_2026-06-18.json`

## 文档

- `docs/程序员生存模拟器_弹窗候选池_2026-06-17.md`
- `docs/程序员生存模拟器_弹窗候选池_全维度版_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_生活学习扩展_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_调研扩展_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_round7社区扩展_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_round8社区扩展_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_round9生活扩展_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_round9学习扩展_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_round10学习扩展_2026-06-18.md`
- `docs/程序员生存模拟器_弹窗候选池_round11生活扩展_2026-06-18.md`
- `docs/popup_pool_game_ready_2026-06-18_README.md`

## 工具

- `tools/build-popup-datasets.ps1`
- `tools/parse-popup-pool.ps1`（兼容入口，实际调用正式构建脚本）
- `tools/verify-build-script.mjs`
- `tools/verify-popup-pool.mjs`
- `tools/verify-game-mechanics.js`
- `tools/verify-save-system.mjs`
- `tools/verify-save-flow.mjs`
- `tools/verify-save-resume-context.mjs`
- `tools/verify-candidate-manifest.mjs`
- `tools/verify-career-boundary-loop.cjs`

## 说明

直接双击 `程序员生存模拟器.html` 即可运行。HTML 与弹窗库 JS 保持同目录，外部数据在 `data/` 中。

## 部署

- 生产发布目录只需要：
  - `程序员生存模拟器.html`
  - 头像已内联到 HTML，当前线上不需要额外静态资源
- 发布脚本：`deploy/publish-static-site.sh`
- `nginx` 配置模板：`deploy/nginx-coderslife.conf`
- 默认发布到：`/var/www/coderslife/current`

## 验证

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-popup-datasets.ps1
node .\tools\verify-build-script.mjs
node .\tools\verify-popup-pool.mjs
node .\tools\verify-game-mechanics.js
node .\tools\verify-save-system.mjs
node .\tools\verify-save-flow.mjs
node .\tools\verify-fun-loop.mjs
node .\tools\verify-save-resume-context.mjs
node .\tools\verify-candidate-manifest.mjs
node .\tools\verify-career-boundary-loop.cjs
```

## 当前机制

- 本地存档使用 `localStorage` 的 `codersLifeSave.v2`，会保存当前局状态、事件日志、稀有弹窗冷却、商店、成就和游戏结束状态。
- 有有效存档时首页会显示“继续上次生存”。
- 游戏每 7 天会在事件流里生成一次周报，不改界面，只增强阶段感。
- 内部有隐藏状态 `focus/fatigue/boundaryScore`，用于影响周报、边界复盘和即时事件反馈，不新增前端组件。
- 内部有隐藏状态 `buildProjectState/toolHabitState`，用于长期 Build 项目和工具学习转化反馈，会随存档保存和恢复。
- 读档后会在事件流顶部生成一条“接着玩提示”，提示上次停在哪、当前弱项和长期项目状态。
- `workbench\candidate-manifest.json` 管理调研候选素材状态；`pending` 表示研究 backlog，不会自动合入正式弹窗池。
- 游戏会在职业阶段里程碑生成隐藏阶段反馈，不新增前端组件，只写入事件日志和存档。
- 已有有效存档时误点职业卡会二次确认，避免覆盖上次进度。
- 隐藏状态也会解锁少量成就，例如深度专注、恢复意识、边界守护者、稳定节奏。
