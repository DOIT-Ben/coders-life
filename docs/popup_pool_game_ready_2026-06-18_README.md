# Popup Pool Game Ready README

日期：2026-06-18

## 已产出文件

- `E:\desktop\coders-life\data\popup_pool_structured_2026-06-18.csv`
- `E:\desktop\coders-life\data\popup_pool_structured_2026-06-18.json`
- `E:\desktop\coders-life\data\popup_pool_game_ready_2026-06-18.json`
- `E:\desktop\coders-life\程序员生存模拟器_弹窗库_2026-06-18.js`

## 条目总数

- `1325`

## game_ready 字段说明

每条数据结构：

```json
{
  "id": 1,
  "text": "需求又改版了",
  "category": "需求反复",
  "kind": "event",
  "tone": "resonant",
  "rarity": "uncommon",
  "effect": {
    "skill": 2,
    "mental": -8,
    "money": 0,
    "ai": 0
  },
  "trigger": {
    "minDay": 1
  }
}
```

## 推荐接入方式

当前正式入口是 `E:\desktop\coders-life\程序员生存模拟器.html`。运行时已经通过同目录的 `程序员生存模拟器_弹窗库_2026-06-18.js` 注入 `window.PROGRAMMER_POPUP_POOL`。

维护数据时推荐流程：

1. 修改 `docs\程序员生存模拟器_弹窗候选池_*.md` 源文档
2. 运行 `powershell -ExecutionPolicy Bypass -File .\tools\build-popup-datasets.ps1`
3. 运行 `node .\tools\verify-build-script.mjs` 校验构建脚本、坏行失败和 round 扩展边界
4. 生成并覆盖 `data\popup_pool_structured_2026-06-18.csv/json`
5. 生成 `data\popup_pool_game_ready_2026-06-18.json`
6. 同步导出根目录 `程序员生存模拟器_弹窗库_2026-06-18.js`
7. 打开 HTML 后检查 `window.PROGRAMMER_POPUP_POOL.length`

当前 source 范围：

- `1-240`：`work-core / 2026-06-17`
- `241-435`：`full-spectrum / 2026-06-18`
- `436-475`：`life-learning-extension / 2026-06-18-life-extension`
- `476-575`：`research-extension / 2026-06-18-research-extension`
- `576-695`：`round7-community-extension / 2026-06-18-round7`
- `696-815`：`round8-community-extension / 2026-06-18-round8`
- `816-935`：`round9-life-extension / 2026-06-18-round9-life`
- `936-1055`：`round9-learning-extension / 2026-06-18-round9-learning`
- `1056-1175`：`round10-learning-extension / 2026-06-18-round10-learning`
- `1176-1325`：`round11-life-extension / 2026-06-18-round11-life`

## 现成映射建议

- `event`：放进 `randomEvents`
- `learning`：优先绑定 `learn-ai`、`interview`
- `health`：优先绑定 `rest` 或长期随机触发
- `life`：优先绑定 `rest`、`networking`、长期轻事件
- `joke`：优先进入 `lightThoughts`

## 最小集成策略

如果先不想一次性接入 1325 条，可以先：

1. 用 `rarity != rare` 过滤掉最扎心一批
2. 只接入 `kind in [event, life, joke]`
3. 先抽 `100-150` 条作为第一版

这样最稳，也最容易看出节奏是否过密。
