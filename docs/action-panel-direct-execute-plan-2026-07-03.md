# 行动面板直执行与后悔药规划

## 1. 第一性原理：当前阶段核心需求

右侧行动面板当前承担了“分类、搜索、选择多个行动、查看行动细节、执行月度计划”多重职责，信息密度过高。用户实际期望是更接近游戏回合制操作：看到行动后直接点击执行，而不是先加入计划再点“执行本月计划”。

本轮目标：

- 去掉“本月计划”和“执行本月计划”的主流程，让行动卡片点击直接执行该行动并推进时间。
- 行动卡片只展示基础属性：名称、核心收益、时间/精力成本和短句说明。
- 保留并放大收藏按钮，新增详情按钮，完整说明、风险、证据和限制进入详情弹窗。
- 增加“管理”入口，允许按分类显示/隐藏行动分类，减少滚动噪音。
- 增加撤销能力：执行行动前保存一次快照；拥有“后悔药”时可撤销最近一次行动。
- 在商店加入“后悔药”，价格 10000 元，每个阶段最多购买 1 瓶，作为撤销消耗品。

可验证成功标准：

- UI 测试证明点击行动直接推进到下个月，不再出现“执行本月计划”按钮。
- UI 测试证明详情按钮会打开行动详情弹窗，收藏按钮可独立操作。
- UI 测试证明管理入口可隐藏/显示行动分类。
- 逻辑测试证明后悔药价格为 10000、每阶段限购 1 瓶、撤销会消耗 1 瓶并恢复到行动前状态。
- `npm run test -- --maxWorkers=2` 和 `npm run build` 通过。

## 2. 成熟方法与复用依据

本轮不引入新依赖，复用项目已有模式：

- 使用现有 `applyAction(state, actionId)` / `planMonth(state, [actionId])` 作为单行动执行路径，不新造回合系统。
- 使用现有 `GameDialogs.tsx` 的 `ModalShell` 思路承载行动详情和管理弹窗，保持 modal 可访问性一致。
- 使用现有 `SHOP_ITEMS` / `buyShopItem` 模式加入“后悔药”，以 `inventory.undo_pill` 表示持有数量。
- 使用 `state.phase` 作为“阶段限购”的边界，记录 `flags.undo_pill_bought_<phase>`，不额外扩展复杂经济系统。
- 使用 React 本地 state 保存最近一次行动前快照，不写入复杂历史栈；撤销只覆盖“最近一次行动”，符合“后悔药”轻量设计。

## 3. 复用、适配与必要自研

复用：

- `applyAction` 负责实际执行并推进月份。
- `buyShopItem` 负责扣钱、加库存和写日志。
- `GameDialogs` 继续集中管理低频弹窗。
- `monthlyPlanUi.test.tsx` 承担用户流程测试。

适配：

- `GameContainer.tsx` 删除月度计划 UI 状态和提交按钮，改为 `executeActionNow(action)`。
- 行动卡片布局变为“整卡执行 + 右侧两个工具按钮”：收藏、详情。
- 分类管理不隐藏顶部分类按钮，而是决定行动列表中哪些分类参与展示；当前分类被隐藏时自动跳到第一个可见分类。
- 商店购买“后悔药”时检查当前阶段是否已买过，买过则禁用。

必要自研：

- `undoSnapshot` React state：保存最近一次行动前 `GameState`。
- `undoLastAction()`：检查 `inventory.undo_pill > 0`，恢复快照并消耗 1 瓶，写入撤销日志。
- `ActionDetailDialog`：展示完整行动说明、收益、风险、要求和证据。
- `ActionManageDialog`：展示分类开关。

## 4. 落地方案、风险与验证标准

落地顺序：

1. 写失败测试：直执行、详情、分类管理、后悔药购买和撤销。
2. 实现 `undo_pill` 商店配置与购买限制。
3. 调整 `GameContainer`：删除月度计划选择流程，点击行动直执行，新增撤销按钮和管理/详情入口。
4. 扩展 `GameDialogs`：行动详情弹窗和分类管理弹窗。
5. 调整 CSS：精简行动卡片，放大收藏/详情按钮，移除月度计划面板样式依赖。
6. 跑目标测试、全量测试、构建和浏览器 smoke。

主要风险：

- 直执行改变核心交互，可能影响原本多行动月度计划测试，需要更新测试语义。
- 撤销恢复快照会与存档、弹窗和事件选择状态交互，先限制为“最近一次行动且无待选择事件时可撤销”。
- 分类管理如果永久存储会引入迁移复杂度，本轮先用本地组件状态，不写入存档。

验证命令：

```powershell
$env:VITEST_MAX_WORKERS='2'; npx vitest run src/tests/monthlyPlanUi.test.tsx src/tests/v1FrontendContract.test.ts src/tests/shopSystem.test.ts --maxWorkers=2
$env:VITEST_MAX_WORKERS='2'; npm run test -- --maxWorkers=2
npm run build
```
